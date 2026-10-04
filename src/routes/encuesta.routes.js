import express from 'express';
import * as encuestaController from '../controllers/encuesta.controller.js';

const router = express.Router();

router.get('/', encuestaController.obtenerTodas);
router.get('/:id', encuestaController.obtenerPorId);
router.post('/', encuestaController.crear);

export default router;
