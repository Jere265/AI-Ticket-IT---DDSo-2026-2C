import { compradorService, organizadorService, usuarioService } from '../config/container.js';

export class UsuarioController {
  // Compradores
  static async registrarComprador(req, res) {
    try {
      const resultado = compradorService.registrar(req.body);
      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }
      res.status(201).json({ exito: true, datos: resultado.comprador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async listarCompradores(req, res) {
    try {
      const compradores = compradorService.listarTodos();
      res.json({ exito: true, datos: compradores.map(c => c.toJSON()) });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async obtenerCompradorPorId(req, res) {
    try {
      const { id } = req.params;
      const comprador = compradorService.buscarPorId(Number(id) || id);
      if (!comprador) {
        return res.status(404).json({ exito: false, error: 'Comprador no encontrado' });
      }
      res.json({ exito: true, datos: comprador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  // Favoritos del Comprador
  static async obtenerFavoritos(req, res) {
    try {
      const { id } = req.params;
      const favoritos = compradorService.obtenerFavoritos(Number(id) || id);
      res.json({ exito: true, datos: favoritos });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async agregarFavorito(req, res) {
    try {
      const { id } = req.params;
      const { eventoId } = req.body;
      const resultado = compradorService.agregarFavorito(Number(id) || id, Number(eventoId) || eventoId);
      if (!resultado.exito) {
        return res.status(400).json({ exito: false, error: resultado.error });
      }
      res.json({ exito: true, mensaje: 'Evento agregado a favoritos', datos: resultado.comprador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async removerFavorito(req, res) {
    try {
      const { id, eventoId } = req.params;
      const resultado = compradorService.removerFavorito(Number(id) || id, Number(eventoId) || eventoId);
      if (!resultado.exito) {
        return res.status(400).json({ exito: false, error: resultado.error });
      }
      res.json({ exito: true, mensaje: 'Evento removido de favoritos', datos: resultado.comprador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  // Organizadores
  static async registrarOrganizador(req, res) {
    try {
      const resultado = organizadorService.registrar(req.body);
      if (!resultado.exito) {
        return res.status(400).json({ exito: false, errores: resultado.errores });
      }
      res.status(201).json({ exito: true, datos: resultado.organizador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async listarOrganizadores(req, res) {
    try {
      const organizadores = organizadorService.listarTodos();
      res.json({ exito: true, datos: organizadores.map(o => o.toJSON()) });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }

  static async obtenerOrganizadorPorId(req, res) {
    try {
      const { id } = req.params;
      const organizador = organizadorService.buscarPorId(Number(id) || id);
      if (!organizador) {
        return res.status(404).json({ exito: false, error: 'Organizador no encontrado' });
      }
      res.json({ exito: true, datos: organizador.toJSON() });
    } catch (error) {
      res.status(500).json({ exito: false, error: error.message });
    }
  }
}
