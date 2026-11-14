/**
 * DTO de respuesta para Evento.
 * Separa la representación interna de la entidad del contrato de API.
 */
export class EventoDTO {
  /**
   * @param {Object} evento - Entidad Evento
   * @param {Object[]} [tiposEntrada] - Tipos de entrada asociados (opcional)
   */
  constructor(evento, tiposEntrada = []) {
    this.id = evento.id;
    this.titulo = evento.titulo;
    this.descripcion = evento.descripcion;
    this.categoria = evento.categoria;
    this.fechaEvento = evento.fechaEvento;
    this.imagen = evento.imagen;
    this.organizadorId = evento.organizadorId;
    this.diasRestantes = evento.calcularDiasRestantes();
    this.tiposEntrada = tiposEntrada;
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      fechaEvento: this.fechaEvento,
      imagen: this.imagen,
      organizadorId: this.organizadorId,
      diasRestantes: this.diasRestantes,
      tiposEntrada: this.tiposEntrada
    };
  }
}

