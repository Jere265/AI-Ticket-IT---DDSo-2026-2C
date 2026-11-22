import { MensajeService } from '../../src/services/MensajeService.js';
import { Mensaje } from '../../src/models/Mensaje.js';

describe('MensajeService', () => {
  let mockMensajeRepo;
  let mockCompraRepo;
  let service;
  let mensajeGuardarCalls;

  beforeEach(() => {
    mensajeGuardarCalls = 0;
    mockMensajeRepo = {
      guardar: (m) => { m.id = 1; mensajeGuardarCalls++; return m; },
      buscarPorCompra: () => []
    };
    mockCompraRepo = {
      buscarPorId: () => null
    };
    service = new MensajeService(mockMensajeRepo, mockCompraRepo);
  });

  describe('enviarMensaje', () => {
    test('should send message successfully', () => {
      mockCompraRepo.buscarPorId = () => ({ id: 1 });
      mockMensajeRepo.guardar = (m) => { m.id = 1; mensajeGuardarCalls++; return new Mensaje({ id: 1, compraId: 1, contenido: 'Hola', remitente: 'comprador' }); };

      const resultado = service.enviarMensaje({ compraId: 1, contenido: 'Hola', remitente: 'comprador' });

      expect(resultado.exito).toBe(true);
      expect(resultado.mensaje).toBeInstanceOf(Mensaje);
      expect(mensajeGuardarCalls).toBe(1);
    });

    test('should return error when compra does not exist', () => {
      const resultado = service.enviarMensaje({ compraId: 999, contenido: 'Hola', remitente: 'comprador' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores[0]).toContain('la compra asociada no existe.');
    });

    test('should return validation error when contenido is empty', () => {
      mockCompraRepo.buscarPorId = () => ({ id: 1 });

      const resultado = service.enviarMensaje({ compraId: 1, contenido: '', remitente: 'comprador' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('El contenido del mensaje no puede estar vacío.');
    });

    test('should return validation error when remitente is invalid', () => {
      mockCompraRepo.buscarPorId = () => ({ id: 1 });

      const resultado = service.enviarMensaje({ compraId: 1, contenido: 'Hola', remitente: 'admin' });

      expect(resultado.exito).toBe(false);
      expect(resultado.errores[0]).toContain('El remitente debe ser');
    });
  });

  describe('obtenerMensajesDeCompra', () => {
    test('should return messages for compra', () => {
      const mensajes = [new Mensaje({ id: 1, compraId: 1, contenido: 'Hola', remitente: 'comprador' })];
      mockMensajeRepo.buscarPorCompra = () => mensajes;
      expect(service.obtenerMensajesDeCompra(1)).toEqual(mensajes);
    });
  });
});