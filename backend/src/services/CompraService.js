import { Compra } from '../models/Compra.js';
import { CompraRepository } from '../repositories/CompraRepository.js';
import { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';
import { EventoRepository } from '../repositories/EventoRepository.js';
import { CambioEstadoCompraRepository } from '../repositories/CambioEstadoCompraRepository.js';
import { EstadoCompra } from '../models/value-objects/EstadoCompra.js';
import { CambioEstadoCompra } from '../models/CambioEstadoCompra.js';
import { CompraDTO } from '../models/dtos/CompraDTO.js';

/**
 * Servicio de Compras.
 * Casos de uso: compra de entradas, cancelación, cambio de estado, trazabilidad y consulta.
 * Reglas de negocio: BR-03, BR-04, BR-05, BR-06, BR-10, BR-11, BR-12.
 */
export class CompraService {
  /**
   * @param {CompraRepository} [compraRepo]
   * @param {TipoEntradaRepository} [tipoEntradaRepo]
   * @param {EventoRepository} [eventoRepo]
   * @param {CambioEstadoCompraRepository} [cambioEstadoRepo]
   */
  constructor(compraRepo = null, tipoEntradaRepo = null, eventoRepo = null, cambioEstadoRepo = null) {
    this._compraRepositorio = compraRepo || new CompraRepository();
    this._tipoEntradaRepositorio = tipoEntradaRepo || new TipoEntradaRepository();
    this._eventoRepositorio = eventoRepo || new EventoRepository();
    this._cambioEstadoRepositorio = cambioEstadoRepo || new CambioEstadoCompraRepository();
  }

  /**
   * Registra un cambio de estado en el repositorio histórico y en la compra.
   * @private
   */
  _registrarCambioEstado(compra, estado, quien = null) {
    const cambio = new CambioEstadoCompra({
      compra,
      compraId: compra.id,
      estado,
      quien: quien || compra.compradorId,
      fechaHora: new Date()
    });
    this._cambioEstadoRepositorio.guardar(cambio);
    if (!compra.historialEstados) compra.historialEstados = [];
    compra.historialEstados.push(cambio);
    return cambio;
  }

  /**
   * Crea una nueva compra de entradas.
   * Regla de negocio BR-04: La cantidad no puede superar el cupo disponible.
   * Regla de negocio BR-03: La disponibilidad disminuye al confirmar.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, compra?: Compra, errores?: string[] }
   */
  crearCompra(datos) {
    const compra = new Compra(datos);
    const validacion = compra.validar();

    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const cantidad = compra.cantidad;
    const tipoEntrada = this._tipoEntradaRepositorio.buscarPorId(
      datos.tipoEntradaId
    );

    if (!tipoEntrada) {
      return {
        exito: false,
        errores: ['El tipo de entrada seleccionado no existe.']
      };
    }

    if (!tipoEntrada.tieneDisponibilidad(cantidad)) {
      return {
        exito: false,
        errores: ['Cupo insuficiente para el tipo de entrada seleccionado.']
      };
    }

    // Calcular el total de la compra (cantidad * precio) según modelo conceptual
    if (!compra.total && tipoEntrada.precio !== undefined) {
      compra.total = cantidad * tipoEntrada.precio;
    }

    const compraGuardada = this._compraRepositorio.guardar(compra);

    // Registro del estado inicial
    this._registrarCambioEstado(compraGuardada, EstadoCompra.PENDIENTE_PAGO, datos.compradorId);

    const resultadoConfirmacion = compraGuardada.confirmar(datos.compradorId);
    if (!resultadoConfirmacion.exito) {
      return {
        exito: false,
        errores: [resultadoConfirmacion.error]
      };
    }

    // Registrar transición a CONFIRMADA
    this._registrarCambioEstado(compraGuardada, EstadoCompra.CONFIRMADA, datos.compradorId);

    const resultadoReserva = tipoEntrada.reservar(cantidad);
    if (!resultadoReserva.exito) {
      return {
        exito: false,
        errores: [resultadoReserva.error]
      };
    }

    this._tipoEntradaRepositorio.guardar(tipoEntrada);
    this._compraRepositorio.guardar(compraGuardada);

    return { exito: true, compra: compraGuardada };
  }

  /**
   * Cancela una compra y procesa el reembolso.
   * Regla de negocio BR-10: Solo si el evento no ocurrió y no está utilizada.
   * Regla de negocio BR-11: Restituye cupos y actualiza estado.
   * @param {number|string} compraId
   * @param {boolean} [eventoYaOcurrio]
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, compra?: Compra, errores?: string[] }
   */
  cancelarCompra(compraId, eventoYaOcurrio, quien = null) {
    const compra = this._compraRepositorio.buscarPorId(compraId);

    if (!compra) {
      return { exito: false, errores: ['La compra no existe.'] };
    }

    // Si no se especifica explícitamente si el evento ya ocurrió, consultamos al evento
    let yaOcurrio = eventoYaOcurrio;
    if (yaOcurrio === undefined) {
      const evento = this._eventoRepositorio.buscarPorId(compra.eventoId);
      yaOcurrio = evento ? evento.yaOcurrio() : false;
    }

    const resultado = compra.cancelar(yaOcurrio, quien);
    if (!resultado.exito) {
      return { exito: false, errores: [resultado.error] };
    }

    if (compra.estado === EstadoCompra.REEMBOLSADA) {
      const tipoEntrada = this._tipoEntradaRepositorio.buscarPorId(
        compra.tipoEntradaId
      );
      if (tipoEntrada) {
        tipoEntrada.liberar(compra.cantidad || compra.cantidadEntradas);
        this._tipoEntradaRepositorio.guardar(tipoEntrada);
      }
      this._registrarCambioEstado(compra, EstadoCompra.REEMBOLSADA, quien || compra.compradorId);
    }

    this._compraRepositorio.guardar(compra);
    return { exito: true, compra };
  }

  /**
   * Marca una compra como utilizada.
   * Regla de negocio BR-12: Una compra confirmada puede pasar a UTILIZADA.
   * @param {number|string} compraId
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, compra?: Compra, errores?: string[] }
   */
  marcarComoUtilizada(compraId, quien = null) {
    const compra = this._compraRepositorio.buscarPorId(compraId);

    if (!compra) {
      return { exito: false, errores: ['La compra no existe.'] };
    }

    const resultado = compra.marcarComoUtilizada(quien);
    if (!resultado.exito) {
      return { exito: false, errores: [resultado.error] };
    }

    this._registrarCambioEstado(compra, EstadoCompra.UTILIZADA, quien || compra.compradorId);
    this._compraRepositorio.guardar(compra);
    return { exito: true, compra };
  }

  /**
   * Actualiza el estado de una compra manualmente y registra la transición.
   * @param {number|string} compraId
   * @param {string} nuevoEstado
   * @param {string|number|Object} [quien]
   * @returns {Object} { exito: boolean, compra?: Compra, errores?: string[] }
   */
  actualizarEstadoCompra(compraId, nuevoEstado, quien = null) {
    const compra = this._compraRepositorio.buscarPorId(compraId);

    if (!compra) {
      return { exito: false, errores: ['La compra no existe.'] };
    }

    const resultado = compra.actualizarEstado(nuevoEstado, quien);
    if (!resultado.exito) {
      return { exito: false, errores: [resultado.error] };
    }

    this._registrarCambioEstado(compra, nuevoEstado, quien);
    this._compraRepositorio.guardar(compra);
    return { exito: true, compra };
  }

  /**
   * Obtiene la trazabilidad histórica de estados de una compra.
   * @param {number|string} compraId
   * @returns {CambioEstadoCompra[]}
   */
  obtenerHistorialEstados(compraId) {
    return this._cambioEstadoRepositorio.buscarPorCompra(compraId);
  }

  /**
   * Busca compras de un comprador.
   * @param {number|string} compradorId
   * @returns {Compra[]}
   */
  listarPorComprador(compradorId) {
    return this._compraRepositorio.buscarPorComprador(compradorId);
  }

  /**
   * Visualización detallada de compras de un comprador, incluyendo días restantes
   * hasta el evento en compras confirmadas (Caso de uso 1 del enunciado, BR-06).
   * @param {number|string} compradorId
   * @returns {CompraDTO[]}
   */
  listarComprasDetalladasPorComprador(compradorId) {
    const compras = this.listarPorComprador(compradorId);
    return compras.map(compra => {
      const evento = this._eventoRepositorio.buscarPorId(compra.eventoId);
      return new CompraDTO(compra, evento);
    });
  }

  /**
   * Busca compras de un evento.
   * @param {number|string} eventoId
   * @returns {Compra[]}
   */
  listarPorEvento(eventoId) {
    return this._compraRepositorio.buscarPorEvento(eventoId);
  }

  /**
   * Busca una compra por ID.
   * @param {number|string} id
   * @returns {Compra|null}
   */
  buscarPorId(id) {
    return this._compraRepositorio.buscarPorId(id);
  }
}
