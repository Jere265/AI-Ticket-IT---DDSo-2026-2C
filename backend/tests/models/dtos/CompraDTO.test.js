import { CompraDTO } from '../../../src/models/dtos/CompraDTO.js';
import { EstadoCompra } from '../../../src/models/value-objects/EstadoCompra.js';

describe('CompraDTO', () => {
  test('should create DTO from compra without evento', () => {
    const compra = {
      id: 1,
      eventoId: 10,
      tipoEntradaId: 20,
      cantidadEntradas: 2,
      estado: EstadoCompra.CONFIRMADA,
      fechaCompra: new Date('2025-06-15T10:00:00Z'),
      calcularDiasRestantes: () => null
    };
    const dto = new CompraDTO(compra);
    const json = dto.toJSON();
    expect(json.id).toBe(1);
    expect(json.eventoId).toBe(10);
    expect(json.tipoEntradaId).toBe(20);
    expect(json.cantidadEntradas).toBe(2);
    expect(json.estado).toBe(EstadoCompra.CONFIRMADA);
    expect(json.diasRestantes).toBeNull();
  });

  test('should create DTO from compra with evento', () => {
    const fechaEvento = new Date('2025-12-31T20:00:00Z');
    const compra = {
      id: 1,
      eventoId: 10,
      tipoEntradaId: 20,
      cantidadEntradas: 2,
      estado: EstadoCompra.CONFIRMADA,
      fechaCompra: new Date('2025-06-15T10:00:00Z'),
      calcularDiasRestantes: () => 199
    };
    const evento = { fechaEvento };
    const dto = new CompraDTO(compra, evento);
    const json = dto.toJSON();
    expect(json.diasRestantes).toBe(199);
  });
});