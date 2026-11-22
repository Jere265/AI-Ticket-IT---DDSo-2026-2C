import { CambioEstadoCompra } from '../../src/models/CambioEstadoCompra.js';
import { EstadoCompra } from '../../src/models/value-objects/EstadoCompra.js';
import { Compra } from '../../src/models/Compra.js';
import { Usuario } from '../../src/models/Usuario.js';

describe('CambioEstadoCompra', () => {
  describe('constructor', () => {
    test('should initialize correctly with entities or IDs', () => {
      const compra = new Compra({ id: 10 });
      const usuario = new Usuario({ id: 25, nombre: 'Ana' });

      const cambio = new CambioEstadoCompra({
        id: 1,
        compra,
        estado: EstadoCompra.CONFIRMADA,
        quien: usuario
      });

      expect(cambio.id).toBe(1);
      expect(cambio.compraId).toBe(10);
      expect(cambio.quienId).toBe(25);
      expect(cambio.estado).toBe(EstadoCompra.CONFIRMADA);
      expect(cambio.fechaHora).toBeInstanceOf(Date);
    });
  });

  describe('validar', () => {
    test('should pass validation when data is complete', () => {
      const cambio = new CambioEstadoCompra({
        compraId: 10,
        estado: EstadoCompra.UTILIZADA
      });
      const res = cambio.validar();
      expect(res.valido).toBe(true);
      expect(res.errores).toHaveLength(0);
    });

    test('should fail when compraId is missing', () => {
      const cambio = new CambioEstadoCompra({
        estado: EstadoCompra.UTILIZADA
      });
      const res = cambio.validar();
      expect(res.valido).toBe(false);
      expect(res.errores).toContain('El cambio de estado debe pertenecer a una compra.');
    });

    test('should fail when estado is invalid', () => {
      const cambio = new CambioEstadoCompra({
        compraId: 10,
        estado: 'ESTADO_INEXISTENTE'
      });
      const res = cambio.validar();
      expect(res.valido).toBe(false);
      expect(res.errores).toContain('El estado registrado no es válido.');
    });
  });

  describe('toJSON', () => {
    test('should serialize to plain object', () => {
      const cambio = new CambioEstadoCompra({
        id: 1,
        compraId: 10,
        estado: EstadoCompra.REEMBOLSADA,
        quienId: 5
      });
      const json = cambio.toJSON();
      expect(json.id).toBe(1);
      expect(json.compraId).toBe(10);
      expect(json.estado).toBe(EstadoCompra.REEMBOLSADA);
      expect(json.quienId).toBe(5);
      expect(typeof json.fechaHora).toBe('string');
    });
  });
});
