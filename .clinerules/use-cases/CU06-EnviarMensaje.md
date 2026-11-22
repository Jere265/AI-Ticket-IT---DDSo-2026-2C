# CU\-06 Enviar Mensaje

## Objetivo

Permitir la comunicación entre comprador y organizador.

## Actor Principal

Comprador u Organizador

## Precondiciones

- Existe una compra asociada.
- Existe un chat para la compra.

## Flujo Principal

1. El usuario accede al chat.
2. Escribe un mensaje.
3. El sistema valida la información.
4. El sistema registra el mensaje.
5. El sistema actualiza la conversación.

## Flujos Alternativos

### A1. Mensaje vacío

1. El contenido no posee texto.
2. El sistema rechaza el envío.

## Postcondiciones

- El mensaje queda asociado a la compra.

## Reglas de Negocio Relacionadas

- BR\-08 Mensajería
- BR\-09 Envío de Mensajes

