import { OrganizadorService } from '../../src/services/OrganizadorService.js';
import { Organizador } from '../../src/models/Organizador.js';

describe('OrganizadorService', () => {
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
      guardar: (o) => { o.id = 1; guardarCalls++; return o; },
      buscarPorId: (id) => { buscarPorIdCalls++; return null; },
      buscarPorEmail: (email) => { buscarPorEmailCalls++; return null; },
      listarTodos: () => { listarTodosCalls++; return []; }
    };
    service = new OrganizadorService(mockRepository);
  });

  describe('registrar', () => {
    test('should register a new organizador successfully', () => {
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return null; };
      mockRepository.guardar = (o) => { o.id = 1; guardarCalls++; return new Organizador({ id: 1, nombre: 'Org', email: 'org@test.com' }); };

      const resultado = service.registrar({ nombre: 'Org', email: 'org@test.com' });

      expect(resultado.exito).toBe(true);
      expect(resultado.organizador).toBeInstanceOf(Organizador);
      expect(buscarPorEmailCalls).toBe(1);
      expect(guardarCalls).toBe(1);
    });

    test('should return validation error when nombre is missing', () => {
      const resultado = service.registrar({ email: 'org@test.com' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El nombre del organizador es obligatorio.');
      expect(guardarCalls).toBe(0);
    });

    test('should return error when email already exists', () => {
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return new Organizador({ id: 1, nombre: 'Existente', email: 'org@test.com' }); };

      const resultado = service.registrar({ nombre: 'Org', email: 'org@test.com' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Ya existe un organizador con ese email.');
      expect(guardarCalls).toBe(0);
    });
  });

  describe('buscarPorId', () => {
    test('should return organizador when found', () => {
      const organizador = new Organizador({ id: 1, nombre: 'Org', email: 'org@test.com' });
      mockRepository.buscarPorId = (id) => { buscarPorIdCalls++; return organizador; };

      const resultado = service.buscarPorId(1);

      expect(resultado).toBe(organizador);
    });

    test('should return null when not found', () => {
      expect(service.buscarPorId(999)).toBeNull();
    });
  });

  describe('buscarPorEmail', () => {
    test('should return organizador when found', () => {
      const organizador = new Organizador({ id: 1, nombre: 'Org', email: 'org@test.com' });
      mockRepository.buscarPorEmail = (email) => { buscarPorEmailCalls++; return organizador; };
      expect(service.buscarPorEmail('org@test.com')).toBe(organizador);
    });

    test('should return null when not found', () => {
      expect(service.buscarPorEmail('no@exist.com')).toBeNull();
    });
  });

  describe('listarTodos', () => {
    test('should return all organizadores', () => {
      const organizadores = [new Organizador({ id: 1, nombre: 'Org1' }), new Organizador({ id: 2, nombre: 'Org2' })];
      mockRepository.listarTodos = () => { listarTodosCalls++; return organizadores; };
      expect(service.listarTodos()).toEqual(organizadores);
    });
  });
});