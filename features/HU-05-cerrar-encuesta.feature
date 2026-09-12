# language: es

Característica: HU-05 Cerrar una encuesta
  Como administrador
  Quiero cerrar una encuesta activa
  Para impedir que se sigan registrando nuevas respuestas

  Escenario: Cerrar una encuesta activa
    Dado que existe una encuesta en estado "activa"
    Cuando el administrador selecciona la opción "Cerrar"
    Entonces el sistema debe cambiar el estado de la encuesta a "cerrada"
    Y no debe permitir registrar nuevas respuestas
