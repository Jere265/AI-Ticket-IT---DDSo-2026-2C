import { Comprador } from '../../src/models/Comprador.js';

describe('Comprador', () => {
  describe('constructor', () => {
    test('should create a comprador with nombre and email', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan Perez', email: 'juan@example.com' });
      expect(comprador.id).toBe(1);
      expect(comprador.nombre).toBe('Juan Perez');
      expect(comprador.email).toBe('juan@example.com');
    });

    test('should default nombre and email to empty string', () => {
      const comprador = new Comprador();
      expect(comprador.nombre).toBe('');
      expect(comprador.email).toBe('');
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid comprador', () => {
      const comprador = new Comprador({ nombre: 'Juan Perez', email: 'juan@example.com' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return error when nombre is missing', () => {
      const comprador = new Comprador({ email: 'juan@example.com' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El nombre del comprador es obligatorio.');
    });

    test('should return error when nombre is empty string', () => {
      const comprador = new Comprador({ nombre: '', email: 'juan@example.com' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El nombre del comprador es obligatorio.');
    });

    test('should return error when nombre is only whitespace', () => {
      const comprador = new Comprador({ nombre: '   ', email: 'juan@example.com' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El nombre del comprador es obligatorio.');
    });

    test('should return error when email is missing', () => {
      const comprador = new Comprador({ nombre: 'Juan Perez' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El email del comprador es obligatorio.');
    });

    test('should return error when email is empty string', () => {
      const comprador = new Comprador({ nombre: 'Juan Perez', email: '' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El email del comprador es obligatorio.');
    });

    test('should return error when email has invalid format', () => {
      const comprador = new Comprador({ nombre: 'Juan Perez', email: 'no-es-un-email' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El email del comprador no tiene un formato válido.');
    });

    test('should return error when email is missing domain', () => {
      const comprador = new Comprador({ nombre: 'Juan Perez', email: 'juan@' });
      const resultado = comprador.validar();
      expect(resultado.valido).toBe(false);
    });
  });

  describe('_emailValido', () => {
    test('should return true for valid email formats', () => {
      const comprador = new Comprador();
      expect(comprador._emailValido('usuario@dominio.com')).toBe(true);
      expect(comprador._emailValido('a@b.c')).toBe(true);
    });

    test('should return false for invalid email formats', () => {
      const comprador = new Comprador();
      expect(comprador._emailValido('')).toBe(false);
      expect(comprador._emailValido('sinarroba')).toBe(false);
      expect(comprador._emailValido('sin@dominio')).toBe(false);
      expect(comprador._emailValido('@dominio.com')).toBe(false);
    });
  });

  describe('actualizar', () => {
    test('should update nombre and email when provided', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan', email: 'juan@test.com' });
      comprador.actualizar({ nombre: 'Juan Modificado', email: 'modificado@test.com' });
      expect(comprador.nombre).toBe('Juan Modificado');
      expect(comprador.email).toBe('modificado@test.com');
    });

    test('should update only nombre when email is not provided', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan', email: 'juan@test.com' });
      comprador.actualizar({ nombre: 'Juan Modificado' });
      expect(comprador.nombre).toBe('Juan Modificado');
      expect(comprador.email).toBe('juan@test.com');
    });

    test('should update fechaActualizacion when called', () => {
      const comprador = new Comprador({ id: 1 });
      const fechaAntes = comprador.fechaActualizacion;
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        comprador.actualizar({ nombre: 'Nuevo' });
        expect(comprador.fechaActualizacion.getTime()).toBeGreaterThan(fechaAntes.getTime());
      });
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const comprador = new Comprador({ id: 1, nombre: 'Juan Perez', email: 'juan@example.com' });
      const json = comprador.toJSON();
      expect(json).toEqual({
        id: 1,
        nombre: 'Juan Perez',
        email: 'juan@example.com',
        fechaCreacion: comprador.fechaCreacion,
        fechaActualizacion: comprador.fechaActualizacion
      });
    });
  });
});