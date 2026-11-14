import { BaseRepository } from './BaseRepository.js';
import { TipoEntrada } from '../models/TipoEntrada.js';

/**
 * Repositorio de Tipos de Entrada en memoria.
 */
export class TipoEntradaRepository extends BaseRepository {
  /**
   * Busca tipos de entrada por evento.
   * @param {number|string} eventoId
   * @returns {TipoEntrada[]}
   */
  buscarPorEvento(eventoId) {
    return this.listarTodos().filter(t => t.eventoId === eventoId);
  }
}

