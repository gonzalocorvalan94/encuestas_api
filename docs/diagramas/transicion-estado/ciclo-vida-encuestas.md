
```mermaid
stateDiagram-v2

    [*] --> Borrador : Crear encuesta

    Borrador --> Activa : Publicar
    Activa --> Cerrada : Cerrar

    Activa --> Activa : Registrar respuestas

    Cerrada --> [*]

    note right of Borrador
        Se crea y se configura
        la encuesta.
        Se agregan preguntas
        y opciones.
    end note

    note right of Activa
        La encuesta está disponible
        para los participantes
        y acepta respuestas.
    end note

    note right of Cerrada
        No permite nuevas respuestas.
        Se pueden consultar
        los resultados.
    end note
```
