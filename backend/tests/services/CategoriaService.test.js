import { CategoriaService } from '../../src/services/CategoriaService.js';
import { Categoria } from '../../src/models/Categoria.js';

describe('CategoriaService', () => {
  let repo;
  let service;
  let categorias = [];

  beforeEach(() => {
    categorias = [];
    repo = {
      guardar: (c) => {
        if (!c.id) c.id = categorias.length + 1;
        categorias.push(c);
        return c;
      },
      buscarPorId: (id) => categorias.find(c => c.id === id) || null,
      buscarPorNombre: (nom) => categorias.find(c => c.nombre.toLowerCase() === nom.toLowerCase()) || null,
      listarTodos: () => [...categorias]
    };
    service = new CategoriaService(repo);
  });

  test('should create categoria successfully', () => {
    const res = service.crearCategoria({ nombre: 'Deportes', descripcion: 'Partidos y torneos' });
    expect(res.exito).toBe(true);
    expect(res.categoria).toBeInstanceOf(Categoria);
    expect(res.categoria.nombre).toBe('Deportes');
  });

  test('should reject duplicate categoria', () => {
    service.crearCategoria({ nombre: 'Musica' });
    const res = service.crearCategoria({ nombre: 'musica' });
    expect(res.exito).toBe(false);
    expect(res.errores).toContain('Ya existe una categoría con ese nombre.');
  });

  test('should list all and find by id', () => {
    service.crearCategoria({ nombre: 'Cine' });
    expect(service.listarTodas()).toHaveLength(1);
    expect(service.buscarPorId(1).nombre).toBe('Cine');
  });
});
