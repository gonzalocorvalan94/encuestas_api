CREATE TABLE IF NOT EXISTS encuesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    estado TEXT NOT NULL DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicada', 'cerrada'))
);

CREATE TABLE IF NOT EXISTS pregunta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encuesta_id INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    FOREIGN KEY (encuesta_id) REFERENCES encuesta(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pregunta_encuesta ON pregunta(encuesta_id);

CREATE TABLE IF NOT EXISTS opcion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta_id INTEGER NOT NULL,
    valor TEXT NOT NULL,
    UNIQUE (pregunta_id, valor),
    FOREIGN KEY (pregunta_id) REFERENCES pregunta(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS respuesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encuesta_id INTEGER NOT NULL,
    participante_id TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (encuesta_id, participante_id),
    FOREIGN KEY (encuesta_id) REFERENCES encuesta(id) ON DELETE CASCADE
);

-- Una sola opción por pregunta en cada respuesta (PK de 2 columnas)
CREATE TABLE IF NOT EXISTS detalle_respuesta (
    respuesta_id INTEGER NOT NULL,
    pregunta_id INTEGER NOT NULL,
    opcion_id INTEGER NOT NULL,
    PRIMARY KEY (respuesta_id, pregunta_id),
    FOREIGN KEY (respuesta_id) REFERENCES respuesta(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES pregunta(id) ON DELETE CASCADE,
    FOREIGN KEY (opcion_id) REFERENCES opcion(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_detalle_opcion ON detalle_respuesta(opcion_id);