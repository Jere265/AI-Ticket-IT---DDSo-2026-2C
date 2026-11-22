import { TipoEntrada } from '../../src/models/TipoEntrada.js';

describe('TipoEntrada', () => {
  describe('constructor', () => {
    test('should create a tipoEntrada with all properties', () => {
      const tipo = new TipoEntrada({
        id: 1,
        eventoId: 10,
        nombre: 'VIP',
        precio: 5000,
        cupoTotal: 100,
        cupoDisponible: 100
      });
      expect(tipo.id).toBe(1);
      expect(tipo.eventoId).toBe(10);
      expect(tipo.nombre).toBe('VIP');
      expect(tipo.precio).toBe(5000);
      expect(tipo.cupoTotal).toBe(100);
      expect(tipo.cupoDisponible).toBe(100);
    });

    test('should default cupoDisponible to cupoTotal when not provided', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'General', precio: 1000, cupoTotal: 50 });
      expect(tipo.cupoDisponible).toBe(50);
    });

    test('should default numeric properties to zero', () => {
      const tipo = new TipoEntrada();
      expect(tipo.precio).toBe(0);
      expect(tipo.cupoTotal).toBe(0);
      expect(tipo.cupoDisponible).toBe(0);
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid tipoEntrada', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when eventoId is missing', () => {
      const tipo = new TipoEntrada({ nombre: 'VIP', precio: 5000, cupoTotal: 100 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El tipo de entrada debe pertenecer a un evento.');
    });

    test('should return error when nombre is missing', () => {
      const tipo = new TipoEntrada({ eventoId: 1, precio: 5000, cupoTotal: 100 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El nombre del tipo de entrada es obligatorio.');
    });
    test('should return error when precio is negative', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: -100, cupoTotal: 100 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El precio debe ser un número mayor o igual a cero.');
    });

    test('should return error when cupoTotal is less than 1', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 0 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El cupo total debe ser mayor a cero.');
    });

    test('should return error when cupoDisponible is negative', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: -5 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El cupo disponible no puede ser negativo.');
    });

    test('should return error when cupoDisponible exceeds cupoTotal', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 150 });
      const resultado = tipo.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El cupo disponible no puede superar el cupo total.');
    });
  });
  describe('tieneDisponibilidad', () => {
    test('should return true when cupoDisponible is sufficient', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 50 });
      expect(tipo.tieneDisponibilidad(10)).toBe(true);
      expect(tipo.tieneDisponibilidad(50)).toBe(true);
    });

    test('should return false when cupoDisponible is insufficient', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 10 });
      expect(tipo.tieneDisponibilidad(20)).toBe(false);
    });

    test('should return false when cantidad is zero or negative', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 50 });
      expect(tipo.tieneDisponibilidad(0)).toBe(false);
      expect(tipo.tieneDisponibilidad(-5)).toBe(false);
    });
  });

  describe('reservar', () => {
    test('should decrease cupoDisponible when reserving', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 50 });
      const resultado = tipo.reservar(10);
      expect(resultado.exito).toBe(true);
      expect(tipo.cupoDisponible).toBe(40);
    });

    test('should return error when insufficient cupo', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 5 });
      const resultado = tipo.reservar(10);
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toContain('Cupo insuficiente');
    });
  });

  describe('liberar', () => {
    test('should increase cupoDisponible when liberating', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 30 });
      tipo.liberar(20);
      expect(tipo.cupoDisponible).toBe(50);
    });

    test('should cap cupoDisponible at cupoTotal', () => {
      const tipo = new TipoEntrada({ eventoId: 1, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 90 });
      tipo.liberar(30);
      expect(tipo.cupoDisponible).toBe(100);
    });
  });

  describe('actualizar', () => {
    test('should update provided fields', () => {
      const tipo = new TipoEntrada({ id: 1, nombre: 'Viejo', precio: 1000, cupoTotal: 50 });
      tipo.actualizar({ nombre: 'Nuevo', precio: 2000, cupoTotal: 80 });
      expect(tipo.nombre).toBe('Nuevo');
      expect(tipo.precio).toBe(2000);
      expect(tipo.cupoTotal).toBe(80);
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const tipo = new TipoEntrada({ id: 1, eventoId: 10, nombre: 'VIP', precio: 5000, cupoTotal: 100, cupoDisponible: 50 });
      const json = tipo.toJSON();
      expect(json.id).toBe(1);
      expect(json.nombre).toBe('VIP');
      expect(json.precio).toBe(5000);
      expect(json.cupoTotal).toBe(100);
      expect(json.cupoDisponible).toBe(50);
    });
  });
});