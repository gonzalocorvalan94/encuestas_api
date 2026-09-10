
sequenceDiagram
    actor Admin as Administrador
    participant Sistema as Sistema (API)
    participant BD as Base de Datos
    actor Part as Participante

    Admin->>Sistema: Crear encuesta (título, descripción)
    Sistema->>BD: Guardar encuesta (estado: borrador)
    BD-->>Sistema: Confirmación
    Sistema-->>Admin: Encuesta creada

    Admin->>Sistema: Agregar preguntas y opciones
    Sistema->>BD: Guardar preguntas/opciones
    BD-->>Sistema: Confirmación
    Sistema-->>Admin: Preguntas guardadas

    Admin->>Sistema: Publicar encuesta
    Sistema->>Sistema: Validar (≥1 pregunta, ≥2 opciones c/u)
    alt Validación exitosa
        Sistema->>BD: Actualizar estado a "activa"
        BD-->>Sistema: Confirmación
        Sistema-->>Admin: Enlace de la encuesta generado
    else Validación fallida
        Sistema-->>Admin: Error: requisitos no cumplidos
    end

    Part->>Sistema: Acceder a encuesta (enlace)
    Sistema->>BD: Consultar encuesta y preguntas
    BD-->>Sistema: Datos de la encuesta
    Sistema-->>Part: Mostrar preguntas y opciones

    Part->>Sistema: Enviar respuestas seleccionadas
    Sistema->>Sistema: Validar respuestas completas
    alt Respuestas completas y encuesta activa
        Sistema->>BD: Registrar respuestas (RESPUESTA, DETALLE_RESPUESTA)
        BD-->>Sistema: Confirmación
        Sistema-->>Part: Mensaje de confirmación
    else Encuesta cerrada o respuestas incompletas
        Sistema-->>Part: Error: no se puede registrar
    end

    Admin->>Sistema: Cerrar encuesta
    Sistema->>BD: Actualizar estado a "cerrada"
    BD-->>Sistema: Confirmación
    Sistema-->>Admin: Encuesta cerrada

    Admin->>Sistema: Consultar resultados
    Sistema->>BD: Obtener respuestas de la encuesta
    BD-->>Sistema: Datos de respuestas
    Sistema->>Sistema: Calcular conteos y porcentajes
    Sistema-->>Admin: Mostrar reporte (tabular/gráfico)
