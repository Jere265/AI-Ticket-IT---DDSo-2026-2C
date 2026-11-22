import { CompraService } from '../../src/services/CompraService.js';
import { Compra } from '../../src/models/Compra.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';
import { TipoEntrada } from '../../src/models/TipoEntrada.js';

describe('CompraService', () => {
  let mockCompraRepo;
  let mockTipoEntradaRepo;
  let mockEventoRepo;
  let service;
  let compraGuardarCalls;
  let tipoGuardarCalls;

  beforeEach(() => {
    compraGuardarCalls = 0;
    tipoGuardarCalls = 0;
    mockCompraRepo = {
      guardar: (c) => { c.id = 1; compraGuardarCalls++; return c; },
      buscarPorId: () => null,
      buscarPorComprador: () => [],
      buscarPorEvento: () => []
    };
    mockTipoEntradaRepo = {
      buscarPorId: () => null,
      guardar: () => { tipoGuardarCalls++; }
    };
    mockEventoRepo = {
      buscarPorId: () => null
    };
    service = new CompraService(mockCompraRepo, mockTipoEntradaRepo, mockEventoRepo);
  });

  describe('crearCompra', () => {
    const datosValidos = {
      compradorId: 1,
      eventoId: 2,
      tipoEntradaId: 3,
      cantidadEntradas: 2
    };

    test('should create purchase successfully', () => {
      const tipoEntrada = new TipoEntrada({ id: 3, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 50 });
      mockTipoEntradaRepo.buscarPorId = () => tipoEntrada;
      mockCompraRepo.guardar = (c) => { c.id = 1; compraGuardarCalls++; return new Compra({ id: 1, ...datosValidos, estado: EstadoCompra.PENDIENTE_PAGO }); };

      const resultado = service.crearCompra(datosValidos);

      expect(resultado.exito).toBe(true);
      expect(resultado.compra).toBeInstanceOf(Compra);
      expect(compraGuardarCalls).toBeGreaterThan(0);
      expect(tipoGuardarCalls).toBeGreaterThan(0);
    });

    test('should return validation error for invalid compra data', () => {
      const resultado = service.crearCompra({ cantidadEntradas: 0 });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('La compra debe pertenecer a un comprador.');
    });

    test('should return error when tipoEntrada does not exist', () => {
      const resultado = service.crearCompra(datosValidos);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El tipo de entrada seleccionado no existe.');
    });

    test('should return error when cupo is insufficient', () => {
      const tipoEntrada = new TipoEntrada({ id: 3, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 1 });
      mockTipoEntradaRepo.buscarPorId = () => tipoEntrada;

      const resultado = service.crearCompra({ ...datosValidos, cantidadEntradas: 5 });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores[0]).toContain('Cupo insuficiente');
    });
  });
  describe('cancelarCompra', () => {
    test('should cancel purchase and mark as REEMBOLSADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA, tipoEntradaId: 3, cantidadEntradas: 2 });
      mockCompraRepo.buscarPorId = () => compra;
      const tipoEntrada = new TipoEntrada({ id: 3, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 10 });
      mockTipoEntradaRepo.buscarPorId = () => tipoEntrada;
      mockTipoEntradaRepo.guardar = () => { tipoGuardarCalls++; };

      const resultado = service.cancelarCompra(1, false);

      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.REEMBOLSADA);
      expect(tipoGuardarCalls).toBeGreaterThan(0);
    });

    test('should return error when compra does not exist', () => {
      const resultado = service.cancelarCompra(999, false);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('La compra no existe.');
    });

    test('should return error when evento ya ocurrio', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.cancelarCompra(1, true);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('No se puede cancelar una compra para un evento que ya ocurrió.');
    });

    test('should return error when compra is already UTILIZADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.UTILIZADA });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.cancelarCompra(1, false);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('No se puede cancelar una compra ya utilizada.');
    });
  });

  describe('marcarComoUtilizada', () => {
    test('should mark purchase as UTILIZADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.marcarComoUtilizada(1);

      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.UTILIZADA);
    });

    test('should return error when compra does not exist', () => {
      const resultado = service.marcarComoUtilizada(999);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('La compra no existe.');
    });

    test('should return error when compra is not CONFIRMADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.marcarComoUtilizada(1);

      expect(resultado.exito).toBe(false);
    });
  });

  describe('listarPorComprador', () => {
    test('should return compras of comprador', () => {
      const compras = [new Compra({ id: 1, compradorId: 1 })];
      mockCompraRepo.buscarPorComprador = () => compras;
      expect(service.listarPorComprador(1)).toEqual(compras);
    });
  });

  describe('listarPorEvento', () => {
    test('should return compras of evento', () => {
      const compras = [new Compra({ id: 1, eventoId: 2 })];
      mockCompraRepo.buscarPorEvento = () => compras;
      expect(service.listarPorEvento(2)).toEqual(compras);
    });
  });

  describe('buscarPorId', () => {
    test('should return compra when found', () => {
      const compra = new Compra({ id: 1 });
      mockCompraRepo.buscarPorId = () => compra;
      expect(service.buscarPorId(1)).toBe(compra);
    });

    test('should return null when not found', () => {
      expect(service.buscarPorId(999)).toBeNull();
    });
  });
});