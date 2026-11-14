# BUSINESS\_RULES.md

# Reglas de Negocio \- AI Ticket It

## BR\-01 Creación de Eventos

Un organizador puede crear eventos.

Todo evento debe poseer:

- Título.
- Descripción.
- Categoría.
- Fecha de realización.
- Al menos un tipo de entrada.

---

## BR\-02 Tipos de Entrada

Todo evento debe ofrecer uno o más tipos de entrada.

Cada tipo de entrada debe poseer:

- Nombre.
- Precio.
- Cupo.

Ejemplos:

- General.
- Platea.
- VIP.

---

## BR\-03 Disponibilidad

Cada tipo de entrada mantiene su propio cupo disponible.

La disponibilidad disminuye cuando se confirma una compra.

La disponibilidad aumenta cuando una compra es cancelada y reembolsada.

La disponibilidad nunca puede ser negativa.

---

## BR\-04 Compra de Entradas

Un comprador puede adquirir entradas de un único tipo por compra.

La cantidad solicitada no puede superar el cupo disponible.

Si el cupo es insuficiente, la operación debe rechazarse.

---

## BR\-05 Estados de Compra

Toda compra debe encontrarse en uno de los siguientes estados:

- PENDIENTE\_PAGO
- CONFIRMADA
- UTILIZADA
- CANCELADA
- REEMBOLSADA

No existen otros estados válidos.

---

## BR\-06 Visualización de Compras del Comprador

El comprador debe visualizar:

- Evento asociado.
- Estado actual.
- Cantidad comprada.

Para compras confirmadas también debe visualizar:

- Cantidad de días restantes hasta el evento.

---

## BR\-07 Visualización de Compras del Organizador

El organizador debe poder consultar:

- Compras de un evento.
- Estado de cada compra.
- Cantidad de entradas vendidas.
- Cantidad de entradas disponibles por tipo.

---

## BR\-08 Mensajería

Toda compra posee un chat asociado.

Los mensajes deben estar vinculados a una compra existente.

Pueden participar:

- Comprador.
- Organizador.

---

## BR\-09 Envío de Mensajes

Comprador y organizador pueden enviar mensajes en cualquier momento mientras la compra exista en el sistema.

Los mensajes deben almacenarse en orden cronológico.

---

## BR\-10 Cancelación de Compra

Una compra puede cancelarse únicamente cuando:

- El evento aún no ocurrió.
- La compra no está en estado UTILIZADA.

Si alguna condición no se cumple, la cancelación debe rechazarse.

---

## BR\-11 Reembolso

Toda cancelación válida genera un reembolso.

Luego del reembolso:

- El estado de la compra debe actualizarse.
- El cupo debe restituirse.

---

## BR\-12 Utilización de Entradas

Una compra confirmada puede pasar a estado UTILIZADA.

Una compra utilizada representa que el asistente participó del evento.

---

## BR\-13 Generación de Resenas

Solo puede emitirse una resena cuando:

- La compra pertenece al comprador.
- La compra se encuentra UTILIZADA.

---

## BR\-14 Contenido de la Resena

Toda resena debe contener:

- Puntaje numérico.
- Comentario escrito.

---

## BR\-15 Visualización de Resenas

Las resenas deben mostrarse dentro de los eventos pertenecientes al organizador.

Los compradores deben poder consultar resenas previas antes de realizar una compra.

---

## BR\-16 Búsqueda de Eventos

Los eventos deben poder buscarse:

- Mediante texto libre.
- Por categoría.

---

## BR\-17 Ordenamiento de Eventos

Los resultados de búsqueda pueden ordenarse por:

- Precio.
- Fecha del evento.
- Puntaje del organizador.

---

## BR\-18 Puntaje del Organizador

El puntaje de un organizador se calcula utilizando las resenas recibidas en sus eventos.

Se recomienda utilizar el promedio de los puntajes registrados.

---

## BR\-19 Integridad del Dominio

No puede existir:

- Una compra sin comprador.
- Una compra sin evento.
- Un tipo de entrada sin evento.
- Un mensaje sin compra.
- Una resena sin compra.

---

## BR\-20 Persistencia

Todos los datos deben mantenerse en memoria.

No se utilizarán bases de datos ni mecanismos de persistencia permanente.

---

## BR\-21 Restricciones Tecnológicas

Backend obligatorio:

- Node.js
- Express

Frontend obligatorio:

- React Native

Estas tecnologías forman parte de los requisitos del proyecto y no deben reemplazarse.


