import { Entidad } from './Entidad.js';
import { EstadoCompra } from './value-objects/EstadoCompra.js';

/**
 * Entidad CambioEstadoCompra.
 * Representa una transición en el ciclo de vida de una compra (trazabilidad y seguimiento).
 * Requerido explícitamente en el diagrama conceptual del enunciado.
 */
export class CambioEstadoCompra extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number|Object} data.compra - Instancia o ID de la compra asociada
   * @param {string} data.estado - Estado al cual transiciona la compra
   * @param {string|number|Object} [data.quien] - Instancia o ID del usuario que realizó la acción
   * @param {string|Date} [data.fechaHora] - Momento en que ocurrió el cambio (por defecto ahora)
   * @param {string|number} [data.id] - Identificador único
   */
  constructor(data = {}) {
    super(data);
    this.compra = data.compra || null;
    this.compraId = (typeof data.compra === 'object' && data.compra !== null) ? data.compra.id : (data.compraId || data.compra || null);
    this.estado = data.estado || null;
    this.quien = data.quien || null;
    this.quienId = (typeof data.quien === 'object' && data.quien !== null) ? data.quien.id : (data.quienId || data.quien || null);
    this.fechaHora = data.fechaHora ? new Date(data.fechaHora) : new Date();
  }

  /**
   * Valida los datos del cambio de estado.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.compraId) {
      errores.push('El cambio de estado debe pertenecer a una compra.');
    }

    if (!this.estado || !EstadoCompra.esValido(this.estado)) {
      errores.push('El estado registrado no es válido.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      estado: this.estado,
      quienId: this.quienId,
      fechaHora: this.fechaHora ? this.fechaHora.toISOString() : null,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
