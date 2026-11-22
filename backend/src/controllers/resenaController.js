import { resenaService } from '../config/container.js';

export class ResenaController {
  /**
   * POST /api/resenas
   * Permite al comprador calificar una entrada utilizada con puntaje y comentario (CU 9).
   */
  static async crearResena(req, res) {
    try {
      const { compraId, compradorId, eventoId, puntaje, puntuacion, comentario, detalle } = req.body;

      const resultado = resenaService.crearResena({
        compraId: Number(compraId) || compraId,
        compradorId: Number(compradorId) || compradorId,
        eventoId: eventoId ? (Number(eventoId) || eventoId) : undefined,
        puntaje: puntaje !== undefined ? Number(puntaje) : Number(puntuacion),
        puntuacion: puntuacion !== undefined ? Number(puntuacion) : Number(puntaje),
        comentario: comentario !== undefined ? comentario : detalle,
        detalle: detalle !== undefined ? detalle : comentario
      });

      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }

      res.status(201).json({
        exito: true,
        mensaje: 'Reseña registrada con éxito',
        datos: resultado.resena.toJSON()
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  /**
   * GET /api/organizadores/:id/resenas
   * Visualiza las reseñas de eventos anteriores del organizador y su reputación promedio (CU 10).
   */
  static async obtenerResenasOrganizador(req, res) {
    try {
      const { id } = req.params;
      const organizadorId = Number(id) || id;
      const resenas = resenaService.obtenerResenasDeOrganizador(organizadorId);
      const puntajePromedio = resenaService.calcularPuntajePromedioOrganizador(organizadorId);

      res.json({
        exito: true,
        organizadorId,
        puntajePromedio,
        cantidad: resenas.length,
        datos: resenas.map(r => r.toJSON())
      });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }
}
