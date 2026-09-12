# Diccionario de Datos

## Tabla `ENCUESTA`

| Campo | Tipo de Dato | Desripción | Clave |
| :--- | :--- | :--- | :--- |
| `id` | Autoincremental | Identificador único de la encuesta | PK |
| `titulo` | Texto (hasta 200 caracteres) | Título breve de la encuesta | |
| `fecha_creacion` | Timestamp | Fecha y hora de creación | |
| `estado` | Estado | Estado de la encuesta (activa o inactiva) | |

## Tabla `PREGUNTA`

| Campo | Tipo de Dato | Descripción | Clave |
| :--- | :--- | :--- | :--- |
| `id` | Autoincremental | Identificador único de la pregunta | PK |
| `encuesta_id` | Identificador | Identificador de la encuesta a la que pertenece | FK |

## Tabla `OPCION`

| Campo | Tipo de Dato | Descripción | Clave |
| :--- | :--- | :--- | :--- |
| `id` | Autoincremental | Identificador único de la opción | PK |
| `pregunta_id` | Identificador | Identificador de la pregunta a la que pertenece | FK |

## Tabla `RESPUESTA`

| Campo | Tipo de Dato | Descripción | Clave |
| :--- | :--- | :--- | :--- |
| `id` | Autoincremental | Identificador único de la respuesta | PK |
| `encuesta_id` | Identificador | Identificador de la encuesta respondida | FK |
| `participante_id` | Identificador | Identificador del participante (opcional) | FK |
| `fecha` | Timestamp | Fecha y hora en que se registró la respuesta | |

## Tabla `DETALLE_RESPUESTA`

| Campo | Tipo de Dato | Descripción | Clave |
| :--- | :--- | :--- | :--- |
| `respuesta_id` | Identificador | Identificador de la respuesta | FK |
| `pregunta_id` | Identificador | Identificador de la pregunta respondida | FK |
| `opcion_id` | Identificador | Identificador de la opción seleccionada | FK |c
