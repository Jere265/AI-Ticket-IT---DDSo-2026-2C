import { Usuario } from '../../src/models/Usuario.js';
import { Evento } from '../../src/models/Evento.js';

describe('Usuario', () => {
  describe('constructor', () => {
    test('should initialize with default values', () => {
      const u = new Usuario();
      expect(u.nombre).toBe('');
      expect(u.apellido).toBe('');
      expect(u.email).toBe('');
      expect(u.favoritos).toEqual([]);
    });

    test('should initialize with given data', () => {
      const u = new Usuario({
        id: 1,
        nombre: 'Carlos',
        apellido: 'Gomez',
        email: 'carlos@example.com',
        favoritos: [101]
      });
      expect(u.id).toBe(1);
      expect(u.nombre).toBe('Carlos');
      expect(u.apellido).toBe('Gomez');
      expect(u.email).toBe('carlos@example.com');
      expect(u.favoritos).toEqual([101]);
    });
  });

  describe('validar', () => {
    test('should pass validation for complete user', () => {
      const u = new Usuario({
        nombre: 'Carlos',
        apellido: 'Gomez',
        email: 'carlos@example.com'
      });
      const res = u.validar();
      expect(res.valido).toBe(true);
      expect(res.errores).toHaveLength(0);
    });

    test('should fail when nombre is missing or blank', () => {
      const u = new Usuario({ email: 'carlos@example.com' });
      const res = u.validar();
      expect(res.valido).toBe(false);
      expect(res.errores).toContain('El nombre del usuario es obligatorio.');
    });

    test('should fail when email is invalid', () => {
      const u = new Usuario({ nombre: 'Carlos', email: 'correo-invalido' });
      const res = u.validar();
      expect(res.valido).toBe(false);
      expect(res.errores).toContain('El email del usuario no tiene un formato válido.');
    });
  });

  describe('favoritos', () => {
    test('should add and check favorite event', () => {
      const u = new Usuario({ nombre: 'Carlos', email: 'carlos@example.com' });
      const evento = new Evento({ id: 50, nombre: 'Lollapalooza' });

      expect(u.agregarFavorito(evento)).toBe(true);
      expect(u.esFavorito(50)).toBe(true);
      expect(u.esFavorito(evento)).toBe(true);
      expect(u.agregarFavorito(evento)).toBe(false); // No duplicar
    });

    test('should remove favorite event', () => {
      const u = new Usuario({ nombre: 'Carlos', email: 'carlos@example.com' });
      u.agregarFavorito(50);
      expect(u.esFavorito(50)).toBe(true);
      expect(u.removerFavorito(50)).toBe(true);
      expect(u.esFavorito(50)).toBe(false);
      expect(u.removerFavorito(50)).toBe(false);
    });
  });

  describe('actualizar and toJSON', () => {
    test('should update fields and serialize to JSON', () => {
      const u = new Usuario({ id: 1, nombre: 'Carlos', email: 'carlos@example.com' });
      u.actualizar({ apellido: 'Perez' });
      expect(u.apellido).toBe('Perez');

      const json = u.toJSON();
      expect(json.id).toBe(1);
      expect(json.nombre).toBe('Carlos');
      expect(json.apellido).toBe('Perez');
      expect(json.email).toBe('carlos@example.com');
    });
  });
});
