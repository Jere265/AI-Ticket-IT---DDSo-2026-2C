# CU\-02 Crear Evento

## Objetivo

Permitir que un organizador publique un nuevo evento.

## Actor Principal

Organizador

## Precondiciones

- El organizador existe en el sistema.

## Flujo Principal

1. El organizador selecciona "Crear Evento".
2. Ingresa título, descripción, categoría y fecha.
3. Define uno o más tipos de entrada.
4. El sistema valida la información.
5. El sistema registra el evento.
6. El sistema confirma la creación.

## Flujos Alternativos

### A1. Datos incompletos

1. Falta información obligatoria.
2. El sistema rechaza la operación.
3. Se informa el motivo.

### A2. Sin tipos de entrada

1. No se registra ningún tipo de entrada.
2. El sistema rechaza la creación.

## Postcondiciones

- El evento queda disponible para consultas y compras.

## Reglas de Negocio Relacionadas

- BR\-01 Creación de Eventos
- BR\-02 Tipos de Entrada

