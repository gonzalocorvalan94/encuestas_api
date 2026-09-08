# language: es

Característica: HU-01 Crear una encuesta
  Como administrador
  Quiero crear una nueva encuesta con un título, una descripción y preguntas con opciones de respuesta
  Para poder publicarla y obtener respuestas de los participantes

  Escenario: Crear una encuesta correctamente
    Dado que el administrador se encuentra en la opción "Crear nueva encuesta"
    Cuando ingresa el título y agrega al menos una pregunta con dos opciones de respuesta
    Y guarda la encuesta
    Entonces el sistema debe crear la encuesta
    Y debe quedar en estado "borrador"

  Escenario: Crear una encuesta sin preguntas
    Dado que el administrador se encuentra creando una encuesta
    Cuando intenta guardar la encuesta sin agregar preguntas
    Entonces el sistema debe informar que la encuesta debe tener al menos una pregunta

  Escenario: Crear una pregunta con menos de dos opciones
    Dado que el administrador está creando una pregunta
    Cuando intenta guardarla con menos de dos opciones de respuesta
    Entonces el sistema debe informar que cada pregunta debe tener al menos dos opciones
