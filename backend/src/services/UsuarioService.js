import { Usuario } from '../models/Usuario.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';

/**
 * Servicio de Usuarios.
 * Gestión centralizada de usuarios y sus eventos favoritos.
 */
export class UsuarioService {
  /**
   * @param {UsuarioRepository} [repositorio]
   */
  constructor(repositorio = null) {
    this._repositorio = repositorio || new UsuarioRepository();
  }

  /**
   * Registra un nuevo usuario.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, usuario?: Usuario, errores?: string[] }
   */
  registrar(datos) {
    const usuario = new Usuario(datos);
    const validacion = usuario.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const existente = this._repositorio.buscarPorEmail(usuario.email);
    if (existente) {
      return {
        exito: false,
        errores: ['Ya existe un usuario con ese email.']
      };
    }

    const guardado = this._repositorio.guardar(usuario);
    return { exito: true, usuario: guardado };
  }

  /**
   * Busca un usuario por ID.
   * @param {number|string} id
   * @returns {Usuario|null}
   */
  buscarPorId(id) {
    return this._repositorio.buscarPorId(id);
  }

  /**
   * Busca un usuario por email.
   * @param {string} email
   * @returns {Usuario|null}
   */
  buscarPorEmail(email) {
    return this._repositorio.buscarPorEmail(email);
  }

  /**
   * Lista todos los usuarios.
   * @returns {Usuario[]}
   */
  listarTodos() {
    return this._repositorio.listarTodos();
  }

  /**
   * Agrega un evento a los favoritos de un usuario.
   * @param {number|string} usuarioId
   * @param {number|string|Object} evento
   * @returns {Object} { exito: boolean, usuario?: Usuario, error?: string }
   */
  agregarFavorito(usuarioId, evento) {
    const usuario = this.buscarPorId(usuarioId);
    if (!usuario) {
      return { exito: false, error: 'Usuario no encontrado.' };
    }

    const agregado = usuario.agregarFavorito(evento);
    if (!agregado) {
      return { exito: false, error: 'El evento ya se encuentra en favoritos.' };
    }

    this._repositorio.guardar(usuario);
    return { exito: true, usuario };
  }

  /**
   * Remueve un evento de los favoritos de un usuario.
   * @param {number|string} usuarioId
   * @param {number|string|Object} evento
   * @returns {Object} { exito: boolean, usuario?: Usuario, error?: string }
   */
  removerFavorito(usuarioId, evento) {
    const usuario = this.buscarPorId(usuarioId);
    if (!usuario) {
      return { exito: false, error: 'Usuario no encontrado.' };
    }

    const removido = usuario.removerFavorito(evento);
    if (!removido) {
      return { exito: false, error: 'El evento no estaba en la lista de favoritos.' };
    }

    this._repositorio.guardar(usuario);
    return { exito: true, usuario };
  }

  /**
   * Obtiene los favoritos de un usuario.
   * @param {number|string} usuarioId
   * @returns {Array}
   */
  obtenerFavoritos(usuarioId) {
    const usuario = this.buscarPorId(usuarioId);
    return usuario ? usuario.favoritos : [];
  }
}
