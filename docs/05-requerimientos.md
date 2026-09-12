# Requerimientos del Sistema

## Requerimientos Funcionales

* **Gestión e encuestas:** El sistema debe permitir a los administradores crear, editar, publicar y cerrar encuestas. Cada encuesta debe tener un título, una descripción opcional y un estado (activa, cerrada, en borrador).
* **Gestión de preguntas:** Cada encuesta puede contener una o más preguntas.
* **Gestión de opciones:** Cada pregunta debe tener al menos dos opciones de respuesta predefinidas y un orden.
* **Participación en encuestas:** Los participantes deben poder acceder a las encuestas activas, leer las preguntas y seleccionar una opción. No se permite texto libre.
* **Registro de respuestas:** Cada respuesta debe quedar registrada en el sistema, asociada a la encuesta, a la pregunta y a la opción seleccionada.
* **Generación de reportes:** El sistema debe permitir visualizar los resultados de una encuesta cerrada, mostrando la distribución de respuestas para cada pregunta, ya sea en forma numérica (conteo, porcentajes) o gráfica.

## Requerimientos No Funcionales

* **Escalabilidad:** El sistema debe poder manejar un crecimiento en el número de encuestas y respuestas, sin degradación significativa del rendimiento.
* **Seguridad:** Los datos recolectados deben estar protegidos contra accesos no autorizados. Si se recolectan datos personales (nombre, email, etc.), deben cumplirse las regulaciones de privacidad aplicables.
* **Disponibilidad:** El sistema debe estar accesible para los participantes en todo momento.
* **Usabilidad:** La interfaz para los participantes debe ser clara, simple y rápida. La interfaz para los administradores debe permitir una creación ágil de encuestas.d
