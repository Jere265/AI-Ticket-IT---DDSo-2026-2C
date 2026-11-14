import { Evento } from '../models/Evento.js';
import { TipoEntrada } from '../models/TipoEntrada.js';
import { EventoRepository } from '../repositories/EventoRepository.js';
import { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';

/**
 * Servicio de Eventos.
 * Casos de uso: creación, consulta, búsqueda y ordenamiento de eventos.
 * Reglas de negocio: BR-01, BR-02, BR-16, BR-17.
 */
export class EventoService {
  constructor(eventoRepo = null, tipoEntradaRepo = null) {
    this._eventoRepositorio = eventoRepo || new EventoRepository();
    this._tipoEntradaRepositorio = tipoEntradaRepo || new TipoEntradaRepository();
  }

  /**
   * Crea un nuevo evento con sus tipos de entrada.
   * Regla de negocio BR-01: Todo evento debe tener al menos un tipo de entrada.
   * Regla de negocio BR-02: Cada tipo de entrada debe tener nombre, precio y cupo.
   * @param {Object} datosEvento
   * @param {Object[]} tiposEntrada
   * @returns {Object} { exito: boolean, evento?: Evento, errores?: string[] }
   */
  crearEvento(datosEvento, tiposEntrada = []) {
    const evento = new Evento(datosEvento);
    const validacionEvento = evento.validar();

    if (!validacionEvento.valido) {
      return { exito: false, errores: validacionEvento.errores };
    }

    if (!tiposEntrada || tiposEntrada.length === 0) {
      return {
        exito: false,
        errores: ['El evento debe tener al menos un tipo de entrada.']
      };
    }

    const eventoGuardado = this._eventoRepositorio.guardar(evento);

    const tiposCreados = [];
    for (const datosTipo of tiposEntrada) {
      const tipo = new TipoEntrada({
        ...datosTipo,
        eventoId: eventoGuardado.id
      });
      const validacionTipo = tipo.validar();
      if (!validacionTipo.valido) {
        return {
          exito: false,
          errores: validacionTipo.errores
        };
      }
      const tipoGuardado = this._tipoEntradaRepositorio.guardar(tipo);
      tiposCreados.push(tipoGuardado);
    }

    return { exito: true, evento: eventoGuardado, tiposEntrada: tiposCreados };
  }

  /**
   * Busca un evento por ID.
   * @param {number|string} id
   * @returns {Evento|null}
   */
  buscarPorId(id) {
    return this._eventoRepositorio.buscarPorId(id);
  }

  /**
   * Lista eventos de un organizador.
   * @param {number|string} organizadorId
   * @returns {Evento[]}
   */
  listarPorOrganizador(organizadorId) {
    return this._eventoRepositorio.buscarPorOrganizador(organizadorId);
  }

  /**
   * Busca eventos por criterio de texto o categoría.
   * Regla de negocio BR-16.
   * @param {string} criterio
   * @returns {Evento[]}
   */
  buscar(criterio) {
    return this._eventoRepositorio.buscarPorCriterio(criterio);
  }

  /**
   * Busca eventos por categoría.
   * @param {string} categoria
   * @returns {Evento[]}
   */
  buscarPorCategoria(categoria) {
    return this._eventoRepositorio.buscarPorCategoria(categoria);
  }

  /**
   * Obtiene los tipos de entrada de un evento.
   * @param {number|string} eventoId
   * @returns {TipoEntrada[]}
   */
  obtenerTiposEntrada(eventoId) {
    return this._tipoEntradaRepositorio.buscarPorEvento(eventoId);
  }
}

