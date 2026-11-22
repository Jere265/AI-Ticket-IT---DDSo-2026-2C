import { MensajeDTO } from '../../../src/models/dtos/MensajeDTO.js';

describe('MensajeDTO', () => {
  test('should create DTO from mensaje', () => {
    const mensaje = {
      id: 1,
      compraId: 10,
      contenido: 'Hola',
      remitente: 'comprador',
      fechaHora: new Date('2025-06-15T10:00:00Z')
    };
    const dto = new MensajeDTO(mensaje);
    const json = dto.toJSON();
    expect(json.id).toBe(1);
    expect(json.compraId).toBe(10);
    expect(json.contenido).toBe('Hola');
    expect(json.remitente).toBe('comprador');
    expect(json.fechaHora).toBe(mensaje.fechaHora);
  });
});