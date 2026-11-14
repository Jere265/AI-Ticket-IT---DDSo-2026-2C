/**
 * DTO de respuesta para Resena.
 */
export class ResenaDTO {
  /**
   * @param {Object} resena - Entidad Resena
   */
  constructor(resena) {
    this.id = resena.id;
    this.compraId = resena.compraId;
    this.eventoId = resena.eventoId;
    this.compradorId = resena.compradorId;
    this.puntaje = resena.puntaje;
    this.comentario = resena.comentario;
    this.fecha = resena.fecha;
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      eventoId: this.eventoId,
      compradorId: this.compradorId,
      puntaje: this.puntaje,
      comentario: this.comentario,
      fecha: this.fecha
    };
  }
}


