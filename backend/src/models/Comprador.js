import { Usuario } from './Usuario.js';

/**
 * Entidad Comprador.
 * Representa al usuario que navega eventos y adquiere entradas.
 * Extiende de Usuario según el modelo conceptual (Usuario con rol de comprador).
 * Reglas de negocio asociadas: BR-04 (compra de entradas), BR-06 (visualización de compras).
 */
export class Comprador extends Usuario {
  /**
   * @param {Object} data
   * @param {string} data.nombre - Nombre del comprador
   * @param {string} [data.apellido] - Apellido del comprador
   * @param {string} data.email - Correo electrónico del comprador
   * @param {Array} [data.favoritos] - Eventos favoritos
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
  }

  /**
   * Valida que los datos del comprador sean correctos.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre del comprador es obligatorio.');
    }

    if (!this.email || this.email.trim().length === 0) {
      errores.push('El email del comprador es obligatorio.');
    } else if (!this._emailValido(this.email)) {
      errores.push('El email del comprador no tiene un formato válido.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  toJSON() {
    const json = {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
    if (this.apellido) json.apellido = this.apellido;
    if (this.favoritos && this.favoritos.length > 0) {
      json.favoritos = this.favoritos.map(f => (typeof f === 'object' && f !== null ? f.id || f : f));
    }
    return json;
  }
}
