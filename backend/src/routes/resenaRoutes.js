import { Router } from 'express';
import { ResenaController } from '../controllers/resenaController.js';

const router = Router();

// Crear reseña para una compra utilizada
router.post('/', ResenaController.crearResena);

// Ver reseñas de eventos anteriores de un organizador y su reputación
router.get('/organizador/:id', ResenaController.obtenerResenasOrganizador);

export default router;
