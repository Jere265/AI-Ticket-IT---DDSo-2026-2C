import { Entidad } from '../../src/models/Entidad.js';

describe('Entidad', () => {
  describe('constructor', () => {
    test('should create an entity with the provided id', () => {
      const entidad = new Entidad({ id: 42 });
      expect(entidad.id).toBe(42);
    });

    test('should default id to null when not provided', () => {
      const entidad = new Entidad();
      expect(entidad.id).toBeNull();
    });

    test('should set fechaCreacion to current date by default', () => {
      const antes = new Date();
      const entidad = new Entidad();
      const despues = new Date();
      expect(entidad.fechaCreacion instanceof Date).toBe(true);
      expect(entidad.fechaCreacion.getTime()).toBeGreaterThanOrEqual(antes.getTime());
      expect(entidad.fechaCreacion.getTime()).toBeLessThanOrEqual(despues.getTime());
    });

    test('should set fechaActualizacion to current date by default', () => {
      const entidad = new Entidad();
      expect(entidad.fechaActualizacion instanceof Date).toBe(true);
    });

    test('should use provided fechaCreacion and fechaActualizacion', () => {
      const fecha = new Date('2024-01-01T10:00:00Z');
      const entidad = new Entidad({ id: 1, fechaCreacion: fecha, fechaActualizacion: fecha });
      expect(entidad.fechaCreacion).toEqual(fecha);
      expect(entidad.fechaActualizacion).toEqual(fecha);
    });
  });

  describe('tocar', () => {
    test('should update fechaActualizacion to current date', () => {
      const entidad = new Entidad({ id: 1 });
      const fechaOriginal = entidad.fechaActualizacion;

      // Pequeña pausa para asegurar diferencia de tiempo
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        entidad.tocar();
        expect(entidad.fechaActualizacion.getTime()).toBeGreaterThan(fechaOriginal.getTime());
      });
    });
  });

  describe('estaPersistida', () => {
    test('should return true when id is set', () => {
      const entidad = new Entidad({ id: 1 });
      expect(entidad.estaPersistida()).toBe(true);
    });

    test('should return false when id is null', () => {
      const entidad = new Entidad();
      expect(entidad.estaPersistida()).toBe(false);
    });

    test('should return false when id is undefined', () => {
      const entidad = new Entidad({ id: undefined });
      expect(entidad.estaPersistida()).toBe(false);
    });
  });
});