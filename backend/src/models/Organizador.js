import { Entidad } from './Entidad.js';

/**
 * Entidad Organizador.
 * Representa a una persona o entidad responsable de publicar y administrar eventos.
 * Reglas de negocio asociadas: BR-01 (creación de eventos).
 */
export class Organizador extends Entidad {
  /**
   * @param {Object} data
   * @param {string} data.nombre - Nombre del organizador
   * @param {string} data.email - Correo electrónico del organizador
   * @param {string|number} [data.id] - Identificador único (opcional, se asigna al persistir)
   */
  constructor(data = {}) {
    super(data);
    this.nombre = data.nombre || '';
    this.email = data.email || '';
  }

  /**
   * Valida que los datos del organizador sean correctos.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre del organizador es obligatorio.');
    }

    if (!this.email || this.email.trim().length === 0) {
      errores.push('El email del organizador es obligatorio.');
    } else if (!this._emailValido(this.email)) {
      errores.push('El email del organizador no tiene un formato válido.');
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
   * Actualiza los datos del organizador.
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

