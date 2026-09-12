# Arquitectura del Sistema

## Modelo Cliente/Servidor (Tres Niveles)

* **Nivel de Presetación (Cliente):** Aplicación web accesible desde navegador (o aplicación móvil). Se encarga de mostrar las interfaces de usuario y capturar las interacciones del usuario.
* **Nivel de Aplicación (Servidor):** Contiene toda la lógica de negocio (creación de encuestas, validación de respuestas, generación de reportes, etc.). Se implementa como una API REST.
* **Nivel de Datos (Servidor de Base de Datos):** Almacena todas las encuestas, preguntas, opciones, respuestas y participantes. Se utiliza una base de datos relacional.

## Opciones de Procesamiento

* **Procesamiento en Línea (Online):** Las encuestas se responden en tiempo real y las respuestas se registran inmediatamente en la base de datos. Esto permite que los administradores vean los resultados a medida que llegan las respuestas (si la encuesta está activa).
* **Procesamiento en Lote (Batch):** Los reportes y análisis estadísticos se generan bajo demanda, cuando el administrador los solicita, o de forma programada (por ejemplo, al cierre de la encuesta). Esto optimiza el rendimiento del sistema.n
