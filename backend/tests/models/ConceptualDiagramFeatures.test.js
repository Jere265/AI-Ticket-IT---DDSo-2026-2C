import { Evento } from '../../src/models/Evento.js';
import { TipoEntrada } from '../../src/models/TipoEntrada.js';
import { Compra } from '../../src/models/Compra.js';
import { Resena, Resenia } from '../../src/models/Resena.js';
import { Mensaje } from '../../src/models/Mensaje.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';
import { Usuario } from '../../src/models/Usuario.js';

describe('Conceptual Diagram Features (Fuente de verdad: PDF)', () => {
  describe('Evento - tuPrecioEstaEntre', () => {
    test('should return true if any tipoEntrada is within range [min, max]', () => {
      const evento = new Evento({
        nombre: 'Concierto Rock',
        tiposEntrada: [
          new TipoEntrada({ nombre: 'General', precio: 1500 }),
          new TipoEntrada({ nombre: 'VIP', precio: 4000 })
        ]
      });

      expect(evento.tuPrecioEstaEntre(1000, 2000)).toBe(true);
      expect(evento.tuPrecioEstaEntre(3500, 5000)).toBe(true);
      expect(evento.tuPrecioEstaEntre(5000, 10000)).toBe(false);
      expect(evento.tuPrecioEstaEntre(100, 500)).toBe(false);
    });

    test('should return false if evento has no tiposEntrada', () => {
      const evento = new Evento({ nombre: 'Charla Vacia' });
      expect(evento.tuPrecioEstaEntre(100, 1000)).toBe(false);
    });

    test('should support both nombre and titulo, fecha and fechaEvento, multimedia and imagen', () => {
      const ev = new Evento({
        nombre: 'Obra Teatral',
        fecha: '2027-01-01',
        multimedia: ['img1.png', 'img2.png']
      });

      expect(ev.titulo).toBe('Obra Teatral');
      expect(ev.nombre).toBe('Obra Teatral');
      expect(ev.fechaEvento).toBeInstanceOf(Date);
      expect(ev.imagen).toBe('img1.png');
      expect(ev.multimedia).toHaveLength(2);
    });
  });

  describe('TipoEntrada - hayCupoPara and descripcion', () => {
    test('should check availability with hayCupoPara', () => {
      const tipo = new TipoEntrada({
        nombre: 'Platea',
        descripcion: 'Asientos numerados fila 1 a 10',
        precio: 2500,
        cupoTotal: 50,
        cupoDisponible: 20
      });

      expect(tipo.descripcion).toBe('Asientos numerados fila 1 a 10');
      expect(tipo.hayCupoPara(15)).toBe(true);
      expect(tipo.hayCupoPara(20)).toBe(true);
      expect(tipo.hayCupoPara(21)).toBe(false);
      expect(tipo.hayCupoPara(0)).toBe(false);
      expect(tipo.hayCupoPara(-5)).toBe(false);
    });
  });

  describe('Compra - actualizarEstado, total, cantidad', () => {
    test('should support total, cantidad, and actualizarEstado', () => {
      const compra = new Compra({
        id: 1,
        compradorId: 10,
        eventoId: 20,
        tipoEntradaId: 30,
        cantidad: 3,
        total: 7500,
        estado: EstadoCompra.PENDIENTE
      });

      expect(compra.cantidad).toBe(3);
      expect(compra.cantidadEntradas).toBe(3);
      expect(compra.total).toBe(7500);

      const res = compra.actualizarEstado(EstadoCompra.CONFIRMADA, 10);
      expect(res.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.CONFIRMADA);
      expect(compra.historialEstados).toHaveLength(1);
      expect(compra.historialEstados[0].estado).toBe(EstadoCompra.CONFIRMADA);
    });
  });

  describe('Mensaje and Resena aliases', () => {
    test('Mensaje supports mensaje, usuario, enviado', () => {
      const u = new Usuario({ id: 5, nombre: 'Lucia' });
      const fecha = new Date('2026-10-15T10:00:00Z');
      const msg = new Mensaje({
        compraId: 1,
        mensaje: 'Hola, a que hora abren puertas?',
        usuario: u,
        enviado: fecha
      });

      expect(msg.mensaje).toBe('Hola, a que hora abren puertas?');
      expect(msg.contenido).toBe('Hola, a que hora abren puertas?');
      expect(msg.enviado).toEqual(fecha);
      expect(msg.usuarioId).toBe(5);
    });

    test('Resena supports detalle, puntuacion and Resenia export', () => {
      const r = new Resena({
        compraId: 1,
        eventoId: 2,
        compradorId: 3,
        puntuacion: 4.5,
        detalle: 'Gran show y sonido'
      });

      expect(r.puntuacion).toBe(4.5);
      expect(r.puntaje).toBe(4.5);
      expect(r.detalle).toBe('Gran show y sonido');
      expect(r.comentario).toBe('Gran show y sonido');
      expect(Resenia).toBe(Resena);
    });
  });
});
