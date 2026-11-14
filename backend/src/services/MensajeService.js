import { Mensaje } from '../models/Mensaje.js';
import { MensajeRepository } from '../repositories/MensajeRepository.js';
import { CompraRepository } from '../repositories/CompraRepository.js';

/**
 * Servicio de Mensajes.
 * Casos de uso: envío y consulta de mensajes en el chat de una compra.
 * Reglas de negocio: BR-08, BR-09.
 */
export class MensajeService {
  constructor(mensajeRepo = null, compraRepo = null) {
    this._mensajeRepositorio = mensajeRepo || new MensajeRepository();
    this._compraRepositorio = compraRepo || new CompraRepository();
  }

  /**
   * Envía un mensaje asociado a una compra.
   * Regla de negocio BR-08: Todo mensaje debe estar vinculado a una compra existente.
   * Regla de negocio BR-09: Los mensajes se almacenan en orden cronológico.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, mensaje?: Mensaje, errores?: string[] }
   */
  enviarMensaje(datos) {
    const compra = this._compraRepositorio.buscarPorId(datos.compraId);

    if (!compra) {
      return {
        exito: false,
        errores: ['No se puede enviar un mensaje: la compra asociada no existe.']
      };
    }

    const mensaje = new Mensaje(datos);
    const validacion = mensaje.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const guardado = this._mensajeRepositorio.guardar(mensaje);
    return { exito: true, mensaje: guardado };
  }

  /**
   * Obtiene los mensajes de una compra ordenados cronológicamente.
   * @param {number|string} compraId
   * @returns {Mensaje[]}
   */
  obtenerMensajesDeCompra(compraId) {
    return this._mensajeRepositorio.buscarPorCompra(compraId);
  }
}

