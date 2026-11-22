import { Router } from 'express';
import { seedInitialData } from '../config/container.js';

const router = Router();

// Endpoint para cargar datos de prueba ideales para la app móvil
router.post('/', (req, res) => {
  try {
    const resumen = seedInitialData();
    res.json({ exito: true, datos: resumen });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
});

export default router;
