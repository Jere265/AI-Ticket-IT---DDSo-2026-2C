import { Evento } from '../models/Evento.js';
import { TipoEntrada } from '../models/TipoEntrada.js';
import { EventoRepository } from '../repositories/EventoRepository.js';
import { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';

/**
 * Servicio de Eventos.
 * Casos de uso: creación, consulta, búsqueda, filtrado y ordenamiento de eventos.
 * Visualización de compras asociadas y disponibilidad por tipo de entrada para organizadores.
 * Reglas de negocio: BR-01, BR-02, BR-07, BR-16, BR-17.
 */
export class EventoService {
  /**
   * @param {EventoRepository} [eventoRepo]
   * @param {TipoEntradaRepository} [tipoEntradaRepo]
   */
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
   * @returns {Object} { exito: boolean, evento?: Evento, tiposEntrada?: TipoEntrada[], errores?: string[] }
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

    // Asociar tipos de entrada al evento en memoria
    eventoGuardado.tiposEntrada = tiposCreados;

    return { exito: true, evento: eventoGuardado, tiposEntrada: tiposCreados };
  }

  /**
   * Busca un evento por ID y le adjunta sus tipos de entrada.
   * @param {number|string} id
   * @returns {Evento|null}
   */
  buscarPorId(id) {
    const evento = this._eventoRepositorio.buscarPorId(id);
    if (evento && (!evento.tiposEntrada || evento.tiposEntrada.length === 0)) {
      evento.tiposEntrada = this._tipoEntradaRepositorio.buscarPorEvento(id);
    }
    return evento;
  }

  /**
   * Lista eventos de un organizador.
   * @param {number|string} organizadorId
   * @returns {Evento[]}
   */
  listarPorOrganizador(organizadorId) {
    const eventos = this._eventoRepositorio.buscarPorOrganizador(organizadorId);
    eventos.forEach(e => {
      if (!e.tiposEntrada || e.tiposEntrada.length === 0) {
        e.tiposEntrada = this._tipoEntradaRepositorio.buscarPorEvento(e.id);
      }
    });
    return eventos;
  }

  /**
   * Busca eventos por criterio de texto o categoría.
   * Regla de negocio BR-16.
   * @param {string} criterio
   * @returns {Evento[]}
   */
  buscar(criterio) {
    const eventos = this._eventoRepositorio.buscarPorCriterio(criterio);
    eventos.forEach(e => {
      if (!e.tiposEntrada || e.tiposEntrada.length === 0) {
        e.tiposEntrada = this._tipoEntradaRepositorio.buscarPorEvento(e.id);
      }
    });
    return eventos;
  }

  /**
   * Busca eventos por categoría.
   * Regla de negocio BR-16.
   * @param {string} categoria
   * @returns {Evento[]}
   */
  buscarPorCategoria(categoria) {
    const eventos = this._eventoRepositorio.buscarPorCategoria(categoria);
    eventos.forEach(e => {
      if (!e.tiposEntrada || e.tiposEntrada.length === 0) {
        e.tiposEntrada = this._tipoEntradaRepositorio.buscarPorEvento(e.id);
      }
    });
    return eventos;
  }

  /**
   * Obtiene los tipos de entrada de un evento.
   * @param {number|string} eventoId
   * @returns {TipoEntrada[]}
   */
  obtenerTiposEntrada(eventoId) {
    return this._tipoEntradaRepositorio.buscarPorEvento(eventoId);
  }

  /**
   * Obtiene el menor precio de los tipos de entrada de un evento.
   * @private
   */
  _obtenerPrecioMinimo(evento) {
    const tipos = (evento.tiposEntrada && evento.tiposEntrada.length > 0)
      ? evento.tiposEntrada
      : this._tipoEntradaRepositorio.buscarPorEvento(evento.id);
    if (!tipos || tipos.length === 0) return Infinity;
    return Math.min(...tipos.map(t => Number(t.precio)));
  }

  /**
   * Ordena una lista de eventos por precio.
   * Caso de uso: ordenar por precio.
   * @param {Evento[]} eventos
   * @param {'asc'|'desc'} [direccion='asc']
   * @returns {Evento[]}
   */
  ordenarPorPrecio(eventos = [], direccion = 'asc') {
    const copia = [...eventos];
    return copia.sort((a, b) => {
      const precioA = this._obtenerPrecioMinimo(a);
      const precioB = this._obtenerPrecioMinimo(b);
      return direccion === 'desc' ? precioB - precioA : precioA - precioB;
    });
  }

  /**
   * Ordena una lista de eventos por fecha del evento.
   * Caso de uso: ordenar por fecha del evento.
   * @param {Evento[]} eventos
   * @param {'asc'|'desc'} [direccion='asc']
   * @returns {Evento[]}
   */
  ordenarPorFecha(eventos = [], direccion = 'asc') {
    const copia = [...eventos];
    return copia.sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return direccion === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    });
  }

  /**
   * Ordena una lista de eventos por el puntaje promedio del organizador.
   * Caso de uso: ordenar por puntaje del organizador.
   * @param {Evento[]} eventos
   * @param {Object} resenaService - Servicio de reseñas para obtener puntajes
   * @param {'asc'|'desc'} [direccion='desc']
   * @returns {Evento[]}
   */
  ordenarPorPuntajeOrganizador(eventos = [], resenaService, direccion = 'desc') {
    const copia = [...eventos];
    return copia.sort((a, b) => {
      const puntajeA = resenaService ? (resenaService.calcularPuntajePromedioOrganizador(a.organizadorId) || 0) : 0;
      const puntajeB = resenaService ? (resenaService.calcularPuntajePromedioOrganizador(b.organizadorId) || 0) : 0;
      return direccion === 'asc' ? puntajeA - puntajeB : puntajeB - puntajeA;
    });
  }

  /**
   * Busca eventos y permite aplicar ordenamiento por precio, fecha o puntaje.
   * Caso de uso integrado de búsqueda y ordenamiento.
   * @param {Object} params
   * @param {string} [params.criterio]
   * @param {string} [params.categoria]
   * @param {string} [params.ordenarPor] - 'precio' | 'fecha' | 'puntaje'
   * @param {'asc'|'desc'} [params.direccion]
   * @param {Object} [params.resenaService]
   * @returns {Evento[]}
   */
  buscarYOrdenar({ criterio, categoria, ordenarPor, direccion = 'asc', resenaService } = {}) {
    let resultados = [];

    if (categoria) {
      resultados = this.buscarPorCategoria(categoria);
      if (criterio) {
        resultados = resultados.filter(e => e.coincideConBusqueda(criterio));
      }
    } else if (criterio) {
      resultados = this.buscar(criterio);
    } else {
      resultados = this._eventoRepositorio.listarTodos();
      resultados.forEach(e => {
        if (!e.tiposEntrada || e.tiposEntrada.length === 0) {
          e.tiposEntrada = this._tipoEntradaRepositorio.buscarPorEvento(e.id);
        }
      });
    }

    if (ordenarPor === 'precio') {
      return this.ordenarPorPrecio(resultados, direccion);
    } else if (ordenarPor === 'fecha') {
      return this.ordenarPorFecha(resultados, direccion);
    } else if (ordenarPor === 'puntaje') {
      return this.ordenarPorPuntajeOrganizador(resultados, resenaService, direccion === 'asc' ? 'asc' : 'desc');
    }

    return resultados;
  }

  /**
   * Permite al organizador visualizar las compras asociadas a un Evento en particular,
   * diferenciando con claridad el estado en el que se encuentran y cuántas entradas
   * quedan disponibles de cada tipo.
   * Caso de uso: "Como organizador, quiero poder visualizar las compras asociadas a un Evento..." (BR-07).
   * @param {number|string} eventoId
   * @param {Object} compraService
   * @returns {Object|null}
   */
  obtenerEstadoVentas(eventoId, compraService) {
    const evento = this.buscarPorId(eventoId);
    if (!evento) return null;

    const tipos = this.obtenerTiposEntrada(eventoId);
    const compras = compraService ? compraService.listarPorEvento(eventoId) : [];

    const disponibilidadPorTipo = tipos.map(t => ({
      tipoEntradaId: t.id,
      nombre: t.nombre,
      precio: t.precio,
      cupoTotal: t.cupoTotal,
      cupoDisponible: t.cupoDisponible,
      entradasVendidas: Math.max(0, t.cupoTotal - t.cupoDisponible)
    }));

    const comprasPorEstado = {
      PENDIENTE: [],
      CONFIRMADA: [],
      UTILIZADA: [],
      CANCELADA: [],
      REEMBOLSADA: []
    };

    let totalEntradasVendidas = 0;
    for (const c of compras) {
      const estadoClave = c.estado === 'PENDIENTE_PAGO' ? 'PENDIENTE' : c.estado;
      if (comprasPorEstado[estadoClave]) {
        comprasPorEstado[estadoClave].push(c);
      } else {
        comprasPorEstado[c.estado] = [c];
      }
      if (c.estado === 'CONFIRMADA' || c.estado === 'UTILIZADA') {
        totalEntradasVendidas += (c.cantidad || c.cantidadEntradas || 0);
      }
    }

    return {
      evento,
      disponibilidadPorTipo,
      compras,
      comprasPorEstado,
      totalEntradasVendidas
    };
  }
}
