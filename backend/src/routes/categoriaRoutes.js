import { Router } from 'express';
import { CategoriaController } from '../controllers/categoriaController.js';

const router = Router();

router.get('/', CategoriaController.listarCategorias);
router.post('/', CategoriaController.crearCategoria);

export default router;
