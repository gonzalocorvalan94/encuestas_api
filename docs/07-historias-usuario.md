# Historis de Usuario y Criterios de Aceptación

## HU-01: Crear una encuesta
**Como** administrador, **quiero** crear una nueva encuesta con un título, una descripción y preguntas con opciones de respuesta, **para** poder publicarla y obtener respuestas de los participantes.

### Criterios de aceptación:
* El administrador debe poder ingresar un título para la encuesta.
* El administrador puede ingresar una descripción opcional.
* La encuesta debe tener al menos una pregunta.
* Cada pregunta debe tener al menos dos opciones de respuesta.
* No se deben permitir opciones de respuesta duplicadas dentro de una misma pregunta.
* La encuesta debe poder guardarse en estado borrador.

---

## HU-02: Publicar una encuesta
**Como** administrador, **quiero** publicar una encuesta creada, **para** permitir que los participantes puedan responderla.

### Criterios de aceptación:
* El administrador debe poder publicar una encuesta que tenga al menos una pregunta.
* Todas las preguntas deben tener al menos dos opciones de respuesta.
* La encuesta debe cambiar su estado a "activa".
* El sistema debe generar un enlace para acceder a la encuesta.

---

## HU-03: Responder una encuesta
**Como** participante, **quiero** acceder a una encuesta activa y seleccionar una opción para cada pregunta, **para** registrar mis respuestas.

### Criterios de aceptación:
* El participante debe poder acceder a una encuesta que se encuentre activa.
* El sistema debe mostrar todas las preguntas y sus opciones de respuesta.
* El participante debe poder seleccionar una sola opción por pregunta.
* No se debe permitir el ingreso de texto libre.
* Todas las preguntas deben ser respondidas antes de enviar la encuesta.
* Un participante no puede responder más de una vez la misma encuesta.

---

## HU-04: Registrar las respuestas
**Como** sistema, **quiero** almacenar las respuestas seleccionadas por el participante, **para** conservar la información y permitir su posterior análisis.

### Criterios de aceptación:
* El sistema debe registrar cada respuesta asociándola a la encuesta correspondiente.
* Cada respuesta debe quedar asociada a la pregunta correspondiente.
* Cada respuesta debe identificar la opción seleccionada.
* El sistema debe confirmar al participante que la encuesta fue completada correctamente.

---

## HU-05: Cerrar una encuesta
**Como** administrador, **quiero** cerrar una encuesta activa, **para** impedir que se sigan registrando nuevas respuestas.

### Criterios de aceptación:
* El administrador debe poder cerrar una encuesta activa.
* La encuesta debe cambiar su estado a "cerrada".
* Una encuesta cerrada no debe permitir el registro de nuevas respuestas.

---

## HU-06: Consultar resultados
**Como** administrador, **quiero** consultar los resultados de una encuesta cerrada, **para** analizar las respuestas obtenidas y conocer tendencias y preferencias.

### Criterios de aceptación:
* El administrador debe poder seleccionar una encuesta cerrada.
* El sistema debe mostrar la cantidad total de respuestas.
* El sistema debe mostrar la cantidad de veces que fue seleccionada cada opción.
* El sistema debe calcular el porcentaje correspondiente a cada opción.
* Los resultados deben poder visualizarse en formato tabular y/o gráfico.a
