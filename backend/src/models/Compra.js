import { Entidad } from './Entidad.js';
import { EstadoCompra } from './value-objects/EstadoCompra.js';
import { CambioEstadoCompra } from './CambioEstadoCompra.js';

/**
 * Entidad Compra.
 * Representa la adquisición de entradas por parte de un comprador.
 * Según el modelo conceptual del enunciado y reglas de negocio
 * BR-04, BR-05, BR-06, BR-10, BR-11, BR-12, BR-13.
 */
export class Compra extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number|Object} [data.comprador] - Usuario comprador o su ID
   * @param {string|number} [data.compradorId] - ID del comprador
   * @param {string|number|Object} [data.evento] - Evento o su ID
   * @param {string|number} [data.eventoId] - ID del evento
   * @param {string|number|Object} [data.tipoEntrada] - Tipo de entrada o su ID
   * @param {string|number} [data.tipoEntradaId] - ID del tipo de entrada
   * @param {number} [data.cantidad] - Cantidad de entradas compradas (diagrama)
   * @param {number} [data.cantidadEntradas] - Cantidad de entradas compradas (alias)
   * @param {number} [data.total] - Monto total de la compra (diagrama)
   * @param {string} [data.estado] - Estado de la compra (por defecto PENDIENTE_PAGO)
   * @param {string|Date} [data.fechaCompra] - Fecha de la compra (por defecto ahora)
   * @param {Array} [data.mensajes] - Mensajes del chat asociados a la compra
   * @param {Array} [data.historialEstados] - Historial de cambios de estado (CambioEstadoCompra)
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.comprador = (typeof data.comprador === 'object' && data.comprador !== null) ? data.comprador : null;
    this.compradorId = data.compradorId || (this.comprador ? this.comprador.id : (typeof data.comprador === 'string' || typeof data.comprador === 'number' ? data.comprador : null));

    this.evento = (typeof data.evento === 'object' && data.evento !== null) ? data.evento : null;
    this.eventoId = data.eventoId || (this.evento ? this.evento.id : (typeof data.evento === 'string' || typeof data.evento === 'number' ? data.evento : null));

    this.tipoEntrada = (typeof data.tipoEntrada === 'object' && data.tipoEntrada !== null) ? data.tipoEntrada : null;
    this.tipoEntradaId = data.tipoEntradaId || (this.tipoEntrada ? this.tipoEntrada.id : (typeof data.tipoEntrada === 'string' || typeof data.tipoEntrada === 'number' ? data.tipoEntrada : null));

    this._cantidad = data.cantidad !== undefined ? Number(data.cantidad) : (data.cantidadEntradas !== undefined ? Number(data.cantidadEntradas) : 0);
    this.total = data.total !== undefined ? Number(data.total) : 0;
    this.estado = data.estado || EstadoCompra.PENDIENTE_PAGO;
    this.fechaCompra = data.fechaCompra ? new Date(data.fechaCompra) : new Date();

    this.mensajes = Array.isArray(data.mensajes) ? [...data.mensajes] : [];
    this.historialEstados = Array.isArray(data.historialEstados) ? [...data.historialEstados] : [];
  }

  get cantidad() {
    return this._cantidad;
  }
  set cantidad(val) {
    this._cantidad = Number(val) || 0;
  }

  get cantidadEntradas() {
    return this._cantidad;
  }
  set cantidadEntradas(val) {
    this._cantidad = Number(val) || 0;
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

    if (!this.cantidad || this.cantidad < 1) {
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
   * Actualiza el estado de la compra registrando opcionalmente el cambio de estado.
   * Método del diagrama tentativo: actualizarEstado(EstadoCompra): void
   * @param {string} nuevoEstado
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, error?: string }
   */
  actualizarEstado(nuevoEstado, quien = null) {
    if (!EstadoCompra.esValido(nuevoEstado)) {
      return {
        exito: false,
        error: 'El estado proporcionado no es válido.'
      };
    }

    this.estado = nuevoEstado;
    if (this.id) {
      const cambio = new CambioEstadoCompra({
        compra: this,
        compraId: this.id,
        estado: nuevoEstado,
        quien: quien,
        fechaHora: new Date()
      });
      this.historialEstados.push(cambio);
    }
    this.tocar();
    return { exito: true };
  }

  /**
   * Alias de actualizarEstado para compatibilidad hacia atrás.
   * @param {string} nuevoEstado
   * @returns {Object}
   */
  cambiarEstado(nuevoEstado) {
    return this.actualizarEstado(nuevoEstado);
  }

  /**
   * Confirma la compra (cambia a CONFIRMADA).
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, error?: string }
   */
  confirmar(quien = null) {
    if (this.estado !== EstadoCompra.PENDIENTE_PAGO && this.estado !== EstadoCompra.PENDIENTE) {
      return {
        exito: false,
        error: 'Solo se pueden confirmar compras en estado PENDIENTE_PAGO.'
      };
    }

    return this.actualizarEstado(EstadoCompra.CONFIRMADA, quien);
  }

  /**
   * Cancela la compra y procesa el reembolso.
   * Regla de negocio BR-10: Solo se puede cancelar si el evento no ocurrió y no está UTILIZADA.
   * Regla de negocio BR-11: Toda cancelación válida genera un reembolso y restituye cupos.
   * @param {boolean} eventoYaOcurrio - Indica si el evento asociado ya ocurrió
   * @param {string|number|Object} [quien] - Usuario que solicita la cancelación
   * @returns {Object} { exito: boolean, error?: string }
   */
  cancelar(eventoYaOcurrio = false, quien = null) {
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

    return this.actualizarEstado(EstadoCompra.REEMBOLSADA, quien);
  }

  /**
   * Marca la compra como utilizada.
   * Regla de negocio BR-12.
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, error?: string }
   */
  marcarComoUtilizada(quien = null) {
    if (this.estado !== EstadoCompra.CONFIRMADA) {
      return {
        exito: false,
        error: 'Solo se puede utilizar una compra en estado CONFIRMADA.'
      };
    }

    return this.actualizarEstado(EstadoCompra.UTILIZADA, quien);
  }

  /**
   * Agrega un mensaje a la compra.
   * @param {Object} mensaje
   */
  agregarMensaje(mensaje) {
    if (mensaje) {
      this.mensajes.push(mensaje);
      this.tocar();
    }
  }

  /**
   * Indica si la compra es elegible para recibir una reseña.
   * Regla de negocio BR-13: Solo si la compra está UTILIZADA.
   * @returns {boolean}
   */
  esElegibleParaResena() {
    return this.estado === EstadoCompra.UTILIZADA;
  }

  /**
   * Calcula los días restantes hasta el evento (solo para compras confirmadas).
   * Regla de negocio BR-06.
   * @param {Date|null} fechaEvento
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

  toJSON() {
    return {
      id: this.id,
      compradorId: this.compradorId,
      eventoId: this.eventoId,
      tipoEntradaId: this.tipoEntradaId,
      cantidad: this.cantidad,
      cantidadEntradas: this.cantidadEntradas,
      total: this.total,
      estado: this.estado,
      fechaCompra: this.fechaCompra.toISOString(),
      mensajes: this.mensajes,
      historialEstados: this.historialEstados,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
