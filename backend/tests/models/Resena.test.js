import { Resena } from '../../src/models/Resena.js';

describe('Resena', () => {
  describe('constructor', () => {
    test('should create a resena with all properties', () => {
      const resena = new Resena({
        id: 1,
        compraId: 10,
        eventoId: 20,
        compradorId: 30,
        puntaje: 5,
        comentario: 'Excelente evento',
        fecha: '2025-06-15T10:00:00Z'
      });
      expect(resena.id).toBe(1);
      expect(resena.compraId).toBe(10);
      expect(resena.eventoId).toBe(20);
      expect(resena.compradorId).toBe(30);
      expect(resena.puntaje).toBe(5);
      expect(resena.comentario).toBe('Excelente evento');
      expect(resena.fecha instanceof Date).toBe(true);
    });

    test('should default numeric and string properties', () => {
      const resena = new Resena();
      expect(resena.compraId).toBeNull();
      expect(resena.eventoId).toBeNull();
      expect(resena.compradorId).toBeNull();
      expect(resena.puntaje).toBe(0);
      expect(resena.comentario).toBe('');
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid resena', () => {
      const resena = new Resena({
        compraId: 1,
        eventoId: 2,
        compradorId: 3,
        puntaje: 4,
        comentario: 'Muy bueno'
      });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when compraId is missing', () => {
      const resena = new Resena({ eventoId: 2, compradorId: 3, puntaje: 4, comentario: 'Bien' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La resena debe estar asociada a una compra.');
    });

    test('should return error when eventoId is missing', () => {
      const resena = new Resena({ compraId: 1, compradorId: 3, puntaje: 4, comentario: 'Bien' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La resena debe estar asociada a un evento.');
    });

    test('should return error when compradorId is missing', () => {
      const resena = new Resena({ compraId: 1, eventoId: 2, puntaje: 4, comentario: 'Bien' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La resena debe tener un comprador asignado.');
    });

    test('should return error when puntaje is less than 1', () => {
      const resena = new Resena({ compraId: 1, eventoId: 2, compradorId: 3, puntaje: 0, comentario: 'Bien' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El puntaje debe ser un número entre 1 y 5.');
    });

    test('should return error when puntaje is greater than 5', () => {
      const resena = new Resena({ compraId: 1, eventoId: 2, compradorId: 3, puntaje: 6, comentario: 'Bien' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
    });

    test('should return error when comentario is empty', () => {
      const resena = new Resena({ compraId: 1, eventoId: 2, compradorId: 3, puntaje: 4, comentario: '' });
      const resultado = resena.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El comentario de la resena es obligatorio.');
    });
  });

  describe('actualizar', () => {
    test('should update puntaje and comentario with valid values', () => {
      const resena = new Resena({ id: 1, puntaje: 3, comentario: 'Bien' });
      const resultado = resena.actualizar(5, 'Excelente');
      expect(resultado.exito).toBe(true);
      expect(resena.puntaje).toBe(5);
      expect(resena.comentario).toBe('Excelente');
    });

    test('should return error when puntaje is invalid', () => {
      const resena = new Resena({ id: 1, puntaje: 3, comentario: 'Bien' });
      const resultado = resena.actualizar(0, 'Comentario');
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('El puntaje debe estar entre 1 y 5.');
    });

    test('should return error when comentario is empty', () => {
      const resena = new Resena({ id: 1, puntaje: 3, comentario: 'Bien' });
      const resultado = resena.actualizar(5, '');
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('El comentario no puede estar vacío.');
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const fecha = new Date('2025-06-15T10:00:00Z');
      const resena = new Resena({
        id: 1,
        compraId: 10,
        eventoId: 20,
        compradorId: 30,
        puntaje: 5,
        comentario: 'Excelente',
        fecha: fecha
      });
      const json = resena.toJSON();
      expect(json.id).toBe(1);
      expect(json.compraId).toBe(10);
      expect(json.eventoId).toBe(20);
      expect(json.compradorId).toBe(30);
      expect(json.puntaje).toBe(5);
      expect(json.comentario).toBe('Excelente');
      expect(json.fecha).toBe(fecha.toISOString());
    });
  });
});