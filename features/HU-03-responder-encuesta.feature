# language: es

Característica: HU-03 Responder una encuesta
  Como participante
  Quiero acceder a una encuesta activa y seleccionar una opción para cada pregunta
  Para registrar mis respuestas

  Escenario: Responder una encuesta correctamente
    Dado que existe una encuesta en estado "activa"
    Y el participante accede al enlace de la encuesta
    Cuando selecciona una opción para cada pregunta
    Y confirma el envío de las respuestas
    Entonces el sistema debe registrar las respuestas
    Y debe mostrar un mensaje de confirmación

  Escenario: Intentar responder una encuesta cerrada
    Dado que existe una encuesta en estado "cerrada"
    Cuando el participante intenta responderla
    Entonces el sistema no debe permitir registrar respuestas

  Escenario: Enviar una encuesta sin responder todas las preguntas
    Dado que el participante se encuentra respondiendo una encuesta activa
    Cuando intenta enviar la encuesta sin responder todas las preguntas
    Entonces el sistema debe informar que todas las preguntas deben ser respondidas

  Escenario: Responder una encuesta más de una vez
    Dado que el participante ya respondió una encuesta
    Cuando intenta responder nuevamente la misma encuesta
    Entonces el sistema no debe permitir una segunda respuesta
