import { BaseRepository } from './BaseRepository.js';
import { Compra } from '../models/Compra.js';

/**
 * Repositorio de Compras en memoria.
 */
export class CompraRepository extends BaseRepository {
  /**
   * Busca compras por comprador.
   * @param {number|string} compradorId
   * @returns {Compra[]}
   */
  buscarPorComprador(compradorId) {
    return this.listarTodos().filter(c => c.compradorId === compradorId);
  }

  /**
   * Busca compras por evento.
   * @param {number|string} eventoId
   * @returns {Compra[]}
   */
  buscarPorEvento(eventoId) {
    return this.listarTodos().filter(c => c.eventoId === eventoId);
  }

  /**
   * Busca compras por comprador y evento.
   * @param {number|string} compradorId
   * @param {number|string} eventoId
   * @returns {Compra[]}
   */
  buscarPorCompradorYEvento(compradorId, eventoId) {
    return this.listarTodos().filter(
      c => c.compradorId === compradorId && c.eventoId === eventoId
    );
  }

  /**
   * Busca compras por estado.
   * @param {string} estado
   * @returns {Compra[]}
   */
  buscarPorEstado(estado) {
    return this.listarTodos().filter(c => c.estado === estado);
  }
}

