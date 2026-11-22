import { Entidad } from './Entidad.js';

/**
 * Entidad Resena (o Resenia según diagrama).
 * Representa la valoración realizada por un comprador sobre un evento.
 * Según el modelo conceptual del enunciado y reglas BR-13, BR-14 y BR-15.
 */
export class Resena extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.compraId - ID de la compra asociada
   * @param {string|number|Object} [data.evento] - Evento valorado
   * @param {string|number} [data.eventoId] - ID del evento valorado
   * @param {string|number|Object} [data.comprador] - Usuario comprador que califica
   * @param {string|number} [data.compradorId] - ID del comprador
   * @param {number} [data.puntuacion] - Puntuación numérica (diagrama tentativo)
   * @param {number} [data.puntaje] - Puntaje numérico (alias de puntuación)
   * @param {string} [data.detalle] - Detalle escrito (diagrama tentativo)
   * @param {string} [data.comentario] - Comentario escrito (alias de detalle)
   * @param {string|Date} [data.fecha] - Fecha de la reseña
   * @param {string|number} [data.id] - Identificador único
   */
  constructor(data = {}) {
    super(data);
    this.compraId = data.compraId || null;

    this.evento = (typeof data.evento === 'object' && data.evento !== null) ? data.evento : null;
    this.eventoId = data.eventoId || (this.evento ? this.evento.id : (typeof data.evento === 'string' || typeof data.evento === 'number' ? data.evento : null));

    this.comprador = (typeof data.comprador === 'object' && data.comprador !== null) ? data.comprador : null;
    this.compradorId = data.compradorId || (this.comprador ? this.comprador.id : (typeof data.comprador === 'string' || typeof data.comprador === 'number' ? data.comprador : null));

    this._puntaje = data.puntuacion !== undefined ? Number(data.puntuacion) : (data.puntaje !== undefined ? Number(data.puntaje) : 0);
    this._comentario = data.detalle !== undefined ? data.detalle : (data.comentario || '');
    this.fecha = data.fecha ? new Date(data.fecha) : new Date();
  }

  get puntuacion() {
    return this._puntaje;
  }
  set puntuacion(val) {
    this._puntaje = Number(val) || 0;
  }

  get puntaje() {
    return this._puntaje;
  }
  set puntaje(val) {
    this._puntaje = Number(val) || 0;
  }

  get detalle() {
    return this._comentario;
  }
  set detalle(val) {
    this._comentario = val || '';
  }

  get comentario() {
    return this._comentario;
  }
  set comentario(val) {
    this._comentario = val || '';
  }

  /**
   * Valida que los datos de la reseña sean correctos.
   * Reglas de negocio BR-13, BR-14.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.compraId) {
      errores.push('La resena debe estar asociada a una compra.');
    }

    if (!this.eventoId) {
      errores.push('La resena debe estar asociada a un evento.');
    }

    if (!this.compradorId) {
      errores.push('La resena debe tener un comprador asignado.');
    }

    if (!this._puntaje || this._puntaje < 1 || this._puntaje > 5) {
      errores.push('El puntaje debe ser un número entre 1 y 5.');
    }

    if (!this._comentario || this._comentario.trim().length === 0) {
      errores.push('El comentario de la resena es obligatorio.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Actualiza el puntaje y comentario de la reseña.
   * @param {number} puntaje
   * @param {string} comentario
   * @returns {Object} { exito: boolean, error?: string }
   */
  actualizar(puntaje, comentario) {
    if (!puntaje || puntaje < 1 || puntaje > 5) {
      return {
        exito: false,
        error: 'El puntaje debe estar entre 1 y 5.'
      };
    }

    if (!comentario || comentario.trim().length === 0) {
      return {
        exito: false,
        error: 'El comentario no puede estar vacío.'
      };
    }

    this._puntaje = puntaje;
    this._comentario = comentario;
    this.tocar();
    return { exito: true };
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      eventoId: this.eventoId,
      compradorId: this.compradorId,
      puntaje: this.puntaje,
      puntuacion: this.puntuacion,
      comentario: this.comentario,
      detalle: this.detalle,
      fecha: this.fecha.toISOString(),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}

// Exportamos también el alias con la ortografía del diagrama
export const Resenia = Resena;
