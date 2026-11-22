import { BaseRepository } from './BaseRepository.js';
import { Usuario } from '../models/Usuario.js';

/**
 * Repositorio de Usuarios en memoria.
 */
export class UsuarioRepository extends BaseRepository {
  /**
   * Busca un usuario por email.
   * @param {string} email
   * @returns {Usuario|null}
   */
  buscarPorEmail(email) {
    if (!email) return null;
    return this.listarTodos().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}
