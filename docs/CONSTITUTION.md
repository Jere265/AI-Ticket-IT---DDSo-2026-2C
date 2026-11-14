# CONSTITUTION.md

## AI Ticket It \- Constitución del Proyecto

### 1\. Propósito del Sistema

AI Ticket It es una plataforma móvil para publicación de eventos y venta de entradas que conecta organizadores con compradores.

La aplicación debe permitir:

- Descubrir eventos mediante búsqueda y categorías.
- Gestionar eventos y tipos de entradas.
- Comprar entradas.
- Realizar seguimiento de compras.
- Comunicarse mediante un chat asociado a cada compra.
- Gestionar cancelaciones y reembolsos.
- Calificar eventos y organizadores.

Toda decisión de diseno, desarrollo o implementación deberá priorizar la claridad del flujo de compra de entradas, la facilidad de uso y la mantenibilidad del código.

---

## 2\. Alcance

El proyecto se desarrollará exclusivamente para cumplir los requerimientos funcionales establecidos en la consigna académica.

No deberán agregarse funcionalidades complejas que no aporten valor directo a los casos de uso definidos.

Se priorizará:

- Correctitud funcional.
- Simplicidad.
- Mantenibilidad.
- Comprensión del código por encima de la optimización prematura.

---

## 3\. Stack Tecnológico Obligatorio

### Backend

- Node.js
- Express

### Frontend

- React Native

### Persistencia

- Almacenamiento en memoria.
- No se utilizarán bases de datos persistentes.

### Ejecución

- La aplicación deberá poder ejecutarse localmente.
- El frontend deberá funcionar en entorno mobile.

---

## 4\. Principios de Arquitectura

### Separación de responsabilidades

La aplicación deberá mantener una clara separación entre:

- Presentación
- Lógica de negocio
- Acceso a datos

### Dependencia del dominio

Las reglas de negocio no deberán depender del framework utilizado.

La lógica principal del sistema debe poder comprenderse sin necesidad de analizar Express o React Native.

### Bajo acoplamiento

Los módulos deberán comunicarse mediante interfaces claras y responsabilidades bien definidas.

### Alta cohesión

Cada módulo deberá poseer una responsabilidad específica y bien delimitada.

---

## 5\. Modelo de Dominio

El diseno deberá reflejar explícitamente los conceptos centrales del negocio.

Entidades sugeridas:

- Organizador
- Comprador
- Evento
- TipoEntrada
- Compra
- Mensaje
- Resena

Las relaciones entre entidades deberán representar adecuadamente el contexto de venta de entradas.

---

## 6\. Reglas de Negocio Fundamentales

### Eventos

- Un evento puede ofrecer múltiples tipos de entrada.
- Cada tipo de entrada posee precio y cupo propio.
- La disponibilidad deberá actualizarse según las compras realizadas.

### Compras

- Una compra no puede exceder el cupo disponible.
- Toda compra deberá poseer un estado válido.

Estados permitidos:

- Pendiente de pago
- Confirmada
- Utilizada
- Cancelada
- Reembolsada

### Cancelaciones

Una compra sólo podrá cancelarse cuando:

- El evento aún no haya ocurrido.
- La entrada no haya sido utilizada.

### Resenas

Una resena solamente podrá registrarse cuando:

- El comprador haya utilizado una entrada.
- El evento haya finalizado.

### Mensajería

- Todo mensaje deberá estar asociado a una compra.
- Comprador y organizador podrán participar del mismo chat.

---

## 7\. Calidad de Código

### Nombres

- Utilizar nombres descriptivos.
- Evitar abreviaturas innecesarias.
- Evitar nombres ambiguos.

### Métodos

- Mantener métodos pequenos y enfocados.
- Cada método debe tener una única responsabilidad.

### Duplicación

- Evitar lógica duplicada.
- Extraer funcionalidades reutilizables cuando corresponda.

### Legibilidad

El código debe priorizar la comprensión por encima de la complejidad técnica.

---

## 8\. Manejo de Errores

Toda operación de negocio deberá validar:

- Existencia de entidades requeridas.
- Estados válidos.
- Restricciones de cupo.
- Datos obligatorios.

Los errores deberán devolver mensajes claros y comprensibles.

---

## 9\. API Backend

Las APIs deberán:

- Seguir principios REST.
- Utilizar códigos HTTP apropiados.
- Retornar respuestas consistentes.
- Mantener separación entre DTOs y modelos internos.

---

## 10\. Frontend

La interfaz deberá:

- Presentar información de manera clara.
- Mostrar estados relevantes de compras y eventos.
- Facilitar la navegación principal con la menor cantidad posible de pasos.
- Priorizar experiencia mobile.

---

## 11\. Testing

Toda regla de negocio relevante deberá estar cubierta mediante pruebas.

Especialmente:

- Creación de eventos.
- Compra de entradas.
- Cálculo de disponibilidad.
- Cancelaciones.
- Cambio de estados.
- Calificaciones.
- Búsqueda y filtros.

---

## 12\. Uso de Inteligencia Artificial

La IA será utilizada como herramienta de asistencia al desarrollo.

Toda sugerencia generada por IA deberá:

- Ser comprendida antes de incorporarse.
- Ser validada técnicamente.
- Ser adaptada al contexto del proyecto cuando sea necesario.

No se aceptará código incorporado sin análisis previo de su funcionamiento.

---

## 13\. Definition of Done

Una funcionalidad se considera terminada cuando:

- Cumple el caso de uso correspondiente.
- Respeta las reglas de negocio.
- Puede ejecutarse desde la interfaz.
- Se integra correctamente con backend y frontend.
- Posee validaciones adecuadas.
- No introduce errores en funcionalidades existentes.
- Mantiene la consistencia con esta Constitución.


