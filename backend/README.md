# Backend - AI Ticket IT

API REST en Node.js + Express con persistencia en memoria para la aplicación móvil **AI Ticket It**.

---

## 🚀 Conexión desde React Native

Al conectar tu app mobile (React Native / Expo), tené en cuenta la URL base según el entorno:
- **Emulador Android**: `http://10.0.2.2:3001/api`
- **Simulador iOS**: `http://localhost:3001/api`
- **Dispositivo físico (Expo Go / APK)**: `http://<TU_IP_LOCAL>:3001/api` (ej. `http://192.168.1.50:3001/api`)

El backend ya incluye **CORS** y **Helmet** configurados para aceptar conexiones de aplicaciones móviles. Al iniciar el servidor en modo desarrollo (`npm run dev` o `npm start`), se cargan datos iniciales de prueba de forma automática (`seedInitialData`).

---

## 📡 Catálogo de Endpoints de la API

### 1. Eventos (`/api/eventos`)
- **`GET /api/eventos`**: Lista o busca eventos.
  - Query Params:
    - `criterio`: Búsqueda textual por nombre o descripción (ej. `?criterio=rock`).
    - `categoria`: Filtro por categoría (ej. `?categoria=Música`).
    - `ordenarPor`: `precio` | `fecha` | `puntaje` (reputación del organizador).
    - `direccion`: `asc` | `desc`.
- **`GET /api/eventos/:id`**: Detalle del evento con sus tipos de entrada y días restantes.
- **`POST /api/eventos`**: Crear un nuevo evento con sus tipos de entrada (Rol Organizador).
  - Body:
    ```json
    {
      "organizadorId": 1,
      "nombre": "Festival Primavera",
      "descripcion": "Música al aire libre",
      "categoria": "Música",
      "fecha": "2026-12-21T20:00:00.000Z",
      "multimedia": ["https://url-imagen.jpg"],
      "tiposEntrada": [
        { "nombre": "General", "precio": 5000, "cupoTotal": 200, "descripcion": "Acceso al predio" },
        { "nombre": "VIP", "precio": 12000, "cupoTotal": 50, "descripcion": "Acceso preferencial" }
      ]
    }
    ```
- **`GET /api/eventos/:id/ventas`**: Reporte de ventas para el organizador (compras agrupadas por estado y cupos disponibles de cada tipo).
- **`GET /api/eventos/:id/resenas`**: Obtiene las reseñas de un evento específico.

---

### 2. Compras (`/api/compras`)
- **`POST /api/compras`**: Realizar compra de entradas (Rol Comprador).
  - Body:
    ```json
    {
      "compradorId": 1,
      "eventoId": 1,
      "tipoEntradaId": 1,
      "cantidad": 2
    }
    ```
  - Calcula automáticamente el `total`, descuenta el cupo disponible, pasa a estado `CONFIRMADA` y registra la trazabilidad en `CambioEstadoCompra`.
- **`GET /api/compras/:id`**: Detalle de una compra.
- **`GET /api/compras/comprador/:compradorId`**: Historial de compras del comprador, diferenciando estado y calculando los `diasRestantes` para eventos futuros confirmados.
- **`POST /api/compras/:id/cancelar`**: Cancelación de compra y reembolso si el evento aún no ocurrió y no fue utilizada. Restituye los cupos automáticamente.
- **`POST /api/compras/:id/utilizar`**: Marca la entrada como `UTILIZADA` el día del evento.
- **`GET /api/compras/:id/historial`**: Trazabilidad completa de estados (`CambioEstadoCompra`).

---

### 3. Chat de la Compra (`/api/compras/:compraId/mensajes`)
- **`GET /api/compras/:compraId/mensajes`**: Obtiene todos los mensajes intercambiados en la compra en orden cronológico.
- **`POST /api/compras/:compraId/mensajes`**: Enviar un mensaje dentro del chat de la compra.
  - Body:
    ```json
    {
      "mensaje": "¿A qué hora abren las puertas?",
      "remitente": "comprador",
      "usuarioId": 1
    }
    ```

---

### 4. Reseñas y Calificaciones (`/api/resenas`)
- **`POST /api/resenas`**: Calificar evento tras haber asistido (compra utilizada).
  - Body:
    ```json
    {
      "compraId": 1,
      "compradorId": 1,
      "puntuacion": 5,
      "detalle": "Excelente organización y sonido!"
    }
    ```
- **`GET /api/resenas/organizador/:id`**: Obtiene las reseñas de eventos anteriores del organizador y su puntaje promedio.

---

### 5. Usuarios y Favoritos (`/api/compradores`, `/api/organizadores`)
- **`GET /api/compradores/:id/favoritos`**: Lista de eventos favoritos del comprador.
- **`POST /api/compradores/:id/favoritos`**: Guardar evento en favoritos (`{ "eventoId": 2 }`).
- **`DELETE /api/compradores/:id/favoritos/:eventoId`**: Quitar evento de favoritos.
- **`POST /api/compradores`** y **`POST /api/organizadores`**: Registro de usuarios.
- **`GET /api/compradores`** y **`GET /api/organizadores`**: Listado de usuarios.

---

### 6. Categorías y Demo Data
- **`GET /api/categorias`**: Lista las categorías de eventos disponibles.
- **`POST /api/seed`**: Reinicia y carga el lote de datos de prueba predefinidos.

---

## 🧪 Pruebas Automatizadas

```bash
# Ejecutar todas las pruebas unitarias y de controladores
npm test

# Ejecutar pruebas de integración HTTP
npm run test:integration

# Ejecutar todas las suites de prueba
npm run test:all
```
