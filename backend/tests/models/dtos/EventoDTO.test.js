import { EventoDTO } from '../../../src/models/dtos/EventoDTO.js';

describe('EventoDTO', () => {
  test('should create DTO from evento without tiposEntrada', () => {
    const evento = {
      id: 1,
      titulo: 'Concierto',
      descripcion: 'Descripción',
      categoria: 'Música',
      fechaEvento: new Date('2025-12-31T20:00:00Z'),
      imagen: 'img.jpg',
      organizadorId: 10,
      calcularDiasRestantes: () => 199
    };
    const dto = new EventoDTO(evento);
    const json = dto.toJSON();
    expect(json.id).toBe(1);
    expect(json.titulo).toBe('Concierto');
    expect(json.descripcion).toBe('Descripción');
    expect(json.categoria).toBe('Música');
    expect(json.imagen).toBe('img.jpg');
    expect(json.organizadorId).toBe(10);
    expect(json.diasRestantes).toBe(199);
    expect(json.tiposEntrada).toEqual([]);
  });

  test('should create DTO from evento with tiposEntrada', () => {
    const evento = {
      id: 1,
      titulo: 'Concierto',
      descripcion: 'Descripción',
      categoria: 'Música',
      fechaEvento: new Date('2025-12-31'),
      imagen: null,
      organizadorId: 10,
      calcularDiasRestantes: () => null
    };
    const tipos = [{ id: 1, nombre: 'VIP', precio: 5000 }];
    const dto = new EventoDTO(evento, tipos);
    const json = dto.toJSON();
    expect(json.tiposEntrada).toEqual(tipos);
  });
});