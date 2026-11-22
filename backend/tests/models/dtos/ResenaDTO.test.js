import { ResenaDTO } from '../../../src/models/dtos/ResenaDTO.js';

describe('ResenaDTO', () => {
  test('should create DTO from resena', () => {
    const resena = {
      id: 1,
      compraId: 10,
      eventoId: 20,
      compradorId: 30,
      puntaje: 5,
      comentario: 'Excelente',
      fecha: new Date('2025-06-15T10:00:00Z')
    };
    const dto = new ResenaDTO(resena);
    const json = dto.toJSON();
    expect(json.id).toBe(1);
    expect(json.compraId).toBe(10);
    expect(json.eventoId).toBe(20);
    expect(json.compradorId).toBe(30);
    expect(json.puntaje).toBe(5);
    expect(json.comentario).toBe('Excelente');
    expect(json.fecha).toBe(resena.fecha);
  });
});