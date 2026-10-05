import * as Encuesta from '../models/encuesta.model.js';
import { crearError } from '../middlewares/errorHandler.js';

const TRANSICIONES = { borrador: 'publicada', publicada: 'cerrada' };
const ESTADOS_DESTINO = Object.values(TRANSICIONES);

const esTexto = (v) => typeof v === 'string' && v.trim() !== '';

const parseId = (valor, nombre = 'id') => {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    throw crearError(400, `El ${nombre} debe ser un entero positivo.`);
  }
  return id;
};

const exigirEncuesta = (id) => {
  const estado = Encuesta.obtenerEstado(id);
  if (!estado)
    throw crearError(404, `La encuesta con id ${id} no fue encontrada.`);
  return estado;
};

const validarEncuesta = ({ titulo, descripcion } = {}) => {
  if (!esTexto(titulo))
    throw crearError(400, 'El campo titulo es obligatorio.');
  if (descripcion != null && typeof descripcion !== 'string') {
    throw crearError(400, 'El campo descripcion debe ser texto.');
  }
  return { titulo: titulo.trim(), descripcion: descripcion?.trim() ?? null };
};

export const obtenerTodas = (req, res) => {
  res.json(Encuesta.obtenerTodas());
};

export const obtenerPorId = (req, res) => {
  const id = parseId(req.params.id);
  exigirEncuesta(id);
  res.json(Encuesta.obtenerPorId(id));
};

export const crear = (req, res) => {
  res.status(201).json(Encuesta.crear(validarEncuesta(req.body)));
};

export const actualizar = (req, res) => {
  const id = parseId(req.params.id);
  const datos = validarEncuesta(req.body);
  if (exigirEncuesta(id) !== 'borrador') {
    throw crearError(409, 'Solo se pueden modificar encuestas en borrador.');
  }
  res.json(Encuesta.actualizar(id, datos));
};

export const eliminar = (req, res) => {
  const id = parseId(req.params.id);
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
  const id = parseId(req.params.id);
  const { estado } = req.body ?? {};
  if (!ESTADOS_DESTINO.includes(estado)) {
    throw crearError(
      400,
      `El campo estado debe ser uno de: ${ESTADOS_DESTINO.join(', ')}.`
    );
  }
  const actual = exigirEncuesta(id);
  if (TRANSICIONES[actual] !== estado) {
    throw crearError(409, `No se puede pasar de ${actual} a ${estado}.`);
  }
  if (estado === 'publicada' && Encuesta.contarPreguntas(id) === 0) {
    throw crearError(409, 'No se puede publicar una encuesta sin preguntas.');
  }
  res.json(Encuesta.cambiarEstado(id, estado));
};

export const agregarPregunta = (req, res) => {
  const id = parseId(req.params.id);
  const { enunciado, opciones } = req.body ?? {};

  if (!esTexto(enunciado))
    throw crearError(400, 'El campo enunciado es obligatorio.');
  if (
    !Array.isArray(opciones) ||
    opciones.length < 2 ||
    !opciones.every(esTexto)
  ) {
    throw crearError(
      400,
      'El campo opciones debe ser una lista de al menos 2 textos no vacios.'
    );
  }
  const limpias = opciones.map((o) => o.trim());
  if (new Set(limpias).size !== limpias.length) {
    throw crearError(400, 'Las opciones no pueden repetirse.');
  }

  if (exigirEncuesta(id) !== 'borrador') {
    throw crearError(
      409,
      'No se pueden modificar preguntas de una encuesta que ya esta publicada.'
    );
  }
  const pregunta = Encuesta.agregarPregunta(id, {
    enunciado: enunciado.trim(),
    opciones: limpias,
  });
  res.status(201).json(pregunta);
};

export const eliminarPregunta = (req, res) => {
  const id = parseId(req.params.id);
  const preguntaId = parseId(req.params.preguntaId, 'preguntaId');
  if (exigirEncuesta(id) !== 'borrador') {
    throw crearError(
      409,
      'Solo se pueden eliminar preguntas de encuestas en borrador.'
    );
  }
  if (!Encuesta.eliminarPregunta(id, preguntaId)) {
    throw crearError(
      404,
      `La pregunta con id ${preguntaId} no fue encontrada en la encuesta ${id}.`
    );
  }
  res.status(204).end();
};

export const registrarRespuesta = (req, res) => {
  const id = parseId(req.params.id);
  const { participanteId, respuestas } = req.body ?? {};

  if (!esTexto(participanteId))
    throw crearError(400, 'El campo participanteId es obligatorio.');
  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    throw crearError(400, 'El campo respuestas debe ser una lista no vacia.');
  }
  if (exigirEncuesta(id) !== 'publicada') {
    throw crearError(409, 'Solo se pueden responder encuestas publicadas.');
  }
  const participante = participanteId.trim();
  if (Encuesta.existeParticipante(id, participante)) {
    throw crearError(409, 'Este participante ya respondio la encuesta.');
  }

  const respondidas = new Set();
  const detalles = respuestas.map((item) => {
    const { preguntaId, valor } = item ?? {};
    if (!Number.isInteger(preguntaId) || !esTexto(valor)) {
      throw crearError(
        400,
        'Cada respuesta requiere preguntaId (entero) y valor (texto).'
      );
    }
    if (respondidas.has(preguntaId)) {
      throw crearError(
        400,
        `La pregunta ${preguntaId} admite una sola opcion.`
      );
    }
    respondidas.add(preguntaId);
    const opcion = Encuesta.buscarOpcion(id, preguntaId, valor.trim());
    if (!opcion) {
      throw crearError(
        400,
        `La opcion "${valor}" no es valida para la pregunta ${preguntaId}.`
      );
    }
    return { preguntaId, opcionId: opcion.id };
  });

  Encuesta.registrarRespuesta(id, participante, detalles);
  res.status(201).end();
};

export const obtenerResultados = (req, res) => {
  const id = parseId(req.params.id);
  exigirEncuesta(id);
  res.json(Encuesta.obtenerResultados(id));
};
