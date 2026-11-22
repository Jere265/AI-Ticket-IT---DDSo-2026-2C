import { Categoria } from '../../src/models/Categoria.js';

describe('Categoria', () => {
  describe('constructor', () => {
    test('should initialize with defaults', () => {
      const c = new Categoria();
      expect(c.nombre).toBe('');
      expect(c.descripcion).toBe('');
    });

    test('should initialize with provided values', () => {
      const c = new Categoria({
        id: 1,
        nombre: 'Recitales',
        descripcion: 'Conciertos de música en vivo'
      });
      expect(c.id).toBe(1);
      expect(c.nombre).toBe('Recitales');
      expect(c.descripcion).toBe('Conciertos de música en vivo');
    });
  });

  describe('validar', () => {
    test('should validate valid categoria', () => {
      const c = new Categoria({ nombre: 'Teatro' });
      const res = c.validar();
      expect(res.valido).toBe(true);
      expect(res.errores).toHaveLength(0);
    });

    test('should reject empty nombre', () => {
      const c = new Categoria({ nombre: '   ' });
      const res = c.validar();
      expect(res.valido).toBe(false);
      expect(res.errores).toContain('El nombre de la categoría es obligatorio.');
    });
  });

  describe('actualizar and toJSON', () => {
    test('should update and convert to JSON', () => {
      const c = new Categoria({ id: 2, nombre: 'Arte' });
      c.actualizar({ descripcion: 'Exposiciones' });
      expect(c.descripcion).toBe('Exposiciones');

      const json = c.toJSON();
      expect(json.id).toBe(2);
      expect(json.nombre).toBe('Arte');
      expect(json.descripcion).toBe('Exposiciones');
    });
  });
});
