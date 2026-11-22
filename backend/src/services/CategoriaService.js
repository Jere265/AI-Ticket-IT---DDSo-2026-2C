import { Categoria } from '../models/Categoria.js';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';

/**
 * Servicio de Categorías.
 * Casos de uso: creación, consulta y listado de categorías de eventos.
 */
export class CategoriaService {
  /**
   * @param {CategoriaRepository} [repositorio]
   */
  constructor(repositorio = null) {
    this._repositorio = repositorio || new CategoriaRepository();
  }

  /**
   * Crea una nueva categoría.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, categoria?: Categoria, errores?: string[] }
   */
  crearCategoria(datos) {
    const categoria = new Categoria(datos);
    const validacion = categoria.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const existente = this._repositorio.buscarPorNombre(categoria.nombre);
    if (existente) {
      return {
        exito: false,
        errores: ['Ya existe una categoría con ese nombre.']
      };
    }

    const guardada = this._repositorio.guardar(categoria);
    return { exito: true, categoria: guardada };
  }

  /**
   * Busca una categoría por ID.
   * @param {number|string} id
   * @returns {Categoria|null}
   */
  buscarPorId(id) {
    return this._repositorio.buscarPorId(id);
  }

  /**
   * Busca una categoría por su nombre.
   * @param {string} nombre
   * @returns {Categoria|null}
   */
  buscarPorNombre(nombre) {
    return this._repositorio.buscarPorNombre(nombre);
  }

  /**
   * Lista todas las categorías.
   * @returns {Categoria[]}
   */
  listarTodas() {
    return this._repositorio.listarTodos();
  }
}
