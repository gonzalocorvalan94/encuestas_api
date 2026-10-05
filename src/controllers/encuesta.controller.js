import * as Encuesta from '../models/encuesta.model.js';
import { crearError } from '../middlewares/errorHandler.js';
import {
  validar,
  paramsEncuesta,
  paramsPregunta,
  encuestaSchema,
  estadoSchema,
  preguntaSchema,
  respuestaSchema,
} from '../schemas/encuesta.schema.js';

const SIGUIENTE_ESTADO = { borrador: 'publicada', publicada: 'cerrada' };

const exigirEncuesta = (id) => {
  const estado = Encuesta.obtenerEstado(id);
  if (!estado) {
    throw crearError(404, `La encuesta con id ${id} no fue encontrada.`);
  }
  return estado;
};

const exigirEstado = (id, estadoEsperado, mensaje) => {
  if (exigirEncuesta(id) !== estadoEsperado) {
    throw crearError(409, mensaje);
  }
};

const preguntaNoEncontrada = (id, preguntaId) =>
  crearError(
    404,
    `La pregunta con id ${preguntaId} no fue encontrada en la encuesta ${id}.`
  );

export const obtenerTodas = (req, res) => {
  res.json(Encuesta.obtenerTodas());
};

export const obtenerPorId = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  exigirEncuesta(id);
  res.json(Encuesta.obtenerPorId(id));
};

export const crear = (req, res) => {
  const datos = validar(encuestaSchema, req.body);
  res.status(201).json(Encuesta.crear(datos));
};

export const actualizar = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  const datos = validar(encuestaSchema, req.body);
  exigirEncuesta(id);
  res.json(Encuesta.actualizar(id, datos));
};

export const eliminar = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  exigirEncuesta(id);
  if (Encuesta.tieneRespuestas(id)) {
    throw crearError(
      409,
      'No se puede eliminar una encuesta que ya tiene respuestas.'
    );
  }
  Encuesta.eliminar(id);
  res.status(204).end();
};

export const cambiarEstado = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  const { estado } = validar(estadoSchema, req.body);
  const actual = exigirEncuesta(id);
  if (SIGUIENTE_ESTADO[actual] !== estado) {
    throw crearError(409, `No se puede pasar de ${actual} a ${estado}.`);
  }
  if (estado === 'publicada' && Encuesta.contarPreguntas(id) === 0) {
    throw crearError(409, 'No se puede publicar una encuesta sin preguntas.');
  }
  res.json(Encuesta.cambiarEstado(id, estado));
};

export const agregarPregunta = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  const datos = validar(preguntaSchema, req.body);
  exigirEstado(
    id,
    'borrador',
    'No se pueden modificar preguntas de una encuesta que ya esta publicada.'
  );
  res.status(201).json(Encuesta.agregarPregunta(id, datos));
};

export const actualizarPregunta = (req, res) => {
  const { id, preguntaId } = validar(paramsPregunta, req.params);
  const datos = validar(preguntaSchema, req.body);
  exigirEstado(
    id,
    'borrador',
    'Solo se pueden editar preguntas de encuestas en borrador.'
  );
  const pregunta = Encuesta.actualizarPregunta(id, preguntaId, datos);
  if (!pregunta) throw preguntaNoEncontrada(id, preguntaId);
  res.json(pregunta);
};

export const eliminarPregunta = (req, res) => {
  const { id, preguntaId } = validar(paramsPregunta, req.params);
  exigirEstado(
    id,
    'borrador',
    'Solo se pueden eliminar preguntas de encuestas en borrador.'
  );
  if (!Encuesta.eliminarPregunta(id, preguntaId)) {
    throw preguntaNoEncontrada(id, preguntaId);
  }
  res.status(204).end();
};

export const registrarRespuesta = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  const { participanteId, respuestas } = validar(respuestaSchema, req.body);

  exigirEstado(
    id,
    'publicada',
    'Solo se pueden responder encuestas publicadas.'
  );

  if (Encuesta.existeParticipante(id, participanteId)) {
    throw crearError(409, 'Este participante ya respondio la encuesta.');
  }

  // Una sola consulta con todas las opciones de la encuesta
  const mapaOpciones = Encuesta.obtenerMapaOpciones(id);

  const detalles = respuestas.map(({ preguntaId, valor }) => {
    const opcionId = Encuesta.buscarOpcionId(mapaOpciones, preguntaId, valor);
    if (!opcionId) {
      throw crearError(
        400,
        `La opcion "${valor}" no es valida para la pregunta ${preguntaId}.`
      );
    }
    return { preguntaId, opcionId };
  });

  Encuesta.registrarRespuesta(id, participanteId, detalles);
  res.status(201).end();
};

export const obtenerResultados = (req, res) => {
  const { id } = validar(paramsEncuesta, req.params);
  exigirEncuesta(id);
  res.json(Encuesta.obtenerResultados(id));
};
