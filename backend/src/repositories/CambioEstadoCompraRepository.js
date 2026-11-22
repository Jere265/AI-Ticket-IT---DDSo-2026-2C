import { BaseRepository } from './BaseRepository.js';
import { CambioEstadoCompra } from '../models/CambioEstadoCompra.js';

/**
 * Repositorio de CambioEstadoCompra en memoria.
 * Permite registrar y consultar la trazabilidad y seguimiento del estado de una compra.
 */
export class CambioEstadoCompraRepository extends BaseRepository {
  /**
   * Obtiene los cambios de estado asociados a una compra, en orden cronológico.
   * @param {number|string} compraId
   * @returns {CambioEstadoCompra[]}
   */
  buscarPorCompra(compraId) {
    return this.listarTodos()
      .filter(c => c.compraId === compraId)
      .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  }

  /**
   * Obtiene los cambios de estado efectuados por un usuario específico.
   * @param {number|string} usuarioId
   * @returns {CambioEstadoCompra[]}
   */
  buscarPorUsuario(usuarioId) {
    return this.listarTodos().filter(c => c.quienId === usuarioId);
  }
}
