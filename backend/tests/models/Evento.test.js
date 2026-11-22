import { Evento } from '../../src/models/Evento.js';

describe('Evento', () => {
  describe('constructor', () => {
    test('should create an evento with all properties', () => {
      const evento = new Evento({
        id: 1,
        organizadorId: 10,
        titulo: 'Concierto de Rock',
        descripcion: 'Un concierto increíble',
        categoria: 'Música',
        fechaEvento: '2025-12-31T20:00:00Z',
        imagen: 'https://example.com/img.jpg'
      });
      expect(evento.id).toBe(1);
      expect(evento.organizadorId).toBe(10);
      expect(evento.titulo).toBe('Concierto de Rock');
      expect(evento.descripcion).toBe('Un concierto increíble');
      expect(evento.categoria).toBe('Música');
      expect(evento.fechaEvento instanceof Date).toBe(true);
      expect(evento.imagen).toBe('https://example.com/img.jpg');
    });

    test('should default string properties to empty string', () => {
      const evento = new Evento();
      expect(evento.titulo).toBe('');
      expect(evento.descripcion).toBe('');
      expect(evento.categoria).toBe('');
      expect(evento.organizadorId).toBeNull();
      expect(evento.fechaEvento).toBeNull();
      expect(evento.imagen).toBeNull();
    });

    test('should parse fechaEvento string to Date', () => {
      const evento = new Evento({ fechaEvento: '2025-06-15T18:00:00Z' });
      expect(evento.fechaEvento).toEqual(new Date('2025-06-15T18:00:00Z'));
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid evento', () => {
      const evento = new Evento({
        organizadorId: 1,
        titulo: 'Concierto',
        descripcion: 'Descripción',
        categoria: 'Música',
        fechaEvento: new Date('2025-12-31')
      });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when organizadorId is missing', () => {
      const evento = new Evento({ titulo: 'Concierto', descripcion: 'D', categoria: 'Música', fechaEvento: new Date() });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El evento debe pertenecer a un organizador.');
    });

    test('should return error when titulo is missing', () => {
      const evento = new Evento({ organizadorId: 1, descripcion: 'D', categoria: 'Música', fechaEvento: new Date() });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El título del evento es obligatorio.');
    });

    test('should return error when descripcion is missing', () => {
      const evento = new Evento({ organizadorId: 1, titulo: 'C', categoria: 'Música', fechaEvento: new Date() });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La descripción del evento es obligatoria.');
    });

    test('should return error when categoria is missing', () => {
      const evento = new Evento({ organizadorId: 1, titulo: 'C', descripcion: 'D', fechaEvento: new Date() });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La categoría del evento es obligatoria.');
    });

    test('should return error when fechaEvento is missing', () => {
      const evento = new Evento({ organizadorId: 1, titulo: 'C', descripcion: 'D', categoria: 'Música' });
      const resultado = evento.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La fecha del evento es obligatoria y debe ser válida.');
    });
  });
  describe('yaOcurrio', () => {
    test('should return true when fechaEvento is in the past', () => {
      const evento = new Evento({ fechaEvento: new Date('2020-01-01') });
      expect(evento.yaOcurrio()).toBe(true);
    });

    test('should return false when fechaEvento is in the future', () => {
      const evento = new Evento({ fechaEvento: new Date('2099-12-31') });
      expect(evento.yaOcurrio()).toBe(false);
    });

    test('should return false when fechaEvento is null', () => {
      const evento = new Evento();
      expect(evento.yaOcurrio()).toBe(false);
    });
  });

  describe('calcularDiasRestantes', () => {
    test('should return days remaining for a future event', () => {
      const futuro = new Date();
      futuro.setDate(futuro.getDate() + 10);
      const evento = new Evento({ fechaEvento: futuro });
      const dias = evento.calcularDiasRestantes();
      expect(dias).toBeGreaterThan(0);
      expect(dias).toBeLessThanOrEqual(10);
    });

    test('should return null when fechaEvento is null', () => {
      const evento = new Evento();
      expect(evento.calcularDiasRestantes()).toBeNull();
    });

    test('should return null when the event already occurred', () => {
      const evento = new Evento({ fechaEvento: new Date('2020-01-01') });
      expect(evento.calcularDiasRestantes()).toBeNull();
    });
  });

  describe('coincideConBusqueda', () => {
    const evento = new Evento({
      id: 1,
      titulo: 'Concierto de Rock',
      descripcion: 'Banda en vivo en el estadio',
      categoria: 'Música'
    });

    test('should return true when criterio matches titulo', () => {
      expect(evento.coincideConBusqueda('rock')).toBe(true);
      expect(evento.coincideConBusqueda('Concierto')).toBe(true);
    });

    test('should return true when criterio matches descripcion', () => {
      expect(evento.coincideConBusqueda('banda')).toBe(true);
      expect(evento.coincideConBusqueda('estadio')).toBe(true);
    });

    test('should return true when criterio matches categoria', () => {
      expect(evento.coincideConBusqueda('música')).toBe(true);
    });

    test('should be case-insensitive', () => {
      expect(evento.coincideConBusqueda('ROCK')).toBe(true);
      expect(evento.coincideConBusqueda('Rock')).toBe(true);
    });

    test('should return false when criterio does not match', () => {
      expect(evento.coincideConBusqueda('teatro')).toBe(false);
    });

    test('should return true when criterio is empty', () => {
      expect(evento.coincideConBusqueda('')).toBe(true);
    });

    test('should return true when criterio is null', () => {
      expect(evento.coincideConBusqueda(null)).toBe(true);
    });
  });

  describe('actualizar', () => {
    test('should update provided fields', () => {
      const evento = new Evento({
        id: 1,
        titulo: 'Viejo',
        descripcion: 'Vieja',
        categoria: 'Vieja',
        fechaEvento: new Date('2020-01-01'),
        imagen: 'vieja.jpg'
      });
      evento.actualizar({
        titulo: 'Nuevo',
        descripcion: 'Nueva',
        categoria: 'Nueva',
        fechaEvento: '2025-12-31',
        imagen: 'nueva.jpg'
      });
      expect(evento.titulo).toBe('Nuevo');
      expect(evento.descripcion).toBe('Nueva');
      expect(evento.categoria).toBe('Nueva');
      expect(evento.imagen).toBe('nueva.jpg');
      expect(evento.fechaEvento).toEqual(new Date('2025-12-31'));
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const fecha = new Date('2025-12-31T20:00:00Z');
      const evento = new Evento({
        id: 1,
        organizadorId: 10,
        titulo: 'Concierto',
        descripcion: 'Desc',
        categoria: 'Música',
        fechaEvento: fecha,
        imagen: 'img.jpg'
      });
      const json = evento.toJSON();
      expect(json.id).toBe(1);
      expect(json.titulo).toBe('Concierto');
      expect(json.fechaEvento).toBe(fecha.toISOString());
      expect(json.imagen).toBe('img.jpg');
    });

    test('should return null for fechaEvento when it is null', () => {
      const evento = new Evento({ id: 1 });
      const json = evento.toJSON();
      expect(json.fechaEvento).toBeNull();
    });
  });
});