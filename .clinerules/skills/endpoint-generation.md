# Skill: Endpoint Generation

## Activación

Utilizar esta skill cuando la tarea implique:

- Crear endpoints REST.
- Modificar endpoints existentes.
- Disenar APIs.
- Implementar rutas Express.

---

## Documentos a consultar

Antes de generar código leer:

1. docs/CONSTITUTION.md
2. docs/BUSINESS_RULES.md
3. docs/DOMAIN_MODEL.md
4. Caso de uso correspondiente

---

## Proceso obligatorio

### Paso 1

Identificar:

- Caso de uso
- Entidades involucradas
- Reglas de negocio afectadas

### Paso 2

Definir:

- Método HTTP
- Path
- Request DTO
- Response DTO

### Paso 3

Implementar:

- Route
- Controller
- Service
- Repository (si aplica)

---

## Convenciones

### GET

Para consultas.

Ejemplo:

GET /events

GET /events/:id

---

### POST

Para creación.

Ejemplo:

POST /events

POST /purchases

---

### PUT

Para actualizaciones completas.

---

### PATCH

Para cambios de estado.

Ejemplo:

PATCH /purchases/:id/cancel

---

### DELETE

Solo utilizar cuando el caso de uso requiera eliminación.

---

## Controladores

Los controladores:

✅ reciben requests

✅ validan datos básicos

✅ llaman servicios

✅ devuelven respuestas

Los controladores NO deben contener reglas de negocio.

---

## Servicios

Toda lógica de negocio debe residir en servicios.

Los servicios:

✅ aplican reglas

✅ validan estados

✅ coordinan repositorios

---

## Manejo de errores

Utilizar:

400 - datos inválidos

404 - recurso inexistente

409 - conflicto de negocio

500 - error inesperado

---

## Resultado esperado

Antes de generar código explicar:

- Endpoint
- Path
- Entidad
- Servicio involucrado
- Regla de negocio aplicada
