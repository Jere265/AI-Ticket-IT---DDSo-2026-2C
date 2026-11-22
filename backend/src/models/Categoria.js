import { Entidad } from './Entidad.js';

/**
 * Entidad Categoria.
 * Representa la clasificación de un evento (ej. Conciertos, Teatro, Deportes).
 * Según el modelo conceptual tentativo de la consigna.
 */
export class Categoria extends Entidad {
  /**
   * @param {Object} data
   * @param {string} data.nombre - Nombre de la categoría
   * @param {string} [data.descripcion] - Descripción de la categoría
   * @param {string|number} [data.id] - Identificador único
   */
  constructor(data = {}) {
    super(data);
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
  }

  /**
   * Valida que los datos de la categoría sean correctos.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El nombre de la categoría es obligatorio.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Actualiza los datos de la categoría.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.descripcion !== undefined) this.descripcion = datos.descripcion;
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
