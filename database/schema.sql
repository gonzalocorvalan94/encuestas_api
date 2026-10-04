PRAGMA foreign_keys = ON;

CREATE TABLE encuesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TEXT NOT NULL,
    estado TEXT NOT NULL
);

CREATE TABLE pregunta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encuesta_id INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    tipo TEXT NOT NULL,
    FOREIGN KEY (encuesta_id) REFERENCES encuesta(id)
);

CREATE TABLE opcion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta_id INTEGER NOT NULL,
    valor TEXT NOT NULL,
    FOREIGN KEY (pregunta_id) REFERENCES pregunta(id)
);

CREATE TABLE respuesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encuesta_id INTEGER NOT NULL,
    participante_id TEXT,
    fecha TEXT NOT NULL,
    FOREIGN KEY (encuesta_id) REFERENCES encuesta(id)
);

CREATE TABLE detalle_respuesta (
    respuesta_id INTEGER NOT NULL,
    pregunta_id INTEGER NOT NULL,
    opcion_id INTEGER NOT NULL,
    FOREIGN KEY (respuesta_id) REFERENCES respuesta(id),
    FOREIGN KEY (pregunta_id) REFERENCES pregunta(id),
    FOREIGN KEY (opcion_id) REFERENCES opcion(id)
);
