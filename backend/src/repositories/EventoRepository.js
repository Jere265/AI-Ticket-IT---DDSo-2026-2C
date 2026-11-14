import { BaseRepository } from './BaseRepository.js';
import { Evento } from '../models/Evento.js';

/**
 * Repositorio de Eventos en memoria.
 */
export class EventoRepository extends BaseRepository {
  /**
   * Busca eventos por organizador.
   * @param {number|string} organizadorId
   * @returns {Evento[]}
   */
  buscarPorOrganizador(organizadorId) {
    return this.listarTodos().filter(e => e.organizadorId === organizadorId);
  }

  /**
   * Busca eventos por criterio de texto o categoría.
   * @param {string} criterio
   * @returns {Evento[]}
   */
  buscarPorCriterio(criterio) {
    return this.listarTodos().filter(e => e.coincideConBusqueda(criterio));
  }

  /**
   * Busca eventos por categoría.
   * @param {string} categoria
   * @returns {Evento[]}
   */
  buscarPorCategoria(categoria) {
    return this.listarTodos().filter(e => e.categoria === categoria);
  }
}

