# CU\-07 Cancelar Compra

## Objetivo

Permitir al comprador cancelar una compra y obtener un reembolso.

## Actor Principal

Comprador

## Precondiciones

- Existe una compra registrada.
- El evento aún no ocurrió.

## Flujo Principal

1. El comprador selecciona la compra.
2. Solicita la cancelación.
3. El sistema verifica las condiciones.
4. El sistema procesa el reembolso.
5. El sistema actualiza el estado.
6. El sistema restituye los cupos.

## Flujos Alternativos

### A1. Evento ya realizado

1. El evento ya ocurrió.
2. El sistema rechaza la cancelación.

### A2. Entrada utilizada

1. La compra ya fue utilizada.
2. El sistema rechaza la cancelación.

## Postcondiciones

- La compra queda cancelada o reembolsada.
- Se actualiza la disponibilidad.

## Reglas de Negocio Relacionadas

- BR\-10 Cancelación de Compra
- BR\-11 Reembolso

