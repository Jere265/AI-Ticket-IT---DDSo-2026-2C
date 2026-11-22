import { ResenaService } from '../../src/services/ResenaService.js';
import { Resena } from '../../src/models/Resena.js';
import { Compra } from '../../src/models/Compra.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';
import { Evento } from '../../src/models/Evento.js';

describe('ResenaService', () => {
  let mockResenaRepo;
  let mockCompraRepo;
  let mockEventoRepo;
  let service;
  let resenaGuardarCalls;

  beforeEach(() => {
    resenaGuardarCalls = 0;
    mockResenaRepo = {
      guardar: (r) => { r.id = 1; resenaGuardarCalls++; return r; },
      buscarPorCompraYComprador: () => null,
      buscarPorEvento: () => [],
      listarTodos: () => []
    };
    mockCompraRepo = {
      buscarPorId: () => null
    };
    mockEventoRepo = {
      buscarPorId: () => null
    };
    service = new ResenaService(mockResenaRepo, mockCompraRepo, mockEventoRepo);
  });

  describe('crearResena', () => {
    const datosValidos = {
      compraId: 1,
      compradorId: 10,
      eventoId: 20,
      puntaje: 5,
      comentario: 'Excelente evento'
    };

    test('should create resena successfully', () => {
      const compra = new Compra({ id: 1, compradorId: 10, eventoId: 20, estado: EstadoCompra.UTILIZADA });
      mockCompraRepo.buscarPorId = () => compra;
      mockResenaRepo.buscarPorCompraYComprador = () => null;
      mockResenaRepo.guardar = (r) => { r.id = 1; resenaGuardarCalls++; return new Resena({ id: 1, ...datosValidos }); };

      const resultado = service.crearResena(datosValidos);

      expect(resultado.exito).toBe(true);
      expect(resultado.resena).toBeInstanceOf(Resena);
      expect(resenaGuardarCalls).toBe(1);
    });

    test('should return error when compra does not exist', () => {
      const resultado = service.crearResena(datosValidos);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores[0]).toContain('la compra asociada no existe.');
    });

    test('should return error when comprador does not match compra', () => {
      const compra = new Compra({ id: 1, compradorId: 99, eventoId: 20, estado: EstadoCompra.UTILIZADA });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.crearResena({ ...datosValidos, compradorId: 10 });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Solo el comprador de la compra puede calificarla.');
    });

    test('should return error when compra is not UTILIZADA', () => {
      const compra = new Compra({ id: 1, compradorId: 10, eventoId: 20, estado: EstadoCompra.CONFIRMADA });
      mockCompraRepo.buscarPorId = () => compra;

      const resultado = service.crearResena(datosValidos);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Solo se puede calificar una compra en estado UTILIZADA.');
    });

    test('should return error when resena already exists', () => {
      const compra = new Compra({ id: 1, compradorId: 10, eventoId: 20, estado: EstadoCompra.UTILIZADA });
      mockCompraRepo.buscarPorId = () => compra;
      mockResenaRepo.buscarPorCompraYComprador = () => new Resena({ id: 1 });

      const resultado = service.crearResena(datosValidos);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Ya existe una resena para esta compra.');
    });

    test('should return validation error for invalid puntaje', () => {
      const compra = new Compra({ id: 1, compradorId: 10, eventoId: 20, estado: EstadoCompra.UTILIZADA });
      mockCompraRepo.buscarPorId = () => compra;
      mockResenaRepo.buscarPorCompraYComprador = () => null;

      const resultado = service.crearResena({ ...datosValidos, puntaje: 0 });

      expect(resultado.exito).toBe(false);
    });
  });

  describe('obtenerResenasDeEvento', () => {
    test('should return resenas for evento', () => {
      const resenas = [new Resena({ id: 1, eventoId: 20 })];
      mockResenaRepo.buscarPorEvento = () => resenas;
      expect(service.obtenerResenasDeEvento(20)).toEqual(resenas);
    });
  });

  describe('calcularPuntajePromedioOrganizador', () => {
    test('should return average puntaje for organizador', () => {
      const resenas = [
        new Resena({ id: 1, eventoId: 20, puntaje: 5 }),
        new Resena({ id: 2, eventoId: 21, puntaje: 3 })
      ];
      const evento1 = new Evento({ id: 20, organizadorId: 1 });
      const evento2 = new Evento({ id: 21, organizadorId: 1 });

      mockResenaRepo.listarTodos = () => resenas;
      mockEventoRepo.buscarPorId = (id) => id === 20 ? evento1 : evento2;

      const resultado = service.calcularPuntajePromedioOrganizador(1);

      expect(resultado).toBe(4);
    });

    test('should return null when no resenas for organizador', () => {
      mockResenaRepo.listarTodos = () => [];
      expect(service.calcularPuntajePromedioOrganizador(1)).toBeNull();
    });

    test('should return null when no matching eventos', () => {
      const resenas = [new Resena({ id: 1, eventoId: 99, puntaje: 5 })];
      mockResenaRepo.listarTodos = () => resenas;
      mockEventoRepo.buscarPorId = () => null;
      expect(service.calcularPuntajePromedioOrganizador(1)).toBeNull();
    });
  });
});