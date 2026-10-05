import { z } from 'zod';
import { crearError } from '../middlewares/errorHandler.js';

export const validar = (schema, datos) => {
  const resultado = schema.safeParse(datos ?? {});
  if (!resultado.success) {
    throw crearError(400, resultado.error.issues[0].message);
  }
  return resultado.data;
};

const texto = (mensaje) => z.string({ error: mensaje }).trim().min(1, mensaje);

const entero = (nombre) => {
  const mensaje = `El ${nombre} debe ser un entero positivo.`;
  return z.coerce.number({ error: mensaje }).int(mensaje).positive(mensaje);
};

const objeto = (campos, mensaje = 'El cuerpo de la solicitud no es valido.') =>
  z.object(campos, { error: mensaje });

export const paramsEncuesta = objeto({ id: entero('id') });

export const paramsPregunta = objeto({
  id: entero('id'),
  preguntaId: entero('preguntaId'),
});

export const encuestaSchema = objeto({
  titulo: texto('El campo titulo es obligatorio.'),
  descripcion: z
    .string({ error: 'El campo descripcion debe ser texto.' })
    .trim()
    .nullable()
    .default(null),
});

export const estadoSchema = objeto({
  estado: z.enum(['publicada', 'cerrada'], {
    error: 'El campo estado debe ser uno de: publicada, cerrada.',
  }),
});

const MENSAJE_OPCIONES =
  'El campo opciones debe ser una lista de al menos 2 textos no vacios.';

export const preguntaSchema = objeto({
  enunciado: texto('El campo enunciado es obligatorio.'),
  opciones: z
    .array(texto(MENSAJE_OPCIONES), { error: MENSAJE_OPCIONES })
    .min(2, MENSAJE_OPCIONES)
    .refine(
      (lista) => new Set(lista).size === lista.length,
      'Las opciones no pueden repetirse.'
    ),
});

const MENSAJE_ITEM =
  'Cada respuesta requiere preguntaId (entero) y valor (texto).';
const MENSAJE_LISTA = 'El campo respuestas debe ser una lista no vacia.';

const itemRespuesta = objeto(
  {
    preguntaId: z.number({ error: MENSAJE_ITEM }).int(MENSAJE_ITEM),
    valor: texto(MENSAJE_ITEM),
  },
  MENSAJE_ITEM
);

export const respuestaSchema = objeto({
  participanteId: texto('El campo participanteId es obligatorio.'),
  respuestas: z
    .array(itemRespuesta, { error: MENSAJE_LISTA })
    .min(1, MENSAJE_LISTA)
    .refine(
      (lista) => new Set(lista.map((r) => r.preguntaId)).size === lista.length,
      'Cada pregunta admite una sola opcion: no repitas preguntaId.'
    ),
});
