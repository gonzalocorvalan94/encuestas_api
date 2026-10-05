import db from '../config/db.js';

export const obtenerEstado = (id) =>
  db.prepare('SELECT estado FROM encuesta WHERE id = ?').get(id)?.estado;

export const obtenerTodas = () =>
  db.prepare(
    'SELECT id, titulo, estado, fecha_creacion AS fechaCreacion FROM encuesta ORDER BY id'
  ).all();

const preguntasDe = (encuestaId) => {
  const preguntas = db
    .prepare('SELECT id, enunciado FROM pregunta WHERE encuesta_id = ? ORDER BY id')
    .all(encuestaId);
  const opciones = db
    .prepare(
      `SELECT o.pregunta_id, o.valor FROM opcion o
       JOIN pregunta p ON p.id = o.pregunta_id
       WHERE p.encuesta_id = ? ORDER BY o.id`
    )
    .all(encuestaId);
  return preguntas.map((p) => ({
    ...p,
    opciones: opciones.filter((o) => o.pregunta_id === p.id).map((o) => o.valor),
  }));
};

export const obtenerPorId = (id) => {
  const encuesta = db
    .prepare(
      `SELECT id, titulo, estado, fecha_creacion AS fechaCreacion, descripcion
       FROM encuesta WHERE id = ?`
    )
    .get(id);
  return encuesta && { ...encuesta, preguntas: preguntasDe(id) };
};

export const crear = ({ titulo, descripcion }) => {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO encuesta (titulo, descripcion) VALUES (?, ?)')
    .run(titulo, descripcion);
  return obtenerPorId(Number(lastInsertRowid));
};

export const actualizar = (id, { titulo, descripcion }) => {
  db.prepare('UPDATE encuesta SET titulo = ?, descripcion = ? WHERE id = ?')
    .run(titulo, descripcion, id);
  return obtenerPorId(id);
};

export const eliminar = (id) =>
  db.prepare('DELETE FROM encuesta WHERE id = ?').run(id);

export const tieneRespuestas = (id) =>
  db.prepare('SELECT 1 FROM respuesta WHERE encuesta_id = ? LIMIT 1').get(id) !== undefined;

export const contarPreguntas = (id) =>
  db.prepare('SELECT COUNT(*) AS n FROM pregunta WHERE encuesta_id = ?').get(id).n;

export const cambiarEstado = (id, estado) => {
  db.prepare('UPDATE encuesta SET estado = ? WHERE id = ?').run(estado, id);
  return obtenerPorId(id);
};

export const agregarPregunta = (encuestaId, { enunciado, opciones }) =>
  db.transaction(() => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO pregunta (encuesta_id, enunciado) VALUES (?, ?)')
      .run(encuestaId, enunciado);
    const preguntaId = Number(lastInsertRowid);
    const insertar = db.prepare('INSERT INTO opcion (pregunta_id, valor) VALUES (?, ?)');
    for (const valor of opciones) insertar.run(preguntaId, valor);
    return { id: preguntaId, enunciado, opciones };
  })();

// Reemplaza el enunciado y todas las opciones. Devuelve undefined si la pregunta no existe en la encuesta
export const actualizarPregunta = (encuestaId, preguntaId, { enunciado, opciones }) =>
  db.transaction(() => {
    const { changes } = db
      .prepare('UPDATE pregunta SET enunciado = ? WHERE id = ? AND encuesta_id = ?')
      .run(enunciado, preguntaId, encuestaId);
    if (changes === 0) return undefined;

    db.prepare('DELETE FROM opcion WHERE pregunta_id = ?').run(preguntaId);
    const insertar = db.prepare('INSERT INTO opcion (pregunta_id, valor) VALUES (?, ?)');
    for (const valor of opciones) insertar.run(preguntaId, valor);
    return { id: preguntaId, enunciado, opciones };
  })();

export const eliminarPregunta = (encuestaId, preguntaId) =>
  db
    .prepare('DELETE FROM pregunta WHERE id = ? AND encuesta_id = ?')
    .run(preguntaId, encuestaId).changes > 0;

// Devuelve { id } de la opción, o undefined si no pertenece a esa pregunta/encuesta
export const buscarOpcion = (encuestaId, preguntaId, valor) =>
  db
    .prepare(
      `SELECT o.id FROM opcion o
       JOIN pregunta p ON p.id = o.pregunta_id
       WHERE p.encuesta_id = ? AND p.id = ? AND o.valor = ?`
    )
    .get(encuestaId, preguntaId, valor);

export const existeParticipante = (encuestaId, participanteId) =>
  db
    .prepare('SELECT 1 FROM respuesta WHERE encuesta_id = ? AND participante_id = ?')
    .get(encuestaId, participanteId) !== undefined;

export const registrarRespuesta = (encuestaId, participanteId, detalles) =>
  db.transaction(() => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO respuesta (encuesta_id, participante_id) VALUES (?, ?)')
      .run(encuestaId, participanteId);
    const insertar = db.prepare(
      'INSERT INTO detalle_respuesta (respuesta_id, pregunta_id, opcion_id) VALUES (?, ?, ?)'
    );
    for (const { preguntaId, opcionId } of detalles) {
      insertar.run(lastInsertRowid, preguntaId, opcionId);
    }
  })();

export const obtenerResultados = (encuestaId) => {
  const { total } = db
    .prepare('SELECT COUNT(*) AS total FROM respuesta WHERE encuesta_id = ?')
    .get(encuestaId);

  const filas = db
    .prepare(
      `SELECT p.id AS preguntaId, p.enunciado, o.valor AS opcion,
              COUNT(d.respuesta_id) AS cantidad
       FROM pregunta p
       LEFT JOIN opcion o ON o.pregunta_id = p.id
       LEFT JOIN detalle_respuesta d ON d.opcion_id = o.id
       WHERE p.encuesta_id = ?
       GROUP BY p.id, o.id
       ORDER BY p.id, o.id`
    )
    .all(encuestaId);

  const porPregunta = new Map();
  for (const f of filas) {
    if (!porPregunta.has(f.preguntaId)) {
      porPregunta.set(f.preguntaId, {
        preguntaId: f.preguntaId,
        enunciado: f.enunciado,
        resultados: [],
      });
    }
    if (f.opcion !== null) {
      porPregunta.get(f.preguntaId).resultados.push({
        opcion: f.opcion,
        cantidad: f.cantidad,
        porcentaje: total ? Math.round((f.cantidad / total) * 1000) / 10 : 0,
      });
    }
  }
  return { encuestaId, totalParticipantes: total, preguntas: [...porPregunta.values()] };
};