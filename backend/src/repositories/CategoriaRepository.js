import { BaseRepository } from './BaseRepository.js';
import { Categoria } from '../models/Categoria.js';

/**
 * Repositorio de Categorías en memoria.
 */
export class CategoriaRepository extends BaseRepository {
  /**
   * Busca una categoría por nombre (ignorando mayúsculas/minúsculas).
   * @param {string} nombre
   * @returns {Categoria|null}
   */
  buscarPorNombre(nombre) {
    if (!nombre) return null;
    const n = nombre.trim().toLowerCase();
    return this.listarTodos().find(c => c.nombre.trim().toLowerCase() === n) || null;
  }
}
