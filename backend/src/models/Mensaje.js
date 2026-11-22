import { Entidad } from './Entidad.js';

/**
 * Entidad Mensaje.
 * Representa una comunicación dentro del chat asociado a una compra.
 * Según el modelo conceptual del enunciado y reglas BR-08 y BR-09.
 */
export class Mensaje extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.compraId - ID de la compra asociada
   * @param {string} [data.mensaje] - Texto del mensaje (diagrama tentativo)
   * @param {string} [data.contenido] - Contenido del mensaje (alias de mensaje)
   * @param {string|number|Object} [data.usuario] - Usuario que envía el mensaje (diagrama)
   * @param {string} [data.remitente] - Rol o identificador del remitente ('comprador' u 'organizador')
   * @param {string|Date} [data.enviado] - Fecha y hora de envío (diagrama)
   * @param {string|Date} [data.fechaHora] - Fecha y hora del mensaje (alias)
   * @param {string|number} [data.id] - Identificador único
   */
  constructor(data = {}) {
    super(data);
    this.compraId = data.compraId || null;
    this._contenido = data.mensaje !== undefined ? data.mensaje : (data.contenido || '');

    // Usuario remitente
    this.usuario = (typeof data.usuario === 'object' && data.usuario !== null) ? data.usuario : null;
    this.usuarioId = data.usuarioId || (this.usuario ? this.usuario.id : (typeof data.usuario === 'string' || typeof data.usuario === 'number' ? data.usuario : null));
    this.remitente = data.remitente || (this.usuario ? (this.usuario.rol || 'comprador') : '');

    const fechaRaw = data.enviado !== undefined ? data.enviado : data.fechaHora;
    this._fechaHora = fechaRaw ? new Date(fechaRaw) : new Date();
  }

  get mensaje() {
    return this._contenido;
  }
  set mensaje(val) {
    this._contenido = val || '';
  }

  get contenido() {
    return this._contenido;
  }
  set contenido(val) {
    this._contenido = val || '';
  }

  get enviado() {
    return this._fechaHora;
  }
  set enviado(val) {
    this._fechaHora = val ? new Date(val) : new Date();
  }

  get fechaHora() {
    return this._fechaHora;
  }
  set fechaHora(val) {
    this._fechaHora = val ? new Date(val) : new Date();
  }

  /**
   * Valida que los datos del mensaje sean correctos.
   * Regla de negocio BR-09.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.compraId) {
      errores.push('El mensaje debe estar asociado a una compra existente.');
    }

    if (!this._contenido || this._contenido.trim().length === 0) {
      errores.push('El contenido del mensaje no puede estar vacío.');
    }

    const esRemitenteValido = this.remitente === 'comprador' || this.remitente === 'organizador' || Boolean(this.usuarioId);
    if (!esRemitenteValido) {
      errores.push('El remitente debe ser "comprador" o "organizador".');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Actualiza el contenido del mensaje.
   * @param {string} nuevoContenido
   * @returns {Object} { exito: boolean, error?: string }
   */
  editar(nuevoContenido) {
    if (!nuevoContenido || nuevoContenido.trim().length === 0) {
      return {
        exito: false,
        error: 'El contenido no puede estar vacío.'
      };
    }

    this._contenido = nuevoContenido;
    this.tocar();
    return { exito: true };
  }

  toJSON() {
    return {
      id: this.id,
      compraId: this.compraId,
      contenido: this.contenido,
      mensaje: this.mensaje,
      remitente: this.remitente,
      usuarioId: this.usuarioId,
      fechaHora: this.fechaHora.toISOString(),
      enviado: this.enviado.toISOString(),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
