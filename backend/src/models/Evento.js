import { Entidad } from './Entidad.js';

/**
 * Entidad Evento.
 * Representa una actividad publicada por un organizador.
 * Reglas de negocio asociadas: BR-01 (creación de eventos), BR-16 (búsqueda), BR-17 (ordenamiento).
 */
export class Evento extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number} data.organizadorId - ID del organizador dueno del evento
   * @param {string} data.titulo - Título del evento
   * @param {string} data.descripcion - Descripción del evento
   * @param {string} data.categoria - Categoría del evento
   * @param {string|Date} data.fechaEvento - Fecha de realización del evento
   * @param {string} [data.imagen] - URL o ruta de la imagen del evento
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this.organizadorId = data.organizadorId || null;
    this.titulo = data.titulo || '';
    this.descripcion = data.descripcion || '';
    this.categoria = data.categoria || '';
    this.fechaEvento = data.fechaEvento ? new Date(data.fechaEvento) : null;
    this.imagen = data.imagen || null;
  }

  /**
   * Valida que los datos del evento sean correctos.
   * Regla de negocio BR-01: Todo evento debe poseer título, descripción, categoría, fecha y al menos un tipo de entrada.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.organizadorId) {
      errores.push('El evento debe pertenecer a un organizador.');
    }

    if (!this.titulo || this.titulo.trim().length === 0) {
      errores.push('El título del evento es obligatorio.');
    }

    if (!this.descripcion || this.descripcion.trim().length === 0) {
      errores.push('La descripción del evento es obligatoria.');
    }

    if (!this.categoria || this.categoria.trim().length === 0) {
      errores.push('La categoría del evento es obligatoria.');
    }

    if (!this.fechaEvento || isNaN(this.fechaEvento.getTime())) {
      errores.push('La fecha del evento es obligatoria y debe ser válida.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Indica si el evento ya ocurrió (fecha pasada).
   * @returns {boolean}
   */
  yaOcurrio() {
    if (!this.fechaEvento) return false;
    return this.fechaEvento < new Date();
  }

  /**
   * Calcula los días restantes hasta el evento.
   * Regla de negocio BR-06: Días restantes = fechaEvento - fechaActual.
   * @returns {number|null} Días restantes o null si no hay fecha definida
   */
  calcularDiasRestantes() {
    if (!this.fechaEvento || this.yaOcurrio()) return null;
    const ahora = new Date();
    const diferenciaMs = this.fechaEvento - ahora;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Indica si el evento coincide con un criterio de búsqueda por texto o categoría.
   * Regla de negocio BR-16: Búsqueda por texto libre o por categoría.
   * @param {string} criterio - Texto a buscar
   * @returns {boolean}
   */
  coincideConBusqueda(criterio) {
    if (!criterio || criterio.trim().length === 0) return true;
    const c = criterio.toLowerCase().trim();
    return (
      this.titulo.toLowerCase().includes(c) ||
      this.descripcion.toLowerCase().includes(c) ||
      this.categoria.toLowerCase().includes(c)
    );
  }

  /**
   * Actualiza los datos del evento.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.titulo !== undefined) this.titulo = datos.titulo;
    if (datos.descripcion !== undefined) this.descripcion = datos.descripcion;
    if (datos.categoria !== undefined) this.categoria = datos.categoria;
    if (datos.fechaEvento !== undefined) this.fechaEvento = new Date(datos.fechaEvento);
    if (datos.imagen !== undefined) this.imagen = datos.imagen;
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      organizadorId: this.organizadorId,
      titulo: this.titulo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      fechaEvento: this.fechaEvento ? this.fechaEvento.toISOString() : null,
      imagen: this.imagen,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}


