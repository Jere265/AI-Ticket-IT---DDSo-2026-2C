# Skill: Service Generation

## Activación

Cuando se implemente lógica de negocio.

---

## Responsabilidades

Los servicios:

- Ejecutan casos de uso.
- Aplican reglas de negocio.
- Coordinan repositorios.
- No conocen HTTP.
- No conocen React Native.

---

## Estructura

Cada servicio debe responder a un caso de uso.

Ejemplo:

CreateEventService

PurchaseTicketService

CancelPurchaseService

SendMessageService

---

## Reglas

No acceder directamente a Express.

No devolver objetos Request o Response.

No contener lógica de presentación.

---

## Testing

Cada servicio debe ser testeable de forma aislada.