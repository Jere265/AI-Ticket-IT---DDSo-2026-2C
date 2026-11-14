import { BaseRepository } from './BaseRepository.js';
import { Resena } from '../models/Resena.js';

/**
 * Repositorio de Resenas en memoria.
 */
export class ResenaRepository extends BaseRepository {
  /**
   * Busca resenas por evento.
   * @param {number|string} eventoId
   * @returns {Resena[]}
   */
  buscarPorEvento(eventoId) {
    return this.listarTodos().filter(r => r.eventoId === eventoId);
  }

  /**
   * Busca una resena por compra y comprador.
   * Regla de negocio BR-13: Solo puede existir una resena por compra.
   * @param {number|string} compraId
   * @param {number|string} compradorId
   * @returns {Resena|null}
   */
  buscarPorCompraYComprador(compraId, compradorId) {
    return (
      this.listarTodos().find(
        r => r.compraId === compraId && r.compradorId === compradorId
      ) || null
    );
  }

  /**
   * Busca resenas por comprador.
   * @param {number|string} compradorId
   * @returns {Resena[]}
   */
  buscarPorComprador(compradorId) {
    return this.listarTodos().filter(r => r.compradorId === compradorId);
  }
}


