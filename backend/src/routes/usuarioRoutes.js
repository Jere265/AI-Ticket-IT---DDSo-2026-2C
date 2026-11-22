import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';

const router = Router();

// Compradores
router.post('/compradores', UsuarioController.registrarComprador);
router.get('/compradores', UsuarioController.listarCompradores);
router.get('/compradores/:id', UsuarioController.obtenerCompradorPorId);

// Favoritos del Comprador
router.get('/compradores/:id/favoritos', UsuarioController.obtenerFavoritos);
router.post('/compradores/:id/favoritos', UsuarioController.agregarFavorito);
router.delete('/compradores/:id/favoritos/:eventoId', UsuarioController.removerFavorito);

// Organizadores
router.post('/organizadores', UsuarioController.registrarOrganizador);
router.get('/organizadores', UsuarioController.listarOrganizadores);
router.get('/organizadores/:id', UsuarioController.obtenerOrganizadorPorId);

export default router;
