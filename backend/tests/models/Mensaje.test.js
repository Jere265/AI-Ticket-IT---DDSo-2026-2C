import { Mensaje } from '../../src/models/Mensaje.js';

describe('Mensaje', () => {
  describe('constructor', () => {
    test('should create a mensaje with all properties', () => {
      const mensaje = new Mensaje({
        id: 1,
        compraId: 10,
        contenido: 'Hola, ¿cómo están las entradas?',
        remitente: 'comprador',
        fechaHora: '2025-06-15T10:00:00Z'
      });
      expect(mensaje.id).toBe(1);
      expect(mensaje.compraId).toBe(10);
      expect(mensaje.contenido).toBe('Hola, ¿cómo están las entradas?');
      expect(mensaje.remitente).toBe('comprador');
      expect(mensaje.fechaHora instanceof Date).toBe(true);
    });

    test('should default string properties to empty string', () => {
      const mensaje = new Mensaje();
      expect(mensaje.compraId).toBeNull();
      expect(mensaje.contenido).toBe('');
      expect(mensaje.remitente).toBe('');
    });

    test('should default fechaHora to current date', () => {
      const mensaje = new Mensaje();
      expect(mensaje.fechaHora instanceof Date).toBe(true);
    });
  });

  describe('validar', () => {
    test('should return valido: true for a valid mensaje', () => {
      const mensaje = new Mensaje({ compraId: 1, contenido: 'Hola', remitente: 'comprador' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('should return valido: true for remitente organizador', () => {
      const mensaje = new Mensaje({ compraId: 1, contenido: 'Hola', remitente: 'organizador' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(true);
    });

    test('should return error when compraId is missing', () => {
      const mensaje = new Mensaje({ contenido: 'Hola', remitente: 'comprador' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El mensaje debe estar asociado a una compra existente.');
    });

    test('should return error when contenido is empty', () => {
      const mensaje = new Mensaje({ compraId: 1, contenido: '', remitente: 'comprador' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El contenido del mensaje no puede estar vacío.');
    });

    test('should return error when remitente is invalid', () => {
      const mensaje = new Mensaje({ compraId: 1, contenido: 'Hola', remitente: 'admin' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('El remitente debe ser "comprador" o "organizador".');
    });

    test('should return error when remitente is missing', () => {
      const mensaje = new Mensaje({ compraId: 1, contenido: 'Hola' });
      const resultado = mensaje.validar();
      expect(resultado.valido).toBe(false);
    });
  });

  describe('editar', () => {
    test('should update contenido with valid content', () => {
      const mensaje = new Mensaje({ id: 1, contenido: 'Viejo' });
      const resultado = mensaje.editar('Nuevo contenido');
      expect(resultado.exito).toBe(true);
      expect(mensaje.contenido).toBe('Nuevo contenido');
    });

    test('should return error when contenido is empty', () => {
      const mensaje = new Mensaje({ id: 1, contenido: 'Viejo' });
      const resultado = mensaje.editar('');
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBe('El contenido no puede estar vacío.');
    });

    test('should return error when contenido is only whitespace', () => {
      const mensaje = new Mensaje({ id: 1, contenido: 'Viejo' });
      const resultado = mensaje.editar('   ');
      expect(resultado.exito).toBe(false);
    });
  });

  describe('toJSON', () => {
    test('should return a plain object with all properties', () => {
      const fecha = new Date('2025-06-15T10:00:00Z');
      const mensaje = new Mensaje({
        id: 1,
        compraId: 10,
        contenido: 'Hola',
        remitente: 'comprador',
        fechaHora: fecha
      });
      const json = mensaje.toJSON();
      expect(json.id).toBe(1);
      expect(json.compraId).toBe(10);
      expect(json.contenido).toBe('Hola');
      expect(json.remitente).toBe('comprador');
      expect(json.fechaHora).toBe(fecha.toISOString());
    });
  });
});