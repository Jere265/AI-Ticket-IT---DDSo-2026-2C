import { Comprador } from '../models/Comprador.js';
import { CompradorRepository } from '../repositories/CompradorRepository.js';

/**
 * Servicio de Compradores.
 * Casos de uso: registro y consulta de compradores.
 */
export class CompradorService {
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
}

