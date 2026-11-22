import { Compra } from '../../src/models/Compra.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';

describe('Compra', () => {
  describe('constructor', () => {
    test('should create a compra with all properties', () => {
      const compra = new Compra({
        id: 1,
        compradorId: 10,
        eventoId: 20,
        tipoEntradaId: 30,
        cantidadEntradas: 2,
        estado: EstadoCompra.CONFIRMADA,
        fechaCompra: '2025-06-15T10:00:00Z'
      });
      expect(compra.id).toBe(1);
      expect(compra.compradorId).toBe(10);
      expect(compra.eventoId).toBe(20);
      expect(compra.tipoEntradaId).toBe(30);
      expect(compra.cantidadEntradas).toBe(2);
      expect(compra.estado).toBe(EstadoCompra.CONFIRMADA);
      expect(compra.fechaCompra instanceof Date).toBe(true);
    });

    test('should default to PENDIENTE_PAGO and cantidadEntradas 0', () => {
      const compra = new Compra();
      expect(compra.estado).toBe(EstadoCompra.PENDIENTE_PAGO);
      expect(compra.cantidadEntradas).toBe(0);
      expect(compra.compradorId).toBeNull();
      expect(compra.eventoId).toBeNull();
      expect(compra.tipoEntradaId).toBeNull();
    });

    test('should default fechaCompra to current date', () => {
      const compra = new Compra();
      expect(compra.fechaCompra instanceof Date).toBe(true);
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid compra', () => {
      const compra = new Compra({
        compradorId: 1,
        eventoId: 2,
        tipoEntradaId: 3,
        cantidadEntradas: 2,
        estado: EstadoCompra.PENDIENTE_PAGO
      });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when compradorId is missing', () => {
      const compra = new Compra({ eventoId: 2, tipoEntradaId: 3, cantidadEntradas: 2 });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La compra debe pertenecer a un comprador.');
    });

    test('should return error when eventoId is missing', () => {
      const compra = new Compra({ compradorId: 1, tipoEntradaId: 3, cantidadEntradas: 2 });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La compra debe pertenecer a un evento.');
    });

    test('should return error when tipoEntradaId is missing', () => {
      const compra = new Compra({ compradorId: 1, eventoId: 2, cantidadEntradas: 2 });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La compra debe corresponder a un tipo de entrada.');
    });

    test('should return error when cantidadEntradas is zero', () => {
      const compra = new Compra({ compradorId: 1, eventoId: 2, tipoEntradaId: 3, cantidadEntradas: 0 });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La cantidad de entradas debe ser mayor a cero.');
    });

    test('should return error when cantidadEntradas is negative', () => {
      const compra = new Compra({ compradorId: 1, eventoId: 2, tipoEntradaId: 3, cantidadEntradas: -1 });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
    });

    test('should return error when estado is invalid', () => {
      const compra = new Compra({ compradorId: 1, eventoId: 2, tipoEntradaId: 3, cantidadEntradas: 2, estado: 'INVALIDO' });
      const resultado = compra.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El estado de la compra no es válido.');
    });
  });
  describe('confirmar', () => {
    test('should change estado from PENDIENTE_PAGO to CONFIRMADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      const resultado = compra.confirmar();
      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.CONFIRMADA);
    });

    test('should return error when not in PENDIENTE_PAGO', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA });
      const resultado = compra.confirmar();
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('Solo se pueden confirmar compras en estado PENDIENTE_PAGO.');
    });
  });

  describe('cancelar', () => {
    test('should change estado to REEMBOLSADA when eventoYaOcurrio is false', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      const resultado = compra.cancelar(false);
      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.REEMBOLSADA);
    });

    test('should return error when compra is UTILIZADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.UTILIZADA });
      const resultado = compra.cancelar(false);
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('No se puede cancelar una compra ya utilizada.');
    });

    test('should return error when eventoYaOcurrio is true', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA });
      const resultado = compra.cancelar(true);
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('No se puede cancelar una compra para un evento que ya ocurrió.');
    });

    test('should return error when compra is already CANCELADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CANCELADA });
      const resultado = compra.cancelar(false);
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('La compra ya se encuentra cancelada o reembolsada.');
    });

    test('should return error when compra is already REEMBOLSADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.REEMBOLSADA });
      const resultado = compra.cancelar(false);
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('La compra ya se encuentra cancelada o reembolsada.');
    });
  });

  describe('marcarComoUtilizada', () => {
    test('should change estado from CONFIRMADA to UTILIZADA', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.CONFIRMADA });
      const resultado = compra.marcarComoUtilizada();
      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.UTILIZADA);
    });

    test('should return error when not in CONFIRMADA state', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      const resultado = compra.marcarComoUtilizada();
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('Solo se puede utilizar una compra en estado CONFIRMADA.');
    });
  });

  describe('esElegibleParaResena', () => {
    test('should return true when estado is UTILIZADA', () => {
      const compra = new Compra({ estado: EstadoCompra.UTILIZADA });
      expect(compra.esElegibleParaResena()).toBe(true);
    });

    test('should return false when estado is not UTILIZADA', () => {
      const compra = new Compra({ estado: EstadoCompra.CONFIRMADA });
      expect(compra.esElegibleParaResena()).toBe(false);
    });
  });

  describe('calcularDiasRestantes', () => {
    test('should return days remaining for confirmed compra with future event', () => {
      const compra = new Compra({ estado: EstadoCompra.CONFIRMADA });
      const futuro = new Date();
      futuro.setDate(futuro.getDate() + 10);
      const dias = compra.calcularDiasRestantes(futuro);
      expect(dias).toBeGreaterThan(0);
    });

    test('should return null when compra is not confirmed', () => {
      const compra = new Compra({ estado: EstadoCompra.PENDIENTE_PAGO });
      expect(compra.calcularDiasRestantes(new Date())).toBeNull();
    });

    test('should return null when fechaEvento is null', () => {
      const compra = new Compra({ estado: EstadoCompra.CONFIRMADA });
      expect(compra.calcularDiasRestantes(null)).toBeNull();
    });
  });

  describe('cambiarEstado', () => {
    test('should change estado to a valid state', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      const resultado = compra.cambiarEstado(EstadoCompra.CONFIRMADA);
      expect(resultado.exito).toBe(true);
      expect(compra.estado).toBe(EstadoCompra.CONFIRMADA);
    });

    test('should return error for invalid estado', () => {
      const compra = new Compra({ id: 1, estado: EstadoCompra.PENDIENTE_PAGO });
      const resultado = compra.cambiarEstado('INVALIDO');
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('El estado proporcionado no es válido.');
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const fecha = new Date('2025-06-15T10:00:00Z');
      const compra = new Compra({
        id: 1,
        compradorId: 10,
        eventoId: 20,
        tipoEntradaId: 30,
        cantidadEntradas: 2,
        estado: EstadoCompra.CONFIRMADA,
        fechaCompra: fecha
      });
      const json = compra.toJSON();
      expect(json.id).toBe(1);
      expect(json.compradorId).toBe(10);
      expect(json.eventoId).toBe(20);
      expect(json.tipoEntradaId).toBe(30);
      expect(json.cantidadEntradas).toBe(2);
      expect(json.estado).toBe(EstadoCompra.CONFIRMADA);
      expect(json.fechaCompra).toBe(fecha.toISOString());
    });
  });
});