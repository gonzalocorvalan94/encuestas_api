const express = require('express');
const router = express.Router();
const encuestaController = require('../controllers/encuesta.controller');

// Usamos las funciones a través del objeto importado
router.get('/', encuestaController.obtenerTodas);
router.get('/:id', encuestaController.obtenerPorId);
router.post('/', encuestaController.crear);

module.exports = router;
