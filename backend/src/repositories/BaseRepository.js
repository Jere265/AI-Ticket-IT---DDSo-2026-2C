/**
 * Repositorio base en memoria.
 * Proporciona operaciones CRUD genéricas para entidades del dominio.
 * Regla de negocio BR-20: Todos los datos se mantienen en memoria.
 */
export class BaseRepository {
  constructor() {
    this._items = new Map();
    this._nextId = 1;
  }

  /**
   * Genera el siguiente identificador único.
   * @returns {number}
   */
  _generarId() {
    return this._nextId++;
  }

  /**
   * Guarda una entidad. Si no tiene ID, se le asigna uno nuevo.
   * @param {Object} entidad - Entidad a guardar
   * @returns {Object} La entidad guardada
   */
  guardar(entidad) {
    if (!entidad.id || !entidad.estaPersistida()) {
      entidad.id = this._generarId();
    }
    this._items.set(entidad.id, entidad);
    entidad.tocar();
    return entidad;
  }

  /**
   * Busca una entidad por su ID.
   * @param {number|string} id
   * @returns {Object|null}
   */
  buscarPorId(id) {
    return this._items.get(id) || null;
  }

  /**
   * Devuelve todas las entidades almacenadas.
   * @returns {Object[]}
   */
  listarTodos() {
    return Array.from(this._items.values());
  }

  /**
   * Elimina una entidad por su ID.
   * @param {number|string} id
   * @returns {boolean} true si se eliminó, false si no existía
   */
  eliminar(id) {
    return this._items.delete(id);
  }

  /**
   * Cuenta el total de entidades.
   * @returns {number}
   */
  contar() {
    return this._items.size;
  }

  /**
   * Limpia todo el repositorio (útil para tests).
   */
  limpiar() {
    this._items.clear();
    this._nextId = 1;
  }
}

