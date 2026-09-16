# Diagrama Entidad-Relación

Este diagrama representa la estructura de datos del sistema de encuestas y las relaciones entre sus entidades.

```dbml
Table encuesta [headercolor: #175e7a] {
	id integer [pk, increment, not null]
	titulo varchar(255)
	fecha_creacion timestamp
	estado varchar(255)
}

Table pregunta [headercolor: #175e7a] {
	id integer [pk, increment, not null]
	encuesta_id integer [not null]
}

Table opcion [headercolor: #175e7a] {
	id integer [pk, increment, not null]
	pregunta_id integer
}

Table respuesta [headercolor: #175e7a] {
	id integer [pk, increment, not null]
	encuesta_id integer
	participante_id integer
	fecha timestamp
}

Table detalle_respuesta [headercolor: #175e7a] {
	respuesta_id integer [not null]
	pregunta_id integer
	opcion_id integer
}

Ref fk_encuesta_id_pregunta {
	encuesta.id < pregunta.encuesta_id
}

Ref fk_pregunta_id_opcion {
	pregunta.id < opcion.pregunta_id
}

Ref fk_encuesta_id_respuesta {
	encuesta.id < respuesta.encuesta_id
}

Ref fk_respuesta_id_detalle_respuesta {
	respuesta.id < detalle_respuesta.respuesta_id
}

Ref fk_pregunta_id_detalle_respuesta {
	pregunta.id < detalle_respuesta.pregunta_id
}

Ref fk_opcion_id_detalle_respuesta {
	opcion.id < detalle_respuesta.opcion_id
}
