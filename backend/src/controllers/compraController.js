import { compraService, mensajeService } from '../config/container.js';

export class CompraController {
  /**
   * POST /api/compras
   * Realiza la compra de entradas sobre un tipo disponible y calcula el total (CU 12).
   */
  static async crearCompra(req, res) {
    try {
      const { compradorId, eventoId, tipoEntradaId, cantidad, cantidadEntradas } = req.body;
      const resultado = compraService.crearCompra({
        compradorId: Number(compradorId) || compradorId,
        eventoId: Number(eventoId) || eventoId,
        tipoEntradaId: Number(tipoEntradaId) || tipoEntradaId,
        cantidad: Number(cantidad || cantidadEntradas) || 1
      });

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.status(201).json({
        exito: true,
        mensaje: 'Compra realizada y confirmada con éxito',
        datos: resultado.compra.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/compras/:id
   * Obtiene una compra por ID.
   */
  static async obtenerCompraPorId(req, res) {
    try {
      const { id } = req.params;
      const compra = compraService.buscarPorId(Number(id) || id);

      if (!compra) {
        return res.status(404).json({ exito: false, error: 'Compra no encontrada' });
      }

      res.json({
        exito: true,
        datos: compra.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/compras/comprador/:compradorId
   * Lista las compras del comprador con diferenciación de estado y días restantes (CU 1).
   */
  static async listarComprasComprador(req, res) {
    try {
      const { compradorId } = req.params;
      const comprasDetalladas = compraService.listarComprasDetalladasPorComprador(Number(compradorId) || compradorId);

      res.json({
        exito: true,
        cantidad: comprasDetalladas.length,
        datos: comprasDetalladas.map(c => c.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * POST /api/compras/:id/cancelar
   * Cancela una compra y procesa el reembolso si no está utilizada y el evento no ocurrió (CU 7 y CU 8).
   */
  static async cancelarCompra(req, res) {
    try {
      const { id } = req.params;
      const { quien } = req.body || {};
      const resultado = compraService.cancelarCompra(Number(id) || id, undefined, quien);

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.json({
        exito: true,
        mensaje: 'Compra cancelada y reembolso procesado exitosamente',
        datos: resultado.compra.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * POST /api/compras/:id/utilizar
   * Marca la entrada como utilizada el día del evento (CU 9).
   */
  static async marcarComoUtilizada(req, res) {
    try {
      const { id } = req.params;
      const { quien } = req.body || {};
      const resultado = compraService.marcarComoUtilizada(Number(id) || id, quien);

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.json({
        exito: true,
        mensaje: 'Compra marcada como utilizada',
        datos: resultado.compra.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/compras/:id/historial
   * Obtiene la trazabilidad histórica de estados (CambioEstadoCompra).
   */
  static async obtenerHistorial(req, res) {
    try {
      const { id } = req.params;
      const historial = compraService.obtenerHistorialEstados(Number(id) || id);

      res.json({
        exito: true,
        cantidad: historial.length,
        datos: historial.map(h => h.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/compras/:compraId/mensajes
   * Chat de la compra: lista mensajes en orden cronológico (CU 5 y CU 6).
   */
  static async obtenerMensajesChat(req, res) {
    try {
      const { compraId } = req.params;
      const mensajes = mensajeService.obtenerMensajesDeCompra(Number(compraId) || compraId);

      res.json({
        exito: true,
        cantidad: mensajes.length,
        datos: mensajes.map(m => m.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * POST /api/compras/:compraId/mensajes
   * Envía un mensaje en el chat de la compra (CU 5 y CU 6).
   */
  static async enviarMensajeChat(req, res) {
    try {
      const { compraId } = req.params;
      const { contenido, mensaje, remitente, usuarioId } = req.body;

      const resultado = mensajeService.enviarMensaje({
        compraId: Number(compraId) || compraId,
        contenido: mensaje || contenido,
        mensaje: mensaje || contenido,
        remitente,
        usuarioId
      });

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.status(201).json({
        exito: true,
        mensaje: 'Mensaje enviado exitosamente',
        datos: resultado.mensaje.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }
}
