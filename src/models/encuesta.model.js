import db from '../config/db.js';

class EncuestaModel {
  static obtenerTodas() {
    const stmt = db.prepare('SELECT * FROM encuesta');
    return stmt.all();
  }

  static obtenerPorId(id) {
    const stmt = db.prepare('SELECT * FROM encuesta WHERE id = ?');
    return stmt.get(id);
  }

  static crear(datos) {
    const { titulo, descripcion, estado = 'activa' } = datos;
    const fechaCreacion = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO encuesta (titulo, descripcion, fecha_creacion, estado) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(titulo, descripcion, fechaCreacion, estado);

    return {
      id: result.lastInsertRowid,
      titulo,
      descripcion,
      fecha_creacion: fechaCreacion,
      estado,
    };
  }
}

export default EncuestaModel;
