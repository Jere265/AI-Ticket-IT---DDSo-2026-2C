import { BaseRepository } from './BaseRepository.js';
import { Comprador } from '../models/Comprador.js';

/**
 * Repositorio de Compradores en memoria.
 */
export class CompradorRepository extends BaseRepository {
  /**
   * Busca un comprador por su email.
   * @param {string} email
   * @returns {Comprador|null}
   */
  buscarPorEmail(email) {
    return this.listarTodos().find(c => c.email === email) || null;
  }
}

