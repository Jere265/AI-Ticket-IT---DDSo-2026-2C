import { Usuario } from './Usuario.js';

/**
 * Entidad Organizador.
 * Representa a una persona o entidad responsable de publicar y administrar eventos.
 * Extiende de Usuario según el modelo conceptual (Usuario con rol de organizador).
 * Reglas de negocio asociadas: BR-01 (creación de eventos).
 */
export class Organizador extends Usuario {
  /**
   * @param {Object} data
   * @param {string} data.nombre - Nombre del organizador
   * @param {string} [data.apellido] - Apellido del organizador
   * @param {string} data.email - Correo electrónico del organizador
   * @param {string|number} [data.id] - Identificador único (opcional, se asigna al persistir)
   */
  constructor(data = {}) {
    super(data);
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

  toJSON() {
    const json = {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
    if (this.apellido) json.apellido = this.apellido;
    return json;
  }
}
