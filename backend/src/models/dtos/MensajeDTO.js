/**
 * DTO de respuesta para Mensaje.
 */
export class MensajeDTO {
  /**
   * @param {Object} mensaje - Entidad Mensaje
   */
  constructor(mensaje) {
    this.id = mensaje.id;
    this.compraId = mensaje.compraId;
    this.contenido = mensaje.contenido;
    this.remitente = mensaje.remitente;
    this.fechaHora = mensaje.fechaHora;
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      contenido: this.contenido,
      remitente: this.remitente,
      fechaHora: this.fechaHora
    };
  }
}

