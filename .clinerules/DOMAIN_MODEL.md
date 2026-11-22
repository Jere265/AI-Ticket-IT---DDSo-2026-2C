# DOMAIN\_MODEL.md

# Modelo de Dominio \- AI Ticket It

## Objetivo

El sistema AI Ticket It permite que organizadores publiquen eventos y que compradores adquieran entradas, realicen consultas, gestionen cancelaciones y califiquen su experiencia luego de asistir.

---

# Entidades Principales

## Organizador

Representa a una persona o entidad responsable de publicar y administrar eventos.

### Responsabilidades

- Crear eventos.
- Gestionar información de eventos.
- Consultar compras realizadas.
- Responder mensajes de compradores.
- Recibir resenas y calificaciones.

### Atributos sugeridos

- id
- nombre
- email

---

## Comprador

Representa al usuario que navega eventos y adquiere entradas.

### Responsabilidades

- Buscar eventos.
- Comprar entradas.
- Consultar compras realizadas.
- Enviar mensajes.
- Cancelar compras.
- Calificar eventos.

### Atributos sugeridos

- id
- nombre
- email

---

## Evento

Representa una actividad publicada por un organizador.

### Responsabilidades

- Ofrecer entradas.
- Recibir compras.
- Recibir resenas.

### Atributos sugeridos

- id
- titulo
- descripcion
- categoria
- fechaEvento
- imagen
- organizador

### Relaciones

- Pertenece a un Organizador.
- Posee múltiples Tipos de Entrada.
- Posee múltiples Compras.
- Posee múltiples Resenas.

---

## TipoEntrada

Representa una modalidad de acceso a un evento.

Ejemplos:

- General
- Platea
- VIP

### Atributos sugeridos

- id
- nombre
- precio
- cupoTotal
- cupoDisponible

### Relaciones

- Pertenece a un Evento.

---

## Compra

Representa la adquisición de entradas por parte de un comprador.

### Atributos sugeridos

- id
- fechaCompra
- cantidadEntradas
- estado

### Relaciones

- Pertenece a un Comprador.
- Pertenece a un Evento.
- Corresponde a un TipoEntrada.
- Posee múltiples Mensajes.
- Puede poseer una Resena.

---

## Mensaje

Representa una comunicación dentro del chat asociado a una compra.

### Atributos sugeridos

- id
- fechaHora
- contenido
- remitente

### Relaciones

- Pertenece a una Compra.

---

## Resena

Representa la valoración realizada por un comprador.

### Atributos sugeridos

- id
- puntaje
- comentario
- fecha

### Relaciones

- Pertenece a una Compra.
- Pertenece a un Evento.
- Fue creada por un Comprador.

---

# Enumeraciones

## EstadoCompra

Valores posibles:

- PENDIENTE\_PAGO
- CONFIRMADA
- UTILIZADA
- CANCELADA
- REEMBOLSADA

---

# Relaciones del Dominio

Organizador 1 \-\-\-\-\- N Evento

Evento 1 \-\-\-\-\- N TipoEntrada

Evento 1 \-\-\-\-\- N Compra

Comprador 1 \-\-\-\-\- N Compra

Compra 1 \-\-\-\-\- N Mensaje

Compra 1 \-\-\-\-\- 0..1 Resena

Evento 1 \-\-\-\-\- N Resena

Comprador 1 \-\-\-\-\- N Resena

---

# Conceptos Derivados

## Disponibilidad de Entradas

Se obtiene a partir del cupo disponible de cada TipoEntrada.

## Días Restantes

Se calcula como:

fechaEvento \- fechaActual

Aplicable únicamente para compras confirmadas.

## Puntaje del Organizador

Se obtiene a partir del promedio de las resenas recibidas en sus eventos.


