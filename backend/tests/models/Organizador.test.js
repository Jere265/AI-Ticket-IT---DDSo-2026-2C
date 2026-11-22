import { Organizador } from '../../src/models/Organizador.js';

describe('Organizador', () => {
  describe('constructor', () => {
    test('should create an organizador with nombre and email', () => {
      const organizador = new Organizador({ id: 1, nombre: 'Org Eventos', email: 'org@example.com' });
      expect(organizador.id).toBe(1);
      expect(organizador.nombre).toBe('Org Eventos');
      expect(organizador.email).toBe('org@example.com');
    });

    test('should default nombre and email to empty string', () => {
      const organizador = new Organizador();
      expect(organizador.nombre).toBe('');
      expect(organizador.email).toBe('');
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid organizador', () => {
      const organizador = new Organizador({ nombre: 'Org Eventos', email: 'org@example.com' });
      const resultado = organizador.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when nombre is missing', () => {
      const organizador = new Organizador({ email: 'org@example.com' });
      const resultado = organizador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El nombre del organizador es obligatorio.');
    });

    test('should return error when nombre is empty string', () => {
      const organizador = new Organizador({ nombre: '', email: 'org@example.com' });
      const resultado = organizador.validar();
      expect(resultado.valido).toBe(false);
    });

    test('should return error when email is missing', () => {
      const organizador = new Organizador({ nombre: 'Org Eventos' });
      const resultado = organizador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El email del organizador es obligatorio.');
    });

    test('should return error when email has invalid format', () => {
      const organizador = new Organizador({ nombre: 'Org Eventos', email: 'invalido' });
      const resultado = organizador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El email del organizador no tiene un formato válido.');
    });
  });

  describe('_emailValido', () => {
    test('should return true for valid email formats', () => {
      const organizador = new Organizador();
      expect(organizador._emailValido('contacto@eventos.com')).toBe(true);
    });

    test('should return false for invalid email formats', () => {
      const organizador = new Organizador();
      expect(organizador._emailValido('noemail')).toBe(false);
      expect(organizador._emailValido('')).toBe(false);
    });
  });

  describe('actualizar', () => {
    test('should update nombre and email when provided', () => {
      const organizador = new Organizador({ id: 1, nombre: 'Org', email: 'org@test.com' });
      organizador.actualizar({ nombre: 'Org Modificado', email: 'nuevo@test.com' });
      expect(organizador.nombre).toBe('Org Modificado');
      expect(organizador.email).toBe('nuevo@test.com');
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const organizador = new Organizador({ id: 1, nombre: 'Org Eventos', email: 'org@example.com' });
      const json = organizador.toJSON();
      expect(json).toEqual({
        id: 1,
        nombre: 'Org Eventos',
        email: 'org@example.com',
        fechaCreacion: organizador.fechaCreacion,
        fechaActualizacion: organizador.fechaActualizacion
      });
    });
  });
});