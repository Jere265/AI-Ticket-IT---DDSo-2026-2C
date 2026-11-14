/**
 * DTO de respuesta para Compra.
 */
export class CompraDTO {
  /**
   * @param {Object} compra - Entidad Compra
   * @param {Object} [evento] - Evento asociado (opcional, para calcular días restantes)
   */
  constructor(compra, evento = null) {
    this.id = compra.id;
    this.eventoId = compra.eventoId;
    this.tipoEntradaId = compra.tipoEntradaId;
    this.cantidadEntradas = compra.cantidadEntradas;
    this.estado = compra.estado;
    this.fechaCompra = compra.fechaCompra;
    this.diasRestantes = evento
      ? compra.calcularDiasRestantes(evento.fechaEvento)
      : null;
  }

  toJSON() {
    return {
      id: this.id,
      eventoId: this.eventoId,
      tipoEntradaId: this.tipoEntradaId,
      cantidadEntradas: this.cantidadEntradas,
      estado: this.estado,
      fechaCompra: this.fechaCompra,
      diasRestantes: this.diasRestantes
    };
  }
}

