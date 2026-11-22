import { CompradorService } from '../../src/services/CompradorService.js';
import { Comprador } from '../../src/models/Comprador.js';

describe('CompradorService', () => {
  let mockRepository;
  let service;
  let guardarCalls;
  let buscarPorEmailCalls;
  let buscarPorIdCalls;
  let listarTodosCalls;

  beforeEach(() => {
    guardarCalls = 0;
    buscarPorEmailCalls = 0;
    buscarPorIdCalls = 0;
    listarTodosCalls = 0;
    mockRepository = {
      guardar: (c) => { c.id = 1; guardarCalls++; return c; },
      buscarPorId: (id) => { buscarPorIdCalls++; return null; },
      buscarPorEmail: (email) => { buscarPorEmailCalls++; return null; },
      listarTodos: () => { listarTodosCalls++; return []; }
    };
    service = new CompradorService(mockRepository);
  });

  describe('registrar', () => {
    test('should register a new comprador successfully', () => {
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return null; };
      mockRepository.guardar = (c) => { c.id = 1; guardarCalls++; return new Comprador({ id: 1, nombre: 'Juan', email: 'juan@test.com' }); };

      const resultado = service.registrar({ nombre: 'Juan', email: 'juan@test.com' });

      expect(resultado.exito).toBe(true);
      expect(resultado.comprador).toBeInstanceOf(Comprador);
      expect(resultado.errores).toBeUndefined();
      expect(buscarPorEmailCalls).toBe(1);
      expect(guardarCalls).toBe(1);
    });

    test('should return validation error when nombre is missing', () => {
      const resultado = service.registrar({ email: 'juan@test.com' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El nombre del comprador es obligatorio.');
      expect(guardarCalls).toBe(0);
    });

    test('should return validation error when email is missing', () => {
      const resultado = service.registrar({ nombre: 'Juan' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El email del comprador es obligatorio.');
    });

    test('should return error when email already exists', () => {
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return new Comprador({ id: 1, nombre: 'Existente', email: 'juan@test.com' }); };

      const resultado = service.registrar({ nombre: 'Juan', email: 'juan@test.com' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Ya existe un comprador con ese email.');
      expect(guardarCalls).toBe(0);
    });
  });

  describe('buscarPorId', () => {
    test('should return comprador when found', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan', email: 'juan@test.com' });
      mockRepository.buscarPorId = (id) => { buscarPorIdCalls++; return comprador; };

      const resultado = service.buscarPorId(1);

      expect(resultado).toBe(comprador);
      expect(buscarPorIdCalls).toBe(1);
    });

    test('should return null when not found', () => {
      const resultado = service.buscarPorId(999);

      expect(resultado).toBeNull();
    });
  });

  describe('buscarPorEmail', () => {
    test('should return comprador when found', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan', email: 'juan@test.com' });
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return comprador; };

      const resultado = service.buscarPorEmail('juan@test.com');

      expect(resultado).toBe(comprador);
    });

    test('should return null when not found', () => {
      const resultado = service.buscarPorEmail('no@exist.com');

      expect(resultado).toBeNull();
    });
  });

  describe('listarTodos', () => {
    test('should return all compradores', () => {
      const compradores = [new Comprador({ id: 1, nombre: 'Juan' }), new Comprador({ id: 2, nombre: 'Maria' })];
      mockRepository.listarTodos = () => { listarTodosCalls++; return compradores; };

      const resultado = service.listarTodos();

      expect(resultado).toEqual(compradores);
      expect(resultado).toHaveLength(2);
    });
  });
});