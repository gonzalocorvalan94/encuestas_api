# API RES — Sistema de Encuestas

Documentación de los endpoints para la gestión de encuestas, preguntas, respuestas y resultados.

**Base URL:** `/api`

**Formato:** JSON (`Content-Type: application/json`)

---

## Encuestas

### `GET /api/encuestas`
Obtiene las encuestas disponibles.

**Query params (opcionales):**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `estado` | string | Filtra por estado (`borrador`, `publicada`, `cerrada`) |
| `page` | int | Paginación |
| `limit` | int | Tamaño de página |

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "titulo": "Satisfacción del cliente",
    "estado": "publicada",
    "fechaCreacion": "2026-08-01T10:00:00Z"
  }
]
```

---

### `POST /api/encuestas`
Crea una nueva encuesta.

**Body:**
```json
{
  "titulo": "Satisfacción del cliente",
  "descripcion": "Encuesta trimestral de satisfacción"
}
```

**Respuestas:**
| Código | Descripción |
|---|---|
| 201 | Encuesta creada. Devuelve el recurso con su `id`. |
| 400 | Body inválido (falta `titulo`, tipos incorrectos, etc.) |

---

### `GET /api/encuestas/{id}`
Obtiene los datos de una encuesta específica (incluye sus preguntas).

**Path params:** `id` (int) — ID de la encuesta.

**Respuestas:**
| Código | Descripción |
|---|---|
| 200 | Datos de la encuesta |
| 404 | No existe una encuesta con ese `id` |

---

### `PUT /api/encuestas/{id}`
Modifica una encuesta existente.

**Path params:** `id` (int)

**Body:** mismos campos que `POST`, con los valores a actualizar.

**Respuestas:**
| Código | Descripción |
|---|---|
| 200 | Encuesta actualizada |
| 400 | Body inválido |
| 404 | No existe la encuesta |
| 409 | No se permite editar (p. ej. encuesta ya `publicada`/`cerrada`, según reglas de negocio) |

---

### `DELETE /api/encuestas/{id}`
Elimina una encuesta.

**Path params:** `id` (int)

**Respuestas:**
| Código | Descripción |
|---|---|
| 204 | Eliminada sin contenido de respuesta |
| 404 | No existe la encuesta |
| 409 | No se puede eliminar (p. ej. tiene respuestas registradas) |

---

### `PUT /api/encuestas/{id}/publicar`
Cambia el estado de la encuesta a `publicada`, habilitándola para recibir respuestas.

**Path params:** `id` (int)

**Respuestas:**
| Código | Descripción |
|---|---|
| 200 | Encuesta publicada |
| 404 | No existe la encuesta |
| 409 | Transición de estado inválida (p. ej. ya está cerrada, o no tiene preguntas) |

---

### `PUT /api/encuestas/{id}/cerrar`
Cambia el estado de la encuesta a `cerrada`, deshabilitando el ingreso de nuevas respuestas.

**Path params:** `id` (int)

**Respuestas:**
| Código | Descripción |
|---|---|
| 200 | Encuesta cerrada |
| 404 | No existe la encuesta |
| 409 | Transición de estado inválida (p. ej. aún está en borrador) |

---

## Preguntas

### `POST /api/encuestas/{id}/preguntas`
Agrega una pregunta a una encuesta.

**Path params:** `id` (int) — ID de la encuesta.

**Body:**
```json
{
  "enunciado": "¿Cómo calificarías el servicio?",
  "tipo": "opcion_multiple",
  "opciones": ["Malo", "Regular", "Bueno", "Excelente"]
}
```

**Respuestas:**
| Código | Descripción |
|---|---|
| 201 | Pregunta creada |
| 400 | Body inválido (falta `enunciado`, `tipo` no soportado, opciones vacías en preguntas de opción múltiple, etc.) |
| 404 | No existe la encuesta |
| 409 | No se pueden agregar preguntas (p. ej. encuesta ya publicada) |

---

## Respuestas

### `POST /api/encuestas/{id}/respuestas`
Registra las respuestas de un participante para una encuesta.

**Path params:** `id` (int) — ID de la encuesta.

**Body:**
```json
{
  "participanteId": "anon-8f3a",
  "respuestas": [
    { "preguntaId": 1, "valor": "Bueno" },
    { "preguntaId": 2, "valor": "Muy conforme" }
  ]
}
```

**Respuestas:**
| Código | Descripción |
|---|---|
| 201 | Respuestas registradas |
| 400 | Body inválido (falta responder alguna pregunta obligatoria, `preguntaId` inexistente, valor fuera de las opciones válidas) |
| 404 | No existe la encuesta |
| 409 | La encuesta no está `publicada` (no acepta respuestas) |

---

## Resultados

### `GET /api/encuestas/{id}/resultados`
Consulta los resultados agregados de una encuesta.

**Path params:** `id` (int) — ID de la encuesta.

**Respuesta 200:**
```json
{
  "encuestaId": 1,
  "totalParticipantes": 120,
  "preguntas": [
    {
      "preguntaId": 1,
      "enunciado": "¿Cómo calificarías el servicio?",
      "resultados": [
        { "opcion": "Bueno", "cantidad": 65, "porcentaje": 54.2 },
        { "opcion": "Excelente", "cantidad": 40, "porcentaje": 33.3 }
      ]
    }
  ]
}
```

**Respuestas:**
| Código | Descripción |
|---|---|
| 200 | Resultados de la encuesta |
| 404 | No existe la encuesta |

---

## Resumen de endpoints

| Endpoint | Verbo | Descripción |
|---|---|---|
| `/api/encuestas` | GET | Obtener encuestas disponibles |
| `/api/encuestas` | POST | Crear nueva encuesta |
| `/api/encuestas/{id}` | GET | Obtener datos de una encuesta |
| `/api/encuestas/{id}` | PUT | Modificar una encuesta |
| `/api/encuestas/{id}` | DELETE | Eliminar una encuesta |
| `/api/encuestas/{id}/publicar` | PUT | Publicar una encuesta |
| `/api/encuestas/{id}/cerrar` | PUT | Cerrar una encuesta |
| `/api/encuestas/{id}/preguntas` | POST | Agregar pregunta a una encuesta |
| `/api/encuestas/{id}/respuestas` | POST | Registrar respuestas de un participante |
| `/api/encuestas/{id}/resultados` | GET | Consultar resultados de una encuesta |


T
