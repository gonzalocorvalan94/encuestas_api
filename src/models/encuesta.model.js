// Simulación de base de datos en memoria
const encuestas = [
  {
    id: 1,
    titulo: '¿Cuál es tu lenguaje favorito?',
    opciones: ['JavaScript', 'Python', 'Java'],
    votos: [0, 0, 0]
  }
];

class EncuestaModel {
  static obtenerTodas() {
    return encuestas;
  }

  static obtenerPorId(id) {
    return encuestas.find(e => e.id === parseInt(id));
  }

  static crear(datos) {
    const nueva = {
      id: encuestas.length + 1,
      titulo: datos.titulo,
      opciones: datos.opciones,
      votos: new Array(datos.opciones.length).fill(0)
    };
    encuestas.push(nueva);
    return nueva;
  }

  static registrarVoto(idEncuesta, opcionIndice) {
    const encuesta = this.obtenerPorId(idEncuesta);
    if (encuesta && encuesta.votos[opcionIndice] !== undefined) {
      encuesta.votos[opcionIndice] += 1;
      return encuesta;
    }
    return null;
  }
}

module.exports = EncuestaModel;
