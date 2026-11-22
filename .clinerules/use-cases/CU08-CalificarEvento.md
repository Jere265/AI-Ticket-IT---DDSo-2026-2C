# CU\-08 Calificar Evento

## Objetivo

Permitir al comprador valorar un evento al que asistió.

## Actor Principal

Comprador

## Precondiciones

- La compra se encuentra en estado UTILIZADA.

## Flujo Principal

1. El comprador selecciona una compra utilizada.
2. Indica puntaje.
3. Ingresa comentario.
4. El sistema registra la resena.
5. El sistema actualiza las valoraciones del evento.

## Flujos Alternativos

### A1. Compra no utilizada

1. La compra no está en estado UTILIZADA.
2. El sistema rechaza la operación.

## Postcondiciones

- La resena queda almacenada.

## Reglas de Negocio Relacionadas

- BR\-13 Generación de Resenas
- BR\-14 Contenido de la Resena
- BR\-15 Visualización de Resenas


