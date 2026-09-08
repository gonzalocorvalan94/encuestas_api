# language: es

Característica: HU-02 Publicar una encuesta
  Como administrador
  Quiero publicar una encuesta creada
  Para permitir que los participantes puedan responderla

  Escenario: Publicar una encuesta correctamente
    Dado que existe una encuesta en estado "borrador"
    Y la encuesta tiene al menos una pregunta
    Y cada pregunta tiene al menos dos opciones
    Cuando el administrador selecciona la opción "Publicar"
    Entonces el sistema debe cambiar el estado de la encuesta a "activa"
    Y debe generar un enlace para acceder a la encuesta
