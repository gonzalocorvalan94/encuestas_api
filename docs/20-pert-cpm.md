flowchart LR
    T01["T01 (2d)<br>Modelo de datos"]
    T02["T02 (2d)<br>RUD encuestas"]
    T03["T03 (2d)<br>CRUD preguntas/opciones"]
    T04["T04 (1d)<br>Registro participantes"]
    T05["T05 (2d)<br>Carga respuestas"]
    T06["T06 (2d)<br>Vista resultados"]
    T07["T07 (2d)<br>Pruebas y ajustes"]

    T01 --> T02
    T01 --> T04
    T02 --> T03
    T03 --> T05
    T04 --> T05
    T05 --> T06
    T06 --> T07C
