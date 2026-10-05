import assert from 'node:assert/strict';
import Database from 'better-sqlite3';

const base = `http://localhost:${process.env.PORT}/api/encuestas`;
let ok = 0, fail = 0;
const check = async (nombre, fn) => {
  try { await fn(); ok++; console.log('PASS', nombre); }
  catch (e) { fail++; console.log('FAIL', nombre, '-', e.message.split('\n')[0]); }
};
const call = async (method, path = '', body, raw) => {
  const res = await fetch(base + path, {
    method,
    headers: body !== undefined || raw !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};
const esperar = (r, status, mensaje) => {
  assert.equal(r.status, status, `status ${r.status} (${JSON.stringify(r.body)})`);
  if (mensaje) assert.match(r.body.mensaje, mensaje);
};

await check('lista vacía', async () => { const r = await call('GET'); esperar(r, 200); assert.deepEqual(r.body, []); });
await check('crear sin titulo -> 400 {mensaje}', async () => esperar(await call('POST', '', {}), 400, /titulo/));
await check('crear con titulo numérico -> 400', async () => esperar(await call('POST', '', { titulo: 5 }), 400));
await check('JSON malformado -> 400 {mensaje}', async () => esperar(await call('POST', '', undefined, '{"titulo":'), 400));
await check('crear -> 201 borrador, ISO date-time, sin preguntas', async () => {
  const r = await call('POST', '', { titulo: ' Satisfaccion ', descripcion: 'Trimestral', estado: 'publicada' });
  esperar(r, 201);
  assert.equal(r.body.id, 1);
  assert.equal(r.body.titulo, 'Satisfaccion');
  assert.equal(r.body.estado, 'borrador'); // el cliente no puede fijar el estado
  assert.match(r.body.fechaCreacion, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.deepEqual(r.body.preguntas, []);
  assert.equal(r.body.descripcion, 'Trimestral');
});
await check('GET /1 detalle', async () => { const r = await call('GET', '/1'); esperar(r, 200); assert.equal(r.body.titulo, 'Satisfaccion'); });
await check('GET /abc -> 400', async () => esperar(await call('GET', '/abc'), 400));
await check('GET /0 -> 400', async () => esperar(await call('GET', '/0'), 400));
await check('GET /999 -> 404 con id en mensaje', async () => esperar(await call('GET', '/999'), 404, /999/));
await check('PUT en borrador -> 200', async () => {
  const r = await call('PUT', '/1', { titulo: 'Satisfaccion 2' });
  esperar(r, 200); assert.equal(r.body.titulo, 'Satisfaccion 2'); assert.equal(r.body.descripcion, null);
});
await check('PUT sin titulo -> 400', async () => esperar(await call('PUT', '/1', {}), 400));
await check('PUT inexistente -> 404', async () => esperar(await call('PUT', '/999', { titulo: 'x' }), 404));

await check('pregunta con 1 opción -> 400', async () => esperar(await call('POST', '/1/preguntas', { enunciado: 'a', opciones: ['x'] }), 400, /opciones/));
await check('pregunta sin opciones -> 400', async () => esperar(await call('POST', '/1/preguntas', { enunciado: 'a' }), 400));
await check('pregunta opciones repetidas -> 400', async () => esperar(await call('POST', '/1/preguntas', { enunciado: 'a', opciones: ['x', ' x '] }), 400, /repetirse/));
await check('pregunta en encuesta inexistente -> 404', async () => esperar(await call('POST', '/999/preguntas', { enunciado: 'a', opciones: ['x', 'y'] }), 404));
await check('crear pregunta -> 201 id 1, sin campo tipo', async () => {
  const r = await call('POST', '/1/preguntas', { enunciado: '¿Te gustó?', opciones: ['Sí', 'No'] });
  esperar(r, 201); assert.deepEqual(r.body, { id: 1, enunciado: '¿Te gustó?', opciones: ['Sí', 'No'] });
});
await check('segunda pregunta -> 201 id 2', async () => {
  const r = await call('POST', '/1/preguntas', { enunciado: 'Colores', opciones: ['Rojo', 'Azul', 'Verde'] });
  esperar(r, 201); assert.equal(r.body.id, 2);
});
await check('pregunta temporal + DELETE pregunta -> 204 y luego 404', async () => {
  const p = await call('POST', '/1/preguntas', { enunciado: 'Borrar', opciones: ['a', 'b'] });
  assert.equal(p.body.id, 3);
  esperar(await call('DELETE', '/1/preguntas/3'), 204);
  esperar(await call('DELETE', '/1/preguntas/3'), 404);
  esperar(await call('DELETE', '/1/preguntas/x'), 400);
});
await check('GET /1 incluye preguntas con opciones (2)', async () => {
  const r = await call('GET', '/1'); assert.equal(r.body.preguntas.length, 2);
  assert.deepEqual(r.body.preguntas[1].opciones, ['Rojo', 'Azul', 'Verde']);
});

await check('responder en borrador -> 409', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 1, valor: 'Sí' }] }), 409, /publicadas/));
await check('PATCH estado inválido (borrador) -> 400', async () => esperar(await call('PATCH', '/1/estado', { estado: 'borrador' }), 400));
await check('PATCH borrador->cerrada -> 409', async () => esperar(await call('PATCH', '/1/estado', { estado: 'cerrada' }), 409));
await check('publicar sin preguntas -> 409', async () => {
  const e = await call('POST', '', { titulo: 'Vacía' }); assert.equal(e.body.id, 2);
  esperar(await call('PATCH', '/2/estado', { estado: 'publicada' }), 409, /sin preguntas/);
});
await check('PATCH inexistente -> 404', async () => esperar(await call('PATCH', '/999/estado', { estado: 'publicada' }), 404));
await check('publicar -> 200 publicada', async () => { const r = await call('PATCH', '/1/estado', { estado: 'publicada' }); esperar(r, 200); assert.equal(r.body.estado, 'publicada'); });
await check('publicar de nuevo -> 409', async () => esperar(await call('PATCH', '/1/estado', { estado: 'publicada' }), 409));
await check('PUT en publicada -> 409', async () => esperar(await call('PUT', '/1', { titulo: 'x' }), 409));
await check('agregar pregunta en publicada -> 409', async () => esperar(await call('POST', '/1/preguntas', { enunciado: 'a', opciones: ['x', 'y'] }), 409));
await check('eliminar pregunta en publicada -> 409', async () => esperar(await call('DELETE', '/1/preguntas/1'), 409));

await check('respuesta sin participanteId -> 400', async () => esperar(await call('POST', '/1/respuestas', { respuestas: [{ preguntaId: 1, valor: 'Sí' }] }), 400));
await check('respuesta con lista vacía -> 400', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [] }), 400));
await check('respuesta item null -> 400 (no 500)', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [null] }), 400));
await check('respuesta opción inexistente -> 400', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 1, valor: 'Quizás' }] }), 400));
await check('respuesta preguntaId de otra encuesta -> 400', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 99, valor: 'Sí' }] }), 400));
await check('dos opciones para la misma pregunta -> 400', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 1, valor: 'Sí' }, { preguntaId: 1, valor: 'No' }] }), 400));
await check('respuesta repetida -> 400', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 2, valor: 'Rojo' }, { preguntaId: 2, valor: 'Rojo' }] }), 400));
await check('encuesta inexistente -> 404', async () => esperar(await call('POST', '/999/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 1, valor: 'Sí' }] }), 404));
await check('fallos no dejan datos parciales', async () => { const r = await call('GET', '/1/resultados'); assert.equal(r.body.totalParticipantes, 0); });
await check('respuesta válida a1 -> 201 sin cuerpo', async () => {
  const r = await call('POST', '/1/respuestas', { participanteId: 'a1', respuestas: [{ preguntaId: 1, valor: 'Sí' }, { preguntaId: 2, valor: 'Azul' }] });
  esperar(r, 201); assert.equal(r.body, null);
});
await check('mismo participante -> 409', async () => esperar(await call('POST', '/1/respuestas', { participanteId: ' a1 ', respuestas: [{ preguntaId: 1, valor: 'No' }] }), 409, /ya respondio/));
await check('respuesta válida a2 -> 201', async () => esperar(await call('POST', '/1/respuestas', { participanteId: 'a2', respuestas: [{ preguntaId: 1, valor: 'No' }, { preguntaId: 2, valor: 'Rojo' }] }), 201));
await check('resultados correctos', async () => {
  const r = await call('GET', '/1/resultados'); esperar(r, 200);
  assert.deepEqual(r.body, {
    encuestaId: 1, totalParticipantes: 2,
    preguntas: [
      { preguntaId: 1, enunciado: '¿Te gustó?', resultados: [{ opcion: 'Sí', cantidad: 1, porcentaje: 50 }, { opcion: 'No', cantidad: 1, porcentaje: 50 }] },
      { preguntaId: 2, enunciado: 'Colores', resultados: [{ opcion: 'Rojo', cantidad: 1, porcentaje: 50 }, { opcion: 'Azul', cantidad: 1, porcentaje: 50 }, { opcion: 'Verde', cantidad: 0, porcentaje: 0 }] },
    ],
  });
});
await check('resultados encuesta sin respuestas -> total 0, % 0', async () => {
  const e = await call('POST', '', { titulo: 'Tres' }); await call('POST', `/${e.body.id}/preguntas`, { enunciado: 'q', opciones: ['a', 'b'] });
  const r = await call('GET', `/${e.body.id}/resultados`);
  assert.equal(r.body.totalParticipantes, 0); assert.equal(r.body.preguntas[0].resultados[0].porcentaje, 0);
});
await check('resultados inexistente -> 404', async () => esperar(await call('GET', '/999/resultados'), 404));

await check('la base impide 2 opciones para la misma pregunta (PK)', async () => {
  const db = new Database(process.env.DB_PATH);
  db.pragma('foreign_keys = ON');
  assert.throws(
    () => db.prepare('INSERT INTO detalle_respuesta (respuesta_id, pregunta_id, opcion_id) VALUES (1, 1, 2)').run(),
    (e) => e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
  );
  db.close();
});
await check('DELETE con respuestas -> 409', async () => esperar(await call('DELETE', '/1'), 409, /respuestas/));
await check('DELETE borrador -> 204, cascada y luego 404', async () => {
  esperar(await call('DELETE', '/3'), 204);
  esperar(await call('GET', '/3'), 404);
  const db = new Database(process.env.DB_PATH, { readonly: true });
  assert.equal(db.prepare('SELECT COUNT(*) n FROM pregunta WHERE encuesta_id = 3').get().n, 0);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM opcion WHERE pregunta_id NOT IN (SELECT id FROM pregunta)').get().n, 0);
  db.close();
});
await check('DELETE inexistente -> 404', async () => esperar(await call('DELETE', '/999'), 404));
await check('cerrar -> 200; responder cerrada -> 409; resultados siguen', async () => {
  esperar(await call('PATCH', '/1/estado', { estado: 'cerrada' }), 200);
  esperar(await call('POST', '/1/respuestas', { participanteId: 'a9', respuestas: [{ preguntaId: 1, valor: 'Sí' }] }), 409);
  esperar(await call('GET', '/1/resultados'), 200);
  esperar(await call('PATCH', '/1/estado', { estado: 'publicada' }), 409);
});
await check('lista: solo campos de resumen', async () => {
  const r = await call('GET'); assert.deepEqual(Object.keys(r.body[0]), ['id', 'titulo', 'estado', 'fechaCreacion']);
});
await check('ruta desconocida -> 404 {mensaje}', async () => {
  const res = await fetch(`http://localhost:${process.env.PORT}/otra`); const b = await res.json();
  assert.equal(res.status, 404); assert.ok(b.mensaje);
});
await check('CORS habilitado', async () => {
  const res = await fetch(base, { headers: { Origin: 'http://frontend.local' } });
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
});

console.log(`\n${ok} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
