import { Entidad } from './Entidad.js';

/**
 * Entidad Mensaje.
 * Representa una comunicación dentro del chat asociado a una compra.
 * Reglas de negocio asociadas: BR-08 (mensajería), BR-09 (envío de mensajes).
 */
export class Mensaje extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.compraId - ID de la compra asociada
   * @param {string} data.contenido - Contenido del mensaje
   * @param {string} data.remitente - Remitente del mensaje ('comprador' o 'organizador')
   * @param {string|Date} [data.fechaHora] - Fecha y hora del mensaje (por defecto ahora)
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.compraId = data.compraId || null;
    this.contenido = data.contenido || '';
    this.remitente = data.remitente || '';
    this.fechaHora = data.fechaHora ? new Date(data.fechaHora) : new Date();
  }

  /**
   * Valida que los datos del mensaje sean correctos.
   * Regla de negocio BR-09: Los mensajes deben tener contenido y remitente válido.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.compraId) {
      errores.push('El mensaje debe estar asociado a una compra existente.');
    }

    if (!this.contenido || this.contenido.trim().length === 0) {
      errores.push('El contenido del mensaje no puede estar vacío.');
    }

    if (!this.remitente || (this.remitente !== 'comprador' && this.remitente !== 'organizador')) {
      errores.push('El remitente debe ser "comprador" o "organizador".');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Actualiza el contenido del mensaje.
   * @param {string} nuevoContenido
   * @returns {Object} { exito: boolean, error?: string }
   */
  editar(nuevoContenido) {
    if (!nuevoContenido || nuevoContenido.trim().length === 0) {
      return {
        exito: false,
        error: 'El contenido no puede estar vacío.'
      };
    }

    this.contenido = nuevoContenido;
    this.tocar();
    return { exito: true };
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      contenido: this.contenido,
      remitente: this.remitente,
      fechaHora: this.fechaHora.toISOString(),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}

