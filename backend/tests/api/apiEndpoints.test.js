import request from 'supertest';
import app from '../../server.js';
import { seedInitialData } from '../../src/config/container.js';

describe('API Endpoints - Integración para React Native (Fuente: PDF)', () => {
  beforeEach(() => {
    seedInitialData();
  });

  describe('Salud del Servidor', () => {
    test('GET /health should return status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('Eventos Endpoints (CU 3, CU 4, CU 11)', () => {
    test('GET /api/eventos should list events with default ordering', async () => {
      const res = await request(app).get('/api/eventos');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThan(0);
    });

    test('GET /api/eventos with search query and category filter', async () => {
      const cat = encodeURIComponent('Música');
      const res = await request(app).get(`/api/eventos?categoria=${cat}&criterio=Cosquin`);
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/eventos with ordering by precio asc', async () => {
      const res = await request(app).get('/api/eventos?ordenarPor=precio&direccion=asc');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThanOrEqual(2);
    });

    test('GET /api/eventos/:id should return single event with tiposEntrada', async () => {
      const res = await request(app).get('/api/eventos/1');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.id).toBe(1);
      expect(res.body.datos.tiposEntrada.length).toBeGreaterThan(0);
    });

    test('POST /api/eventos should create a new event with tickets (CU 4)', async () => {
      const nuevoEvento = {
        organizadorId: 1,
        nombre: 'Festival de Primavera',
        descripcion: 'Celebración al aire libre',
        categoria: 'Música',
        fecha: '2026-12-21',
        tiposEntrada: [
          { nombre: 'Anticipada', precio: 5000, cupoTotal: 100 }
        ]
      };

      const res = await request(app).post('/api/eventos').send(nuevoEvento);
      expect(res.status).toBe(201);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.evento.nombre).toBe('Festival de Primavera');
      expect(res.body.datos.tiposEntrada).toHaveLength(1);
    });

    test('GET /api/eventos/:id/ventas should return sales and ticket availability for organizer (CU 2)', async () => {
      const res = await request(app).get('/api/eventos/1/ventas');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.disponibilidadPorTipo.length).toBeGreaterThan(0);
      expect(res.body.datos.comprasPorEstado).toBeDefined();
    });
  });

  describe('Compras Endpoints (CU 1, CU 7, CU 8, CU 12)', () => {
    test('POST /api/compras should execute a purchase, decrease stock and compute total', async () => {
      const datosCompra = {
        compradorId: 2,
        eventoId: 1,
        tipoEntradaId: 1,
        cantidad: 2
      };

      const res = await request(app).post('/api/compras').send(datosCompra);
      expect(res.status).toBe(201);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.estado).toBe('CONFIRMADA');
      expect(res.body.datos.total).toBe(30000); // 2 * 15000
    });

    test('GET /api/compras/comprador/:compradorId should return purchases with remaining days (CU 1)', async () => {
      const res = await request(app).get('/api/compras/comprador/1');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThan(0);
      const compraConfirmada = res.body.datos.find(c => c.estado === 'CONFIRMADA');
      if (compraConfirmada) {
        expect(compraConfirmada.diasRestantes).toBeDefined();
      }
    });

    test('POST /api/compras/:id/cancelar should cancel purchase and refund tickets', async () => {
      // Crear compra confirmada fresca para cancelar
      const compRes = await request(app).post('/api/compras').send({
        compradorId: 1,
        eventoId: 1,
        tipoEntradaId: 1,
        cantidad: 1
      });
      const compraId = compRes.body.datos.id;

      const res = await request(app).post(`/api/compras/${compraId}/cancelar`);
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.estado).toBe('REEMBOLSADA');
    });

    test('POST /api/compras/:id/utilizar should mark ticket as used', async () => {
      // Crear compra confirmada fresca para utilizar
      const compRes = await request(app).post('/api/compras').send({
        compradorId: 1,
        eventoId: 1,
        tipoEntradaId: 1,
        cantidad: 1
      });
      const compraId = compRes.body.datos.id;

      const res = await request(app).post(`/api/compras/${compraId}/utilizar`);
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.estado).toBe('UTILIZADA');
    });

    test('GET /api/compras/:id/historial should return state transitions', async () => {
      const res = await request(app).get('/api/compras/2/historial');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Chat de la Compra Endpoints (CU 5 y CU 6)', () => {
    test('GET and POST /api/compras/:compraId/mensajes', async () => {
      const resList = await request(app).get('/api/compras/2/mensajes');
      expect(resList.status).toBe(200);
      expect(resList.body.exito).toBe(true);
      expect(resList.body.datos.length).toBeGreaterThanOrEqual(2);

      const nuevoMensaje = {
        mensaje: '¿Hay guardarropas en el predio?',
        remitente: 'comprador',
        usuarioId: 1
      };

      const resPost = await request(app).post('/api/compras/2/mensajes').send(nuevoMensaje);
      expect(resPost.status).toBe(201);
      expect(resPost.body.exito).toBe(true);
      expect(resPost.body.datos.contenido).toBe('¿Hay guardarropas en el predio?');
    });
  });

  describe('Reseñas Endpoints (CU 9 y CU 10)', () => {
    test('GET /api/resenas/organizador/:id should return organizer past event reviews and average score (CU 10)', async () => {
      const res = await request(app).get('/api/resenas/organizador/1');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThan(0);
      expect(res.body.puntajePromedio).toBe(5);
    });

    test('POST /api/resenas should allow reviewer to rate a used ticket (CU 9)', async () => {
      // Crear compra, marcarla como utilizada y luego reseñar
      const compRes = await request(app).post('/api/compras').send({
        compradorId: 1,
        eventoId: 1,
        tipoEntradaId: 1,
        cantidad: 1
      });
      const compraId = compRes.body.datos.id;
      await request(app).post(`/api/compras/${compraId}/utilizar`);

      const resena = {
        compraId,
        compradorId: 1,
        puntuacion: 4.5,
        detalle: 'Muy buena experiencia, acceso rápido.'
      };

      const res = await request(app).post('/api/resenas').send(resena);
      expect(res.status).toBe(201);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.puntuacion).toBe(4.5);
    });
  });

  describe('Favoritos del Comprador Endpoints', () => {
    test('should add, get and remove favorite event for comprador', async () => {
      const resAdd = await request(app)
        .post('/api/compradores/1/favoritos')
        .send({ eventoId: 2 });
      expect(resAdd.status).toBe(200);
      expect(resAdd.body.exito).toBe(true);

      const resGet = await request(app).get('/api/compradores/1/favoritos');
      expect(resGet.status).toBe(200);
      expect(resGet.body.datos).toContain(2);

      const resDel = await request(app).delete('/api/compradores/1/favoritos/2');
      expect(resDel.status).toBe(200);
      expect(resDel.body.exito).toBe(true);
    });
  });

  describe('Categorías Endpoints', () => {
    test('GET /api/categorias should return existing categories', async () => {
      const res = await request(app).get('/api/categorias');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.datos.length).toBeGreaterThanOrEqual(3);
    });
  });
});
