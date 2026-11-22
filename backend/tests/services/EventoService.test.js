import { EventoService } from '../../src/services/EventoService.js';
import { Evento } from '../../src/models/Evento.js';
import { TipoEntrada } from '../../src/models/TipoEntrada.js';

describe('EventoService', () => {
  let mockEventoRepo;
  let mockTipoEntradaRepo;
  let service;
  let eventoGuardarCalls;
  let tipoGuardarCalls;

  beforeEach(() => {
    eventoGuardarCalls = 0;
    tipoGuardarCalls = 0;
    mockEventoRepo = {
      guardar: (e) => { e.id = 1; eventoGuardarCalls++; return e; },
      buscarPorId: () => null,
      buscarPorOrganizador: () => [],
      buscarPorCriterio: () => [],
      buscarPorCategoria: () => []
    };
    mockTipoEntradaRepo = {
      guardar: (t) => { t.id = 1; tipoGuardarCalls++; return t; },
      buscarPorEvento: () => []
    };
    service = new EventoService(mockEventoRepo, mockTipoEntradaRepo);
  });

  describe('crearEvento', () => {
    test('should create evento with tipos de entrada successfully', () => {
      const datosEvento = {
        organizadorId: 1,
        titulo: 'Concierto',
        descripcion: 'Descripción',
        categoria: 'Música',
        fechaEvento: '2025-12-31'
      };
      const tiposEntrada = [
        { nombre: 'VIP', precio: 5000, cupoTotal: 100 },
        { nombre: 'General', precio: 2000, cupoTotal: 200 }
      ];

      const resultado = service.crearEvento(datosEvento, tiposEntrada);

      expect(resultado.exito).toBe(true);
      expect(resultado.evento).toBeInstanceOf(Evento);
      expect(resultado.tiposEntrada).toHaveLength(2);
      expect(eventoGuardarCalls).toBe(1);
      expect(tipoGuardarCalls).toBe(2);
    });

    test('should return validation error for invalid evento', () => {
      const resultado = service.crearEvento({ titulo: 'Solo título' }, []);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El evento debe pertenecer a un organizador.');
    });

    test('should return error when no tiposEntrada provided', () => {
      const resultado = service.crearEvento({
        organizadorId: 1,
        titulo: 'Concierto',
        descripcion: 'Desc',
        categoria: 'Música',
        fechaEvento: '2025-12-31'
      }, []);

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El evento debe tener al menos un tipo de entrada.');
    });

    test('should return error when tipoEntrada validation fails', () => {
      const resultado = service.crearEvento({
        organizadorId: 1,
        titulo: 'Concierto',
        descripcion: 'Desc',
        categoria: 'Música',
        fechaEvento: '2025-12-31'
      }, [{ nombre: '', precio: -1, cupoTotal: 0 }]);

      expect(resultado.exito).toBe(false);
    });
  });

  describe('buscarPorId', () => {
    test('should return evento when found', () => {
      const evento = new Evento({ id: 1, titulo: 'Concierto' });
      mockEventoRepo.buscarPorId = () => evento;
      expect(service.buscarPorId(1)).toBe(evento);
    });

    test('should return null when not found', () => {
      expect(service.buscarPorId(999)).toBeNull();
    });
  });

  describe('listarPorOrganizador', () => {
    test('should return eventos of organizador', () => {
      const eventos = [new Evento({ id: 1, organizadorId: 1 })];
      mockEventoRepo.buscarPorOrganizador = () => eventos;
      expect(service.listarPorOrganizador(1)).toEqual(eventos);
    });
  });

  describe('buscar', () => {
    test('should return eventos matching criterio', () => {
      const eventos = [new Evento({ id: 1, titulo: 'Concierto' })];
      mockEventoRepo.buscarPorCriterio = () => eventos;
      expect(service.buscar('rock')).toEqual(eventos);
    });
  });

  describe('buscarPorCategoria', () => {
    test('should return eventos of categoria', () => {
      const eventos = [new Evento({ id: 1, categoria: 'Música' })];
      mockEventoRepo.buscarPorCategoria = () => eventos;
      expect(service.buscarPorCategoria('Música')).toEqual(eventos);
    });
  });

  describe('obtenerTiposEntrada', () => {
    test('should return tipos de entrada for evento', () => {
      const tipos = [new TipoEntrada({ id: 1, eventoId: 1, nombre: 'VIP' })];
      mockTipoEntradaRepo.buscarPorEvento = () => tipos;
      expect(service.obtenerTiposEntrada(1)).toEqual(tipos);
    });
  });
});