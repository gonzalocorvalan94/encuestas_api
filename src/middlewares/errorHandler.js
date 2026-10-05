export const crearError = (status, mensaje) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

export const noEncontrada = (req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
};

export const manejarErrores = (err, req, res, next) => {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ mensaje: err.message });
  }
  if (err.code?.startsWith('SQLITE_CONSTRAINT')) {
    return res
      .status(409)
      .json({ mensaje: 'Conflicto con restricciones de la base de datos' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};
