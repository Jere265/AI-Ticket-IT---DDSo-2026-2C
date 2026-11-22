import { eventoService, resenaService, compraService } from '../config/container.js';

export class EventoController {
  /**
   * GET /api/eventos
   * Lista o busca eventos con soporte para filtrado por categoría/texto y
   * ordenamiento por precio, fecha o puntaje del organizador (CU 3 y CU 11).
   */
  static async listarEventos(req, res) {
    try {
      const { criterio, categoria, ordenarPor, direccion } = req.query;
      const eventos = eventoService.buscarYOrdenar({
        criterio,
        categoria,
        ordenarPor,
        direccion,
        resenaService
      });

      res.json({
        exito: true,
        cantidad: eventos.length,
        datos: eventos.map(e => e.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/eventos/:id
   * Obtiene el detalle de un evento por ID.
   */
  static async obtenerEventoPorId(req, res) {
    try {
      const { id } = req.params;
      const evento = eventoService.buscarPorId(Number(id) || id);

      if (!evento) {
        return res.status(404).json({ exito: false, error: 'Evento no encontrado' });
      }

      const tiposEntrada = eventoService.obtenerTiposEntrada(evento.id);

      res.json({
        exito: true,
        datos: {
          ...evento.toJSON(),
          tiposEntrada: tiposEntrada.map(t => t.toJSON())
        }
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * POST /api/eventos
   * Crea un nuevo evento con sus tipos de entrada (CU 4).
   */
  static async crearEvento(req, res) {
    try {
      const { tiposEntrada, ...datosEvento } = req.body;
      const resultado = eventoService.crearEvento(datosEvento, tiposEntrada);

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.status(201).json({
        exito: true,
        mensaje: 'Evento creado exitosamente',
        datos: {
          evento: resultado.evento.toJSON(),
          tiposEntrada: resultado.tiposEntrada.map(t => t.toJSON())
        }
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/eventos/:id/ventas
   * Permite al organizador visualizar compras asociadas y disponibilidad por tipo de entrada (CU 2).
   */
  static async obtenerEstadoVentas(req, res) {
    try {
      const { id } = req.params;
      const resultado = eventoService.obtenerEstadoVentas(Number(id) || id, compraService);

      if (!resultado) {
        return res.status(404).json({ exito: false, error: 'Evento no encontrado' });
      }

      res.json({
        exito: true,
        datos: resultado
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/eventos/:id/resenas
   * Obtiene las reseñas del evento.
   */
  static async obtenerResenasEvento(req, res) {
    try {
      const { id } = req.params;
      const resenas = resenaService.obtenerResenasDeEvento(Number(id) || id);

      res.json({
        exito: true,
        cantidad: resenas.length,
        datos: resenas.map(r => r.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }
}
