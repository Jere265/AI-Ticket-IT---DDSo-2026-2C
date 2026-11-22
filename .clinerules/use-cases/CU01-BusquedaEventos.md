# CU-01 Buscar Eventos

## Objetivo

Permitir que un comprador encuentre eventos disponibles utilizando criterios de búsqueda.

## Actor Principal

Comprador

## Precondiciones

- Existen eventos registrados en el sistema.

## Flujo Principal

1. El comprador accede a la pantalla de búsqueda.
2. Ingresa un texto de búsqueda o selecciona una categoría.
3. El sistema recupera los eventos coincidentes.
4. El sistema muestra los resultados.

## Flujos Alternativos

### A1. Sin resultados

1. No existen eventos que coincidan con los criterios.
2. El sistema informa que no se encontraron resultados.

## Postcondiciones

- El comprador visualiza la lista de eventos encontrados.

## Reglas de Negocio Relacionadas

- BR-16 Búsqueda de Eventos
- BR-19 Integridad del Dominio