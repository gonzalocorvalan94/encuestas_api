const express = require('express');
const router = express.Router();
const encuestaController = require('../controllers/encuesta.controller');

router.get('/', encuestaController.getEncuestas);
router.get('/:id', encuestaController.getEncuestaById);
router.post('/', encuestaController.createEncuesta);
router.post('/:id/votar', encuestaController.votarEncuesta);

module.exports = router;
