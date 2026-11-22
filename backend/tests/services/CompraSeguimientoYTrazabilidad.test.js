import { CompraService } from '../../src/services/CompraService.js';
import { Compra } from '../../src/models/Compra.js';
import { TipoEntrada } from '../../src/models/TipoEntrada.js';
import { Evento } from '../../src/models/Evento.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';
import { CambioEstadoCompra } from '../../src/models/CambioEstadoCompra.js';

describe('CompraService - Seguimiento, Trazabilidad y Total (Fuente: PDF)', () => {
  let compraRepo;
  let tipoRepo;
  let eventoRepo;
  let cambioRepo;
  let service;

  let compras = [];
  let tipos = [];
  let eventos = [];
  let cambios = [];

  beforeEach(() => {
    compras = [];
    tipos = [];
    eventos = [];
    cambios = [];

    compraRepo = {
      guardar: (c) => {
        if (!c.id) c.id = compras.length + 1;
        const idx = compras.findIndex(item => item.id === c.id);
        if (idx >= 0) compras[idx] = c;
        else compras.push(c);
        return c;
      },
      buscarPorId: (id) => compras.find(c => c.id === id) || null,
      buscarPorComprador: (compradorId) => compras.filter(c => c.compradorId === compradorId),
      buscarPorEvento: (eventoId) => compras.filter(c => c.eventoId === eventoId)
    };

    tipoRepo = {
      guardar: (t) => {
        if (!t.id) t.id = tipos.length + 1;
        const idx = tipos.findIndex(item => item.id === t.id);
        if (idx >= 0) tipos[idx] = t;
        else tipos.push(t);
        return t;
      },
      buscarPorId: (id) => tipos.find(t => t.id === id) || null
    };

    eventoRepo = {
      buscarPorId: (id) => eventos.find(e => e.id === id) || null
    };

    cambioRepo = {
      guardar: (c) => {
        if (!c.id) c.id = cambios.length + 1;
        cambios.push(c);
        return c;
      },
      buscarPorCompra: (compraId) => cambios.filter(c => c.compraId === compraId)
    };

    service = new CompraService(compraRepo, tipoRepo, eventoRepo, cambioRepo);
  });

  test('should calculate total and record CambioEstadoCompra transitions upon creation', () => {
    const tipo = new TipoEntrada({
      id: 1,
      eventoId: 10,
      nombre: 'VIP',
      precio: 4500,
      cupoTotal: 50,
      cupoDisponible: 50
    });
    tipos.push(tipo);

    const res = service.crearCompra({
      compradorId: 7,
      eventoId: 10,
      tipoEntradaId: 1,
      cantidad: 2
    });

    expect(res.exito).toBe(true);
    expect(res.compra.total).toBe(9000); // 2 * 4500
    expect(res.compra.estado).toBe(EstadoCompra.CONFIRMADA);

    const historial = service.obtenerHistorialEstados(res.compra.id);
    expect(historial.length).toBeGreaterThanOrEqual(2);
    expect(historial[0].estado).toBe(EstadoCompra.PENDIENTE_PAGO);
    expect(historial[1].estado).toBe(EstadoCompra.CONFIRMADA);
  });

  test('cancelarCompra should infer evento ya ocurrio from Evento when not passed', () => {
    const evFuturo = new Evento({
      id: 10,
      nombre: 'Festival Futuro',
      fecha: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // dentro de 5 días
    });
    eventos.push(evFuturo);

    const tipo = new TipoEntrada({
      id: 1,
      eventoId: 10,
      precio: 1000,
      cupoTotal: 10,
      cupoDisponible: 8
    });
    tipos.push(tipo);

    const compra = new Compra({
      id: 1,
      compradorId: 7,
      eventoId: 10,
      tipoEntradaId: 1,
      cantidad: 2,
      estado: EstadoCompra.CONFIRMADA
    });
    compras.push(compra);

    // Cancelar sin pasar eventoYaOcurrio explícito
    const res = service.cancelarCompra(1);
    expect(res.exito).toBe(true);
    expect(res.compra.estado).toBe(EstadoCompra.REEMBOLSADA);
    expect(tipo.cupoDisponible).toBe(10); // Restituido

    const historial = service.obtenerHistorialEstados(1);
    expect(historial.some(h => h.estado === EstadoCompra.REEMBOLSADA)).toBe(true);
  });

  test('listarComprasDetalladasPorComprador should include diasRestantes', () => {
    const fechaEvento = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10); // 10 días en el futuro
    const ev = new Evento({ id: 20, nombre: 'Recital', fecha: fechaEvento });
    eventos.push(ev);

    const compra = new Compra({
      id: 1,
      compradorId: 7,
      eventoId: 20,
      tipoEntradaId: 1,
      cantidad: 1,
      estado: EstadoCompra.CONFIRMADA
    });
    compras.push(compra);

    const detalladas = service.listarComprasDetalladasPorComprador(7);
    expect(detalladas).toHaveLength(1);
    expect(detalladas[0].diasRestantes).toBeGreaterThanOrEqual(9);
    expect(detalladas[0].estado).toBe(EstadoCompra.CONFIRMADA);
  });
});
