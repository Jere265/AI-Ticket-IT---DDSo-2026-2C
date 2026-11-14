import { BaseRepository } from './BaseRepository.js';
import { Organizador } from '../models/Organizador.js';

/**
 * Repositorio de Organizadores en memoria.
 */
export class OrganizadorRepository extends BaseRepository {
  /**
   * Busca un organizador por su email.
   * @param {string} email
   * @returns {Organizador|null}
   */
  buscarPorEmail(email) {
    return this.listarTodos().find(o => o.email === email) || null;
  }
}

