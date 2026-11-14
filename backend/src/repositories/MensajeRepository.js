import { BaseRepository } from './BaseRepository.js';
import { Mensaje } from '../models/Mensaje.js';

/**
 * Repositorio de Mensajes en memoria.
 */
export class MensajeRepository extends BaseRepository {
  /**
   * Busca mensajes de una compra ordenados cronológicamente.
   * Regla de negocio BR-09: Los mensajes deben almacenarse en orden cronológico.
   * @param {number|string} compraId
   * @returns {Mensaje[]}
   */
  buscarPorCompra(compraId) {
    return this.listarTodos()
      .filter(m => m.compraId === compraId)
      .sort((a, b) => a.fechaHora - b.fechaHora);
  }
}

