/**
 * Clase base para todas las entidades del dominio.
 * Proporciona un identificador único y metadatos de auditoría comunes.
 */
export class Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.id - Identificador único de la entidad
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();
  }

  /**
   * Actualiza la fecha de modificación de la entidad.
   */
  tocar() {
    this.fechaActualizacion = new Date();
  }

  /**
   * Indica si la entidad tiene un identificador asignado (está persistida).
   * @returns {boolean}
   */
  estaPersistida() {
    return this.id !== null && this.id !== undefined;
  }
}

