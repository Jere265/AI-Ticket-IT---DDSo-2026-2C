import { Router } from 'express';
import { EventoController } from '../controllers/eventoController.js';

const router = Router();

// Búsqueda, listado, filtros y ordenamiento
router.get('/', EventoController.listarEventos);

// Creación de evento con tipos de entrada
router.post('/', EventoController.crearEvento);

// Detalle del evento
router.get('/:id', EventoController.obtenerEventoPorId);

// Reporte de compras y disponibilidad para el organizador
router.get('/:id/ventas', EventoController.obtenerEstadoVentas);

// Reseñas de un evento
router.get('/:id/resenas', EventoController.obtenerResenasEvento);

export default router;
