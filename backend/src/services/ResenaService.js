import { Resena } from '../models/Resena.js';
import { ResenaRepository } from '../repositories/ResenaRepository.js';
import { CompraRepository } from '../repositories/CompraRepository.js';
import { EventoRepository } from '../repositories/EventoRepository.js';

/**
 * Servicio de Resenas.
 * Casos de uso: calificar un evento después de asistir.
 * Reglas de negocio: BR-13, BR-14, BR-15.
 */
export class ResenaService {
  constructor(resenaRepo = null, compraRepo = null, eventoRepo = null) {
    this._resenaRepositorio = resenaRepo || new ResenaRepository();
    this._compraRepositorio = compraRepo || new CompraRepository();
    this._eventoRepositorio = eventoRepo || new EventoRepository();
  }

  /**
   * Crea una resena para una compra utilizada.
   * Regla de negocio BR-13: Solo si la compra pertenece al comprador y está UTILIZADA.
   * Regla de negocio BR-14: Debe contener puntaje y comentario.
   * @param {Object} datos
   * @returns {Object} { exito: boolean, resena?: Resena, errores?: string[] }
   */
  crearResena(datos) {
    const compra = this._compraRepositorio.buscarPorId(datos.compraId);

    if (!compra) {
      return {
        exito: false,
        errores: ['No se puede calificar: la compra asociada no existe.']
      };
    }

    if (compra.compradorId !== datos.compradorId) {
      return {
        exito: false,
        errores: ['Solo el comprador de la compra puede calificarla.']
      };
    }

    if (!compra.esElegibleParaResena()) {
      return {
        exito: false,
        errores: ['Solo se puede calificar una compra en estado UTILIZADA.']
      };
    }

    const existente = this._resenaRepositorio.buscarPorCompraYComprador(
      datos.compraId,
      datos.compradorId
    );

    if (existente) {
      return {
        exito: false,
        errores: ['Ya existe una resena para esta compra.']
      };
    }

    const resena = new Resena({
      compraId: datos.compraId,
      eventoId: datos.eventoId || compra.eventoId,
      compradorId: datos.compradorId,
      puntaje: datos.puntaje,
      comentario: datos.comentario
    });

    const validacion = resena.validar();
    if (!validacion.valido) {
      return { exito: false, errores: validacion.errores };
    }

    const guardado = this._resenaRepositorio.guardar(resena);
    return { exito: true, resena: guardado };
  }

  /**
   * Obtiene las resenas de un evento.
   * Regla de negocio BR-15: Las resenas se muestran dentro de los eventos del organizador.
   * @param {number|string} eventoId
   * @returns {Resena[]}
   */
  obtenerResenasDeEvento(eventoId) {
    return this._resenaRepositorio.buscarPorEvento(eventoId);
  }

  /**
   * Calcula el puntaje promedio del organizador basado en sus eventos.
   * Regla de negocio BR-18: Promedio de puntajes de las resenas.
   * @param {number|string} organizadorId
   * @returns {number|null} Puntaje promedio o null si no hay resenas
   */
  calcularPuntajePromedioOrganizador(organizadorId) {
    const resenas = this._resenaRepositorio.listarTodos();
    const puntajes = resenas
      .filter(r => {
        const evento = this._eventoRepositorio.buscarPorId(r.eventoId);
        return evento && evento.organizadorId === organizadorId;
      })
      .map(r => r.puntaje);

    if (puntajes.length === 0) return null;
    const suma = puntajes.reduce((acc, p) => acc + p, 0);
    return Math.round((suma / puntajes.length) * 10) / 10;
  }
}


