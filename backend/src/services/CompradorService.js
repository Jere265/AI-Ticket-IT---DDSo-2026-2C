import { Comprador } from '../models/Comprador.js';
import { CompradorRepository } from '../repositories/CompradorRepository.js';

/**
 * Servicio de Compradores.
 * Casos de uso: registro, consulta y gestión de eventos favoritos del comprador.
 */
export class CompradorService {
  /**
   * @param {CompradorRepository} [repositorio]
   */
  constructor(repositorio = null) {
    this._repositorio = repositorio || new CompradorRepository();
  }

  /**
   * Registra un nuevo comprador.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, comprador?: Comprador, errores?: string[] }
   */
  registrar(datos) {
    const comprador = new Comprador(datos);
    const validacion = comprador.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const existente = this._repositorio.buscarPorEmail(comprador.email);
    if (existente) {
      return {
        exito: false,
        errores: ['Ya existe un comprador con ese email.']
      };
    }

    const guardado = this._repositorio.guardar(comprador);
    return { exito: true, comprador: guardado };
  }

  /**
   * Busca un comprador por su ID.
   * @param {number|string} id
   * @returns {Comprador|null}
   */
  buscarPorId(id) {
    return this._repositorio.buscarPorId(id);
  }

  /**
   * Busca un comprador por email.
   * @param {string} email
   * @returns {Comprador|null}
   */
  buscarPorEmail(email) {
    return this._repositorio.buscarPorEmail(email);
  }

  /**
   * Lista todos los compradores.
   * @returns {Comprador[]}
   */
  listarTodos() {
    return this._repositorio.listarTodos();
  }

  /**
   * Agrega un evento a los favoritos del comprador.
   * Requerimiento conceptual: "guardar eventos favoritos".
   * @param {number|string} compradorId
   * @param {number|string|Object} evento
   * @returns {Object} { exito: boolean, comprador?: Comprador, error?: string }
   */
  agregarFavorito(compradorId, evento) {
    const comprador = this.buscarPorId(compradorId);
    if (!comprador) {
      return { exito: false, error: 'Comprador no encontrado.' };
    }

    const agregado = comprador.agregarFavorito(evento);
    if (!agregado) {
      return { exito: false, error: 'El evento ya se encuentra en favoritos.' };
    }

    this._repositorio.guardar(comprador);
    return { exito: true, comprador };
  }

  /**
   * Remueve un evento de los favoritos del comprador.
   * @param {number|string} compradorId
   * @param {number|string|Object} evento
   * @returns {Object} { exito: boolean, comprador?: Comprador, error?: string }
   */
  removerFavorito(compradorId, evento) {
    const comprador = this.buscarPorId(compradorId);
    if (!comprador) {
      return { exito: false, error: 'Comprador no encontrado.' };
    }

    const removido = comprador.removerFavorito(evento);
    if (!removido) {
      return { exito: false, error: 'El evento no estaba en la lista de favoritos.' };
    }

    this._repositorio.guardar(comprador);
    return { exito: true, comprador };
  }

  /**
   * Obtiene la lista de favoritos de un comprador.
   * @param {number|string} compradorId
   * @returns {Array}
   */
  obtenerFavoritos(compradorId) {
    const comprador = this.buscarPorId(compradorId);
    return comprador ? comprador.favoritos : [];
  }
}
