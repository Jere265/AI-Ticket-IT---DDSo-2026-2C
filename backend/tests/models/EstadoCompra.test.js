import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';

describe('EstadoCompra', () => {
  describe('constants', () => {
    test('should define all expected states', () => {
      expect(EstadoCompra.PENDIENTE).toBe('PENDIENTE');
      expect(EstadoCompra.PENDIENTE_PAGO).toBe('PENDIENTE_PAGO');
      expect(EstadoCompra.CONFIRMADA).toBe('CONFIRMADA');
      expect(EstadoCompra.UTILIZADA).toBe('UTILIZADA');
      expect(EstadoCompra.CANCELADA).toBe('CANCELADA');
      expect(EstadoCompra.REEMBOLSADA).toBe('REEMBOLSADA');
    });
  });

  describe('esValido', () => {
    test('should return true for valid states', () => {
      expect(EstadoCompra.esValido('PENDIENTE')).toBe(true);
      expect(EstadoCompra.esValido('PENDIENTE_PAGO')).toBe(true);
      expect(EstadoCompra.esValido('CONFIRMADA')).toBe(true);
      expect(EstadoCompra.esValido('UTILIZADA')).toBe(true);
      expect(EstadoCompra.esValido('CANCELADA')).toBe(true);
      expect(EstadoCompra.esValido('REEMBOLSADA')).toBe(true);
    });

    test('should return false for invalid states', () => {
      expect(EstadoCompra.esValido('DESCONOCIDO')).toBe(false);
      expect(EstadoCompra.esValido('')).toBe(false);
      expect(EstadoCompra.esValido(null)).toBe(false);
      expect(EstadoCompra.esValido(undefined)).toBe(false);
    });
  });

  describe('listarTodos', () => {
    test('should return all valid states as an array', () => {
      const estados = EstadoCompra.listarTodos();
      expect(Array.isArray(estados)).toBe(true);
      expect(estados).toContain('PENDIENTE');
      expect(estados).toContain('PENDIENTE_PAGO');
      expect(estados).toContain('CONFIRMADA');
      expect(estados).toContain('UTILIZADA');
      expect(estados).toContain('CANCELADA');
      expect(estados).toContain('REEMBOLSADA');
    });
  });
});
