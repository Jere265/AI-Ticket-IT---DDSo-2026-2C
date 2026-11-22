import { Entidad } from './Entidad.js';

/**
 * Entidad Evento.
 * Representa una actividad publicada por un organizador.
 * Según el modelo conceptual del enunciado y reglas BR-01, BR-16, BR-17.
 */
export class Evento extends Entidad {
  /**
   * @param {Object} data
   * @param {string|number|Object} [data.organizador] - Usuario organizador o su ID
   * @param {string|number} [data.organizadorId] - ID del organizador
   * @param {string} [data.nombre] - Nombre del evento (diagrama tentativo)
   * @param {string} [data.titulo] - Título del evento (alias de nombre)
   * @param {string} data.descripcion - Descripción del evento
   * @param {string|Object} data.categoria - Categoría del evento (nombre o instancia Categoria)
   * @param {string|Date} [data.fecha] - Fecha de realización (diagrama tentativo)
   * @param {string|Date} [data.fechaEvento] - Fecha de realización (alias de fecha)
   * @param {string[]} [data.multimedia] - Lista de recursos multimedia (diagrama tentativo)
   * @param {string} [data.imagen] - URL o ruta de la imagen principal
   * @param {Array} [data.tiposEntrada] - Tipos de entrada asociados al evento
   * @param {string|number} [data.id] - Identificador único (opcional)
   */
  constructor(data = {}) {
    super(data);
    this._nombre = data.nombre || data.titulo || '';
    this.descripcion = data.descripcion || '';

    // Manejo flexible de categoría (instancia de Categoria, objeto o string)
    if (typeof data.categoria === 'object' && data.categoria !== null) {
      this._categoria = data.categoria.nombre || '';
      this.categoriaObjeto = data.categoria;
    } else {
      this._categoria = data.categoria || '';
      this.categoriaObjeto = null;
    }

    const fechaRaw = data.fecha !== undefined ? data.fecha : data.fechaEvento;
    this._fecha = fechaRaw ? new Date(fechaRaw) : null;

    // Organizador
    this.organizador = (typeof data.organizador === 'object' && data.organizador !== null) ? data.organizador : null;
    this.organizadorId = data.organizadorId || (this.organizador ? this.organizador.id : (typeof data.organizador === 'string' || typeof data.organizador === 'number' ? data.organizador : null));

    // Multimedia
    if (Array.isArray(data.multimedia)) {
      this.multimedia = [...data.multimedia];
    } else if (data.imagen) {
      this.multimedia = [data.imagen];
    } else {
      this.multimedia = [];
    }

    // Tipos de entrada
    this.tiposEntrada = Array.isArray(data.tiposEntrada) ? [...data.tiposEntrada] : [];
  }

  // Getters y setters para compatibilidad entre diagrama (nombre, fecha) y código previo (titulo, fechaEvento)
  get nombre() {
    return this._nombre;
  }
  set nombre(val) {
    this._nombre = val || '';
  }

  get titulo() {
    return this._nombre;
  }
  set titulo(val) {
    this._nombre = val || '';
  }

  get fecha() {
    return this._fecha;
  }
  set fecha(val) {
    this._fecha = val ? new Date(val) : null;
  }

  get fechaEvento() {
    return this._fecha;
  }
  set fechaEvento(val) {
    this._fecha = val ? new Date(val) : null;
  }

  get categoria() {
    return this._categoria;
  }
  set categoria(val) {
    if (typeof val === 'object' && val !== null) {
      this._categoria = val.nombre || '';
      this.categoriaObjeto = val;
    } else {
      this._categoria = val || '';
      this.categoriaObjeto = null;
    }
  }

  get imagen() {
    return this.multimedia.length > 0 ? this.multimedia[0] : null;
  }
  set imagen(val) {
    if (val) {
      if (this.multimedia.length > 0) {
        this.multimedia[0] = val;
      } else {
        this.multimedia = [val];
      }
    }
  }

  /**
   * Agrega un tipo de entrada a la lista del evento.
   * @param {Object} tipoEntrada
   */
  agregarTipoEntrada(tipoEntrada) {
    if (tipoEntrada) {
      this.tiposEntrada.push(tipoEntrada);
      this.tocar();
    }
  }

  /**
   * Verifica si alguno de los tipos de entrada del evento tiene precio dentro del rango [min, max].
   * Método según diagrama de la consigna: tuPrecioEstaEntre(int, int): Boolean.
   * @param {number} min - Precio mínimo
   * @param {number} max - Precio máximo
   * @returns {boolean}
   */
  tuPrecioEstaEntre(min, max) {
    if (!this.tiposEntrada || this.tiposEntrada.length === 0) {
      return false;
    }
    return this.tiposEntrada.some(t => {
      const p = Number(t.precio);
      return p >= min && p <= max;
    });
  }

  /**
   * Valida que los datos del evento sean correctos.
   * Regla de negocio BR-01.
   * @returns {Object} { valido: boolean, errores: string[] }
   */
  validar() {
    const errores = [];

    if (!this.organizadorId) {
      errores.push('El evento debe pertenecer a un organizador.');
    }

    if (!this.nombre || this.nombre.trim().length === 0) {
      errores.push('El título del evento es obligatorio.');
    }

    if (!this.descripcion || this.descripcion.trim().length === 0) {
      errores.push('La descripción del evento es obligatoria.');
    }

    if (!this.categoria || this.categoria.trim().length === 0) {
      errores.push('La categoría del evento es obligatoria.');
    }

    if (!this.fecha || isNaN(this.fecha.getTime())) {
      errores.push('La fecha del evento es obligatoria y debe ser válida.');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Indica si el evento ya ocurrió.
   * @returns {boolean}
   */
  yaOcurrio() {
    if (!this.fecha) return false;
    return this.fecha < new Date();
  }

  /**
   * Calcula los días restantes hasta el evento.
   * Regla de negocio BR-06.
   * @returns {number|null}
   */
  calcularDiasRestantes() {
    if (!this.fecha || this.yaOcurrio()) return null;
    const ahora = new Date();
    const diferenciaMs = this.fecha - ahora;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Indica si el evento coincide con un criterio de búsqueda por texto o categoría.
   * Regla de negocio BR-16.
   * @param {string} criterio
   * @returns {boolean}
   */
  coincideConBusqueda(criterio) {
    if (!criterio || criterio.trim().length === 0) return true;
    const c = criterio.toLowerCase().trim();
    return (
      this.nombre.toLowerCase().includes(c) ||
      this.descripcion.toLowerCase().includes(c) ||
      this.categoria.toLowerCase().includes(c)
    );
  }

  /**
   * Actualiza los datos del evento.
   * @param {Object} datos
   */
  actualizar(datos = {}) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.titulo !== undefined) this.titulo = datos.titulo;
    if (datos.descripcion !== undefined) this.descripcion = datos.descripcion;
    if (datos.categoria !== undefined) this.categoria = datos.categoria;
    if (datos.fecha !== undefined) this.fecha = datos.fecha;
    if (datos.fechaEvento !== undefined) this.fechaEvento = datos.fechaEvento;
    if (datos.multimedia !== undefined) this.multimedia = [...datos.multimedia];
    if (datos.imagen !== undefined) this.imagen = datos.imagen;
    if (datos.tiposEntrada !== undefined) this.tiposEntrada = [...datos.tiposEntrada];
    this.tocar();
  }

  toJSON() {
    return {
      id: this.id,
      organizadorId: this.organizadorId,
      nombre: this.nombre,
      titulo: this.titulo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      fecha: this.fecha ? this.fecha.toISOString() : null,
      fechaEvento: this.fecha ? this.fecha.toISOString() : null,
      multimedia: this.multimedia,
      imagen: this.imagen,
      tiposEntrada: this.tiposEntrada,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
