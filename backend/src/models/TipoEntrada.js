import { Entidad } from './Entidad.js';

/**
 * Entidad TipoEntrada.
 * Representa una modalidad de acceso a un evento (ej. General, Platea, VIP).
 * Reglas de negocio asociadas: BR-02 (tipos de entrada), BR-03 (disponibilidad).
 */
export class TipoEntrada extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.eventoId - ID del evento al que pertenece
   * @param {string} data.nombre - Nombre del tipo de entrada
   * @param {number} data.precio - Precio por entrada
   * @param {number} data.cupoTotal - Cupo total de entradas disponibles
   * @param {number} [data.cupoDisponible] - Cupo disponible (por defecto igual a cupoTotal)
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.eventoId = data.eventoId || null;
    this.nombre = data.nombre || '';
    this.precio = data.precio || 0;
    this.cupoTotal = data.cupoTotal || 0;
    this.cupoDisponible = data.cupoDisponible !== undefined ? data.cupoDisponible : data.cupoTotal || 0;
  }

  /**
   * Valida que los datos del tipo de entrada sean correctos.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.eventoId) {
      errores.push('El tipo de entrada debe pertenecer a un evento.');
    }

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre del tipo de entrada es obligatorio.');
    }

    if (!this.precio || this.precio < 0) {
      errores.push('El precio debe ser un número mayor o igual a cero.');
    }

    if (!this.cupoTotal || this.cupoTotal < 1) {
      errores.push('El cupo total debe ser mayor a cero.');
    }

    if (this.cupoDisponible < 0) {
      errores.push('El cupo disponible no puede ser negativo.');
    }

    if (this.cupoDisponible > this.cupoTotal) {
      errores.push('El cupo disponible no puede superar el cupo total.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Verifica si hay cupo disponible para la cantidad solicitada.
   * Regla de negocio BR-03: La disponibilidad nunca puede ser negativa.
   * @param {number} cantidad - Cantidad de entradas solicitadas
   * @returns {boolean}
   */
  tieneDisponibilidad(cantidad) {
    return cantidad > 0 && this.cupoDisponible >= cantidad;
  }

  /**
   * Reserva entradas (disminuye el cupo disponible).
   * Regla de negocio BR-03: La disponibilidad disminuye cuando se confirma una compra.
   * @param {number} cantidad - Cantidad de entradas a reservar
   * @returns {Object} { exito: boolean, error?: string }
   */
  reservar(cantidad) {
    if (!this.tieneDisponibilidad(cantidad)) {
      return {
        exito: false,
        error: 'Cupo insuficiente para el tipo de entrada: ' + this.nombre
      };
    }

    this.cupoDisponible -= cantidad;
    this.tocar();

    return { exito: true };
  }

  /**
   * Libera entradas (aumenta el cupo disponible).
   * Regla de negocio BR-03: La disponibilidad aumenta cuando una compra es cancelada y reembolsada.
   * @param {number} cantidad - Cantidad de entradas a liberar
   */
  liberar(cantidad) {
    this.cupoDisponible += cantidad;
    if (this.cupoDisponible > this.cupoTotal) {
      this.cupoDisponible = this.cupoTotal;
    }
    this.tocar();
  }

  /**
   * Actualiza los datos del tipo de entrada.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.precio !== undefined) this.precio = datos.precio;
    if (datos.cupoTotal !== undefined) this.cupoTotal = datos.cupoTotal;
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      eventoId: this.eventoId,
      nombre: this.nombre,
      precio: this.precio,
      cupoTotal: this.cupoTotal,
      cupoDisponible: this.cupoDisponible,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}

