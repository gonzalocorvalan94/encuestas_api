# language: es

Característica: HU-06 Consultar resultados
  Como administrador
  Quiero consultar los resultados de una encuesta cerrada
  Para analizar las respuestas obtenidas y conocer tendencias y preferencias

  Escenario: Consultar los resultados de una encuesta cerrada
    Dado que existe una encuesta en estado "cerrada"
    Y la encuesta tiene respuestas registradas
    Cuando el administrador solicita consultar los resultados
    Entonces el sistema debe mostrar la cantidad total de respuestas
    Y debe mostrar la cantidad de veces que fue seleccionada cada opción
    Y debe mostrar el porcentaje correspondiente a cada opción
    Y debe presentar los resultados en formato tabular y/o gráfico
