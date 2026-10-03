const EncuestaModel = require('../models/encuesta.model');

exports.getEncuestas = (req, res) => {
  const lista = EncuestaModel.obtenerTodas();
  res.json(lista);
};

exports.getEncuestaById = (req, res) => {
  const encuesta = EncuestaModel.obtenerPorId(req.params.id);
  if (!encuesta) {
    return res.status(404).json({ error: 'Encuesta no encontrada' });
  }
  res.json(encuesta);
};

exports.createEncuesta = (req, res) => {
  const { titulo, opciones } = req.body;
  
  if (!titulo || !opciones || !Array.isArray(opciones)) {
    return res.status(400).json({ error: 'Título u opciones inválidos' });
  }

  const nueva = EncuestaModel.crear({ titulo, opciones });
  res.status(201).json(nueva);
};

exports.votarEncuesta = (req, res) => {
  const { id } = req.params;
  const { opcionIndice } = req.body;

  if (opcionIndice === undefined || typeof opcionIndice !== 'number') {
    return res.status(400).json({ error: 'Debe proporcionar un opcionIndice válido' });
  }

  const actualizada = EncuestaModel.registrarVoto(id, opcionIndice);
  if (!actualizada) {
    return res.status(400).json({ error: 'Encuesta no encontrada o índice de opción fuera de rango' });
  }

  res.json({ mensaje: 'Voto registrado exitosamente', encuesta: actualizada });
};
