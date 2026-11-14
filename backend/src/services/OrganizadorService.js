import { Organizador } from '../models/Organizador.js';
import { OrganizadorRepository } from '../repositories/OrganizadorRepository.js';

/**
 * Servicio de Organizadores.
 * Casos de uso: registro y consulta de organizadores.
 */
export class OrganizadorService {
  constructor(repositorio = null) {
    this._repositorio = repositorio || new OrganizadorRepository();
  }

  /**
   * Registra un nuevo organizador.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, organizador?: Organizador, errores?: string[] }
   */
  registrar(datos) {
    const organizador = new Organizador(datos);
    const validacion = organizador.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const existente = this._repositorio.buscarPorEmail(organizador.email);
    if (existente) {
      return {
        exito: false,
        errores: ['Ya existe un organizador con ese email.']
      };
    }

    const guardado = this._repositorio.guardar(organizador);
    return { exito: true, organizador: guardado };
  }

  /**
   * Busca un organizador por su ID.
   * @param {number|string} id
   * @returns {Organizador|null}
   */
  buscarPorId(id) {
    return this._repositorio.buscarPorId(id);
  }

  /**
   * Busca un organizador por email.
   * @param {string} email
   * @returns {Organizador|null}
   */
  buscarPorEmail(email) {
    return this._repositorio.buscarPorEmail(email);
  }

  /**
   * Lista todos los organizadores.
   * @returns {Organizador[]}
   */
  listarTodos() {
    return this._repositorio.listarTodos();
  }
}

