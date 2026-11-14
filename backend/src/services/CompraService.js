import { Compra } from '../models/Compra.js';
import { CompraRepository } from '../repositories/CompraRepository.js';
import { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';
import { EventoRepository } from '../repositories/EventoRepository.js';
import { EstadoCompra } from '../models/value-objects/EstadoCompra.js';

/**
 * Servicio de Compras.
 * Casos de uso: compra de entradas, cancelación, cambio de estado.
 * Reglas de negocio: BR-03, BR-04, BR-05, BR-10, BR-11, BR-12.
 */
export class CompraService {
  constructor(compraRepo = null, tipoEntradaRepo = null, eventoRepo = null) {
    this._compraRepositorio = compraRepo || new CompraRepository();
    this._tipoEntradaRepositorio = tipoEntradaRepo || new TipoEntradaRepository();
    this._eventoRepositorio = eventoRepo || new EventoRepository();
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

    const tipoEntrada = this._tipoEntradaRepositorio.buscarPorId(
      datos.tipoEntradaId
    );

    if (!tipoEntrada) {
      return {
        exito: false,
        errores: ['El tipo de entrada seleccionado no existe.']
      };
    }

    if (!tipoEntrada.tieneDisponibilidad(datos.cantidadEntradas)) {
      return {
        exito: false,
        errores: ['Cupo insuficiente para el tipo de entrada seleccionado.']
      };
    }

    const compraGuardada = this._compraRepositorio.guardar(compra);

    const resultadoConfirmacion = compraGuardada.confirmar();
    if (!resultadoConfirmacion.exito) {
      return {
        exito: false,
        errores: [resultadoConfirmacion.error]
      };
    }

    const resultadoReserva = tipoEntrada.reservar(datos.cantidadEntradas);
    if (!resultadoReserva.exito) {
      return {
        exito: false,
        errores: [resultadoReserva.error]
      };
    }

    this._tipoEntradaRepositorio.guardar(tipoEntrada);

    return { exito: true, compra: compraGuardada };
  }

  /**
   * Cancela una compra y procesa el reembolso.
   * Regla de negocio BR-10: Solo si el evento no ocurrió y no está utilizada.
   * Regla de negocio BR-11: Restituye cupos y actualiza estado.
   * @param {number|string} compraId
   * @param {boolean} eventoYaOcurrio
   * @returns {Object} { exito: boolean, errores?: string[] }
   */
  cancelarCompra(compraId, eventoYaOcurrio) {
    const compra = this._compraRepositorio.buscarPorId(compraId);

    if (!compra) {
      return { exito: false, errores: ['La compra no existe.'] };
    }

    const resultado = compra.cancelar(eventoYaOcurrio);
    if (!resultado.exito) {
      return { exito: false, errores: [resultado.error] };
    }

    if (compra.estado === EstadoCompra.REEMBOLSADA) {
      const tipoEntrada = this._tipoEntradaRepositorio.buscarPorId(
        compra.tipoEntradaId
      );
      if (tipoEntrada) {
        tipoEntrada.liberar(compra.cantidadEntradas);
        this._tipoEntradaRepositorio.guardar(tipoEntrada);
      }
    }

    this._compraRepositorio.guardar(compra);
    return { exito: true, compra };
  }

  /**
   * Marca una compra como utilizada.
   * Regla de negocio BR-12: Una compra confirmada puede pasar a UTILIZADA.
   * @param {number|string} compraId
   * @returns {Object} { exito: boolean, compra?: Compra, errores?: string[] }
   */
  marcarComoUtilizada(compraId) {
    const compra = this._compraRepositorio.buscarPorId(compraId);

    if (!compra) {
      return { exito: false, errores: ['La compra no existe.'] };
    }

    const resultado = compra.marcarComoUtilizada();
    if (!resultado.exito) {
      return { exito: false, errores: [resultado.error] };
    }

    this._compraRepositorio.guardar(compra);
    return { exito: true, compra };
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

