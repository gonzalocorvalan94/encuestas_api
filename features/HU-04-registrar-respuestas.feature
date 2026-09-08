# language: es

Característica: HU-04 Registrar las respuestas
  Como sistema
  Quiero almacenar las respuestas seleccionadas por el participante
  Para conservar la información y permitir su posterior análisis

  Escenario: Registrar las respuestas de una encuesta
    Dado que el participante completó todas las preguntas de una encuesta activa
    Cuando confirma el envío
    Entonces el sistema debe almacenar las respuestas
    Y cada respuesta debe quedar asociada a la encuesta, pregunta y opción seleccionada
