import { categoriaService } from '../config/container.js';

export class CategoriaController {
  static async listarCategorias(req, res) {
    try {
      const categorias = categoriaService.listarTodas();
      res.json({ exito: true, datos: categorias.map(c => c.toJSON()) });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async crearCategoria(req, res) {
    try {
      const resultado = categoriaService.crearCategoria(req.body);
      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }
      res.status(201).json({ exito: true, datos: resultado.categoria.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }
}
