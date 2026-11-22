import { Entidad } from './Entidad.js';

/**
 * Entidad Usuario.
 * Representa un usuario del sistema (diagrama tentativo de arquitectura).
 * Puede actuar como Comprador u Organizador.
 * Posee atributos de perfil y lista de eventos favoritos.
 */
export class Usuario extends Entidad {
  /**
   * @param {Object} data
   * @param {string} [data.nombre] - Nombre del usuario
   * @param {string} [data.apellido] - Apellido del usuario
   * @param {string} [data.email] - Correo electrónico
   * @param {Array<string|number|Object>} [data.favoritos] - Lista de eventos favoritos
   * @param {string|number} [data.id] - Identificador único
   */
  constructor(data = {}) {
    super(data);
    this.nombre = data.nombre || '';
    this.apellido = data.apellido || '';
    this.email = data.email || '';
    this.favoritos = Array.isArray(data.favoritos) ? [...data.favoritos] : [];
  }

  /**
   * Valida que los datos del usuario sean correctos.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre del usuario es obligatorio.');
    }

    if (!this.email || this.email.trim().length === 0) {
      errores.push('El email del usuario es obligatorio.');
    } else if (!this._emailValido(this.email)) {
      errores.push('El email del usuario no tiene un formato válido.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Agrega un evento a la lista de favoritos si no está ya presente.
   * @param {string|number|Object} evento - ID o instancia del evento
   * @returns {boolean} true si se agregó, false si ya estaba
   */
  agregarFavorito(evento) {
    if (!evento) return false;
    const eventoId = typeof evento === 'object' && evento !== null ? evento.id : evento;
    if (this.esFavorito(eventoId)) return false;
    this.favoritos.push(evento);
    this.tocar();
    return true;
  }

  /**
   * Remueve un evento de la lista de favoritos.
   * @param {string|number|Object} evento - ID o instancia del evento
   * @returns {boolean} true si se removió, false si no estaba
   */
  removerFavorito(evento) {
    if (!evento) return false;
    const eventoId = typeof evento === 'object' && evento !== null ? evento.id : evento;
    const index = this.favoritos.findIndex(f => {
      const id = typeof f === 'object' && f !== null ? f.id : f;
      return id === eventoId;
    });

    if (index === -1) return false;
    this.favoritos.splice(index, 1);
    this.tocar();
    return true;
  }

  /**
   * Indica si un evento se encuentra en la lista de favoritos.
   * @param {string|number|Object} evento - ID o instancia del evento
   * @returns {boolean}
   */
  esFavorito(evento) {
    if (!evento) return false;
    const eventoId = typeof evento === 'object' && evento !== null ? evento.id : evento;
    return this.favoritos.some(f => {
      const id = typeof f === 'object' && f !== null ? f.id : f;
      return id === eventoId;
    });
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
   * Actualiza los datos del usuario.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.apellido !== undefined) this.apellido = datos.apellido;
    if (datos.email !== undefined) this.email = datos.email;
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      favoritos: this.favoritos.map(f => (typeof f === 'object' && f !== null ? f.id || f : f)),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
