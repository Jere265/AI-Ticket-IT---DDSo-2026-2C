import { Entidad } from './Entidad.js';
import { EstadoCompra } from './value-objects/EstadoCompra.js';

/**
 * Entidad Compra.
 * Representa la adquisición de entradas por parte de un comprador.
 * Reglas de negocio asociadas: BR-04 (compra), BR-05 (estados), BR-10 (cancelación),
 * BR-11 (reembolso), BR-12 (utilización), BR-13 (resenas).
 */
export class Compra extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.compradorId - ID del comprador
   * @param {string|number} data.eventoId - ID del evento
   * @param {string|number} data.tipoEntradaId - ID del tipo de entrada
   * @param {number} data.cantidadEntradas - Cantidad de entradas compradas
   * @param {string} [data.estado] - Estado de la compra (por defecto PENDIENTE_PAGO)
   * @param {string|Date} [data.fechaCompra] - Fecha de la compra (por defecto ahora)
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.compradorId = data.compradorId || null;
    this.eventoId = data.eventoId || null;
    this.tipoEntradaId = data.tipoEntradaId || null;
    this.cantidadEntradas = data.cantidadEntradas || 0;
    this.estado = data.estado || EstadoCompra.PENDIENTE_PAGO;
    this.fechaCompra = data.fechaCompra ? new Date(data.fechaCompra) : new Date();
  }

  /**
   * Valida que los datos de la compra sean correctos.
   * Regla de negocio BR-04: La cantidad solicitada no puede superar el cupo disponible.
   * Regla de negocio BR-05: Toda compra debe tener un estado válido.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.compradorId) {
      errores.push('La compra debe pertenecer a un comprador.');
    }

    if (!this.eventoId) {
      errores.push('La compra debe pertenecer a un evento.');
    }

    if (!this.tipoEntradaId) {
      errores.push('La compra debe corresponder a un tipo de entrada.');
    }

    if (!this.cantidadEntradas || this.cantidadEntradas < 1) {
      errores.push('La cantidad de entradas debe ser mayor a cero.');
    }

    if (!EstadoCompra.esValido(this.estado)) {
      errores.push('El estado de la compra no es válido.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Confirma la compra (cambia de PENDIENTE_PAGO a CONFIRMADA).
   * Regla de negocio BR-03: La disponibilidad disminuye cuando se confirma una compra.
   * @returns {Object} { exito: boolean, error?: string }
   */
  confirmar() {
    if (this.estado !== EstadoCompra.PENDIENTE_PAGO) {
      return {
        exito: false,
        error: 'Solo se pueden confirmar compras en estado PENDIENTE_PAGO.'
      };
    }

    this.estado = EstadoCompra.CONFIRMADA;
    this.tocar();
    return { exito: true };
  }

  /**
   * Cancela la compra y procesa el reembolso.
   * Regla de negocio BR-10: Solo se puede cancelar si el evento no ocurrió y no está UTILIZADA.
   * Regla de negocio BR-11: Toda cancelación válida genera un reembolso y restituye cupos.
   * @param {boolean} eventoYaOcurrio - Indica si el evento asociado ya ocurrió
   * @returns {Object} { exito: boolean, error?: string }
   */
  cancelar(eventoYaOcurrio = false) {
    if (this.estado === EstadoCompra.UTILIZADA) {
      return {
        exito: false,
        error: 'No se puede cancelar una compra ya utilizada.'
      };
    }

    if (eventoYaOcurrio) {
      return {
        exito: false,
        error: 'No se puede cancelar una compra para un evento que ya ocurrió.'
      };
    }

    if (this.estado === EstadoCompra.CANCELADA || this.estado === EstadoCompra.REEMBOLSADA) {
      return {
        exito: false,
        error: 'La compra ya se encuentra cancelada o reembolsada.'
      };
    }

    this.estado = EstadoCompra.REEMBOLSADA;
    this.tocar();
    return { exito: true };
  }

  /**
   * Marca la compra como utilizada (el asistente participó del evento).
   * Regla de negocio BR-12: Una compra confirmada puede pasar a estado UTILIZADA.
   * @returns {Object} { exito: boolean, error?: string }
   */
  marcarComoUtilizada() {
    if (this.estado !== EstadoCompra.CONFIRMADA) {
      return {
        exito: false,
        error: 'Solo se puede utilizar una compra en estado CONFIRMADA.'
      };
    }

    this.estado = EstadoCompra.UTILIZADA;
    this.tocar();
    return { exito: true };
  }

  /**
   * Indica si la compra es elegible para recibir una resena.
   * Regla de negocio BR-13: Solo puede emitirse una resena si la compra está UTILIZADA.
   * @returns {boolean}
   */
  esElegibleParaResena() {
    return this.estado === EstadoCompra.UTILIZADA;
  }

  /**
   * Calcula los días restantes hasta el evento (solo para compras confirmadas).
   * Regla de negocio BR-06.
   * @param {Date|null} fechaEvento - Fecha del evento asociado
   * @returns {number|null}
   */
  calcularDiasRestantes(fechaEvento) {
    if (this.estado !== EstadoCompra.CONFIRMADA) return null;
    if (!fechaEvento) return null;
    const eventoFecha = typeof fechaEvento === 'string' ? new Date(fechaEvento) : fechaEvento;
    const ahora = new Date();
    const diferenciaMs = eventoFecha - ahora;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Actualiza el estado de la compra.
   * @param {string} nuevoEstado
   * @returns {Object} { exito: boolean, error?: string }
   */
  cambiarEstado(nuevoEstado) {
    if (!EstadoCompra.esValido(nuevoEstado)) {
      return {
        exito: false,
        error: 'El estado proporcionado no es válido.'
      };
    }

    this.estado = nuevoEstado;
    this.tocar();
    return { exito: true };
  }

  toJSON() {
    return {
      id: this.id,
      compradorId: this.compradorId,
      eventoId: this.eventoId,
      tipoEntradaId: this.tipoEntradaId,
      cantidadEntradas: this.cantidadEntradas,
      estado: this.estado,
      fechaCompra: this.fechaCompra.toISOString(),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}


