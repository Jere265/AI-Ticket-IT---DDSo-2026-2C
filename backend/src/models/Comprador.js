import { Entidad } from './Entidad.js';

/**
 * Entidad Comprador.
 * Representa al usuario que navega eventos y adquiere entradas.
 * Reglas de negocio asociadas: BR-04 (compra de entradas), BR-06 (visualización de compras).
 */
export class Comprador extends Entidad {
  /**
   * @param {Object} data
   * @param {string} data.nombre - Nombre del comprador
   * @param {string} data.email - Correo electrónico del comprador
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.nombre = data.nombre || '';
    this.email = data.email || '';
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

  /**
   * Valida formato básico de email.
   * @private
   */
  _emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Actualiza los datos del comprador.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.email !== undefined) this.email = datos.email;
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}

