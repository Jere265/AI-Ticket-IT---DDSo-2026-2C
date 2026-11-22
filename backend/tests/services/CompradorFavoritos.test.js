import { CompradorService } from '../../src/services/CompradorService.js';
import { Comprador } from '../../src/models/Comprador.js';

describe('CompradorService - Favoritos (Fuente: PDF)', () => {
  let repo;
  let service;
  let compradores = [];

  beforeEach(() => {
    compradores = [];
    repo = {
      guardar: (c) => {
        if (!c.id) c.id = compradores.length + 1;
        const idx = compradores.findIndex(item => item.id === c.id);
        if (idx >= 0) compradores[idx] = c;
        else compradores.push(c);
        return c;
      },
      buscarPorId: (id) => compradores.find(c => c.id === id) || null,
      buscarPorEmail: (email) => compradores.find(c => c.email === email) || null,
      listarTodos: () => [...compradores]
    };
    service = new CompradorService(repo);
  });

  test('should manage favorites for comprador', () => {
    const comprador = new Comprador({ id: 1, nombre: 'Martin', email: 'martin@example.com' });
    compradores.push(comprador);

    const res1 = service.agregarFavorito(1, 100);
    expect(res1.exito).toBe(true);
    expect(service.obtenerFavoritos(1)).toEqual([100]);

    // Intentar agregar duplicado
    const resDuplicado = service.agregarFavorito(1, 100);
    expect(resDuplicado.exito).toBe(false);

    // Remover
    const resRemover = service.removerFavorito(1, 100);
    expect(resRemover.exito).toBe(true);
    expect(service.obtenerFavoritos(1)).toEqual([]);
  });
});
