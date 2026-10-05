import express from 'express';
import * as encuestaController from '../controllers/encuesta.controller.js';

const router = express.Router();

router.get('/', encuestaController.obtenerTodas);
router.post('/', encuestaController.crear);
router.get('/:id', encuestaController.obtenerPorId);
router.put('/:id', encuestaController.actualizar);
router.delete('/:id', encuestaController.eliminar);
router.patch('/:id/estado', encuestaController.cambiarEstado);
router.post('/:id/preguntas', encuestaController.agregarPregunta);
router.put('/:id/preguntas/:preguntaId', encuestaController.actualizarPregunta);
router.delete('/:id/preguntas/:preguntaId', encuestaController.eliminarPregunta);
router.post('/:id/respuestas', encuestaController.registrarRespuesta);
router.get('/:id/resultados', encuestaController.obtenerResultados);

export default router;