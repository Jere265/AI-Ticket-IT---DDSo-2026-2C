import { ResenaService } from '../../src/services/ResenaService.js';
import { Resena } from '../../src/models/Resena.js';
import { Evento } from '../../src/models/Evento.js';

describe('ResenaService - Reseñas de Organizador (Caso de uso 10, Pág 8)', () => {
  let resenaRepo;
  let eventoRepo;
  let service;

  let resenas = [];
  let eventos = [];

  beforeEach(() => {
    resenas = [];
    eventos = [];

    resenaRepo = {
      guardar: (r) => { r.id = resenas.length + 1; resenas.push(r); return r; },
      buscarPorEvento: (evId) => resenas.filter(r => r.eventoId === evId),
      listarTodos: () => [...resenas]
    };

    eventoRepo = {
      buscarPorId: (id) => eventos.find(e => e.id === id) || null,
      buscarPorOrganizador: (orgId) => eventos.filter(e => e.organizadorId === orgId)
    };

    service = new ResenaService(resenaRepo, null, eventoRepo);
  });

  test('should return all reviews for an organizer across multiple events', () => {
    const ev1 = new Evento({ id: 1, organizadorId: 10, nombre: 'Festival Pasado 1' });
    const ev2 = new Evento({ id: 2, organizadorId: 10, nombre: 'Festival Pasado 2' });
    const evOtro = new Evento({ id: 3, organizadorId: 99, nombre: 'Evento de Otro Org' });
    eventos.push(ev1, ev2, evOtro);

    const r1 = new Resena({ id: 101, eventoId: 1, compradorId: 1, puntaje: 5, comentario: 'Genial' });
    const r2 = new Resena({ id: 102, eventoId: 2, compradorId: 2, puntaje: 4, comentario: 'Muy bueno' });
    const r3 = new Resena({ id: 103, eventoId: 3, compradorId: 3, puntaje: 2, comentario: 'Regular' });
    resenas.push(r1, r2, r3);

    const resenasOrg10 = service.obtenerResenasDeOrganizador(10);
    expect(resenasOrg10).toHaveLength(2);
    expect(resenasOrg10.map(r => r.id)).toEqual([101, 102]);

    const promedio = service.calcularPuntajePromedioOrganizador(10);
    expect(promedio).toBe(4.5);
  });
});
