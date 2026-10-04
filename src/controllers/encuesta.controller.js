import EncuestaModel from '../models/encuesta.model.js';

export const obtenerTodas = (req, res) => {
  try {
    const encuestas = EncuestaModel.obtenerTodas();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPorId = (req, res) => {
  try {
    const encuesta = EncuestaModel.obtenerPorId(req.params.id);
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crear = (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const nuevaEncuesta = EncuestaModel.crear(req.body);
    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
