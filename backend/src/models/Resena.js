import { Entidad } from './Entidad.js';

/**
 * Entidad Resena.
 * Representa la valoración realizada por un comprador sobre un evento.
 * Reglas de negocio asociadas: BR-13 (generación), BR-14 (contenido), BR-15 (visualización).
 */
export class Resena extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.compraId - ID de la compra asociada
   * @param {string|number} data.eventoId - ID del evento valorado
   * @param {string|number} data.compradorId - ID del comprador que califica
   * @param {number} data.puntaje - Puntaje numérico (1-5)
   * @param {string} data.comentario - Comentario escrito
   * @param {string|Date} [data.fecha] - Fecha de la resena (por defecto ahora)
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.compraId = data.compraId || null;
    this.eventoId = data.eventoId || null;
    this.compradorId = data.compradorId || null;
    this.puntaje = data.puntaje || 0;
    this.comentario = data.comentario || '';
    this.fecha = data.fecha ? new Date(data.fecha) : new Date();
  }

  /**
   * Valida que los datos de la resena sean correctos.
   * Regla de negocio BR-13: Solo puede emitirse una resena si la compra está UTILIZADA.
   * Regla de negocio BR-14: Toda resena debe contener puntaje y comentario.
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

    if (!this.puntaje || this.puntaje < 1 || this.puntaje > 5) {
      errores.push('El puntaje debe ser un número entre 1 y 5.');
    }

    if (!this.comentario || this.comentario.trim().length === 0) {
      errores.push('El comentario de la resena es obligatorio.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Actualiza el puntaje y comentario de la resena.
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

    this.puntaje = puntaje;
    this.comentario = comentario;
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
      comentario: this.comentario,
      fecha: this.fecha.toISOString(),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}


