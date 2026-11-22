import { EventoService } from '../../src/services/EventoService.js';
import { Evento } from '../../src/models/Evento.js';
import { TipoEntrada } from '../../src/models/TipoEntrada.js';
import { Compra } from '../../src/models/Compra.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';

describe('EventoService - Ordenamiento y Visualización de Ventas (Página 8)', () => {
  let eventoRepo;
  let tipoRepo;
  let service;
  let eventos = [];
  let tipos = [];

  beforeEach(() => {
    eventos = [];
    tipos = [];
    eventoRepo = {
      guardar: (e) => { e.id = eventos.length + 1; eventos.push(e); return e; },
      buscarPorId: (id) => eventos.find(e => e.id === id) || null,
      buscarPorOrganizador: (orgId) => eventos.filter(e => e.organizadorId === orgId),
      buscarPorCriterio: (c) => eventos.filter(e => e.coincideConBusqueda(c)),
      buscarPorCategoria: (cat) => eventos.filter(e => e.categoria === cat),
      listarTodos: () => [...eventos]
    };
    tipoRepo = {
      guardar: (t) => { t.id = tipos.length + 1; tipos.push(t); return t; },
      buscarPorEvento: (evId) => tipos.filter(t => t.eventoId === evId)
    };
    service = new EventoService(eventoRepo, tipoRepo);
  });

  describe('Ordenamiento de eventos', () => {
    let ev1, ev2, ev3;

    beforeEach(() => {
      ev1 = new Evento({
        id: 1,
        organizadorId: 10,
        nombre: 'Concierto Jazz',
        categoria: 'Musica',
        fecha: '2026-12-15',
        tiposEntrada: [new TipoEntrada({ eventoId: 1, nombre: 'Gral', precio: 5000 })]
      });
      ev2 = new Evento({
        id: 2,
        organizadorId: 20,
        nombre: 'Stand Up Comedy',
        categoria: 'Teatro',
        fecha: '2026-11-30',
        tiposEntrada: [new TipoEntrada({ eventoId: 2, nombre: 'Gral', precio: 2000 })]
      });
      ev3 = new Evento({
        id: 3,
        organizadorId: 30,
        nombre: 'Festival Indie',
        categoria: 'Musica',
        fecha: '2027-01-20',
        tiposEntrada: [new TipoEntrada({ eventoId: 3, nombre: 'Gral', precio: 8000 })]
      });
      eventos.push(ev1, ev2, ev3);
    });

    test('should sort by precio ascending and descending', () => {
      const asc = service.ordenarPorPrecio([ev1, ev2, ev3], 'asc');
      expect(asc.map(e => e.id)).toEqual([2, 1, 3]);

      const desc = service.ordenarPorPrecio([ev1, ev2, ev3], 'desc');
      expect(desc.map(e => e.id)).toEqual([3, 1, 2]);
    });

    test('should sort by fecha ascending and descending', () => {
      const asc = service.ordenarPorFecha([ev1, ev2, ev3], 'asc');
      expect(asc.map(e => e.id)).toEqual([2, 1, 3]);

      const desc = service.ordenarPorFecha([ev1, ev2, ev3], 'desc');
      expect(desc.map(e => e.id)).toEqual([3, 1, 2]);
    });

    test('should sort by organizador score', () => {
      const mockResenaService = {
        calcularPuntajePromedioOrganizador: (orgId) => {
          if (orgId === 10) return 4.0;
          if (orgId === 20) return 4.8;
          if (orgId === 30) return 3.5;
          return 0;
        }
      };

      const sorted = service.ordenarPorPuntajeOrganizador([ev1, ev2, ev3], mockResenaService, 'desc');
      expect(sorted.map(e => e.id)).toEqual([2, 1, 3]);
    });

    test('buscarYOrdenar should filter and order by criteria', () => {
      const res = service.buscarYOrdenar({
        categoria: 'Musica',
        ordenarPor: 'precio',
        direccion: 'asc'
      });

      expect(res).toHaveLength(2);
      expect(res[0].id).toBe(1);
      expect(res[1].id).toBe(3);
    });
  });

  describe('obtenerEstadoVentas para Organizador', () => {
    test('should return compras differentiated by state and available tickets per type', () => {
      const ev = new Evento({ id: 1, organizadorId: 5, nombre: 'Show Rock' });
      eventos.push(ev);

      const t1 = new TipoEntrada({ id: 101, eventoId: 1, nombre: 'Campo', precio: 3000, cupoTotal: 100, cupoDisponible: 70 });
      const t2 = new TipoEntrada({ id: 102, eventoId: 1, nombre: 'Platea', precio: 6000, cupoTotal: 50, cupoDisponible: 50 });
      tipos.push(t1, t2);

      const c1 = new Compra({ id: 1, eventoId: 1, tipoEntradaId: 101, cantidad: 20, estado: EstadoCompra.CONFIRMADA });
      const c2 = new Compra({ id: 2, eventoId: 1, tipoEntradaId: 101, cantidad: 10, estado: EstadoCompra.CONFIRMADA });
      const c3 = new Compra({ id: 3, eventoId: 1, tipoEntradaId: 101, cantidad: 5, estado: EstadoCompra.CANCELADA });

      const mockCompraService = {
        listarPorEvento: (evId) => [c1, c2, c3]
      };

      const resumen = service.obtenerEstadoVentas(1, mockCompraService);
      expect(resumen).not.toBeNull();
      expect(resumen.evento.id).toBe(1);
      expect(resumen.disponibilidadPorTipo).toHaveLength(2);
      expect(resumen.disponibilidadPorTipo[0].cupoDisponible).toBe(70);
      expect(resumen.disponibilidadPorTipo[0].entradasVendidas).toBe(30);
      expect(resumen.comprasPorEstado.CONFIRMADA).toHaveLength(2);
      expect(resumen.comprasPorEstado.CANCELADA).toHaveLength(1);
      expect(resumen.totalEntradasVendidas).toBe(30);
    });
  });
});
