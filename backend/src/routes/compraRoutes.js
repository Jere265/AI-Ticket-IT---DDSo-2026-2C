import { Router } from 'express';
import { CompraController } from '../controllers/compraController.js';

const router = Router();

// Realizar compra
router.post('/', CompraController.crearCompra);

// Ver detalle de una compra
router.get('/:id', CompraController.obtenerCompraPorId);

// Compras del comprador (con días restantes y estado)
router.get('/comprador/:compradorId', CompraController.listarComprasComprador);

// Cancelación de compra y reembolso
router.post('/:id/cancelar', CompraController.cancelarCompra);

// Utilizar entrada (el día del evento)
router.post('/:id/utilizar', CompraController.marcarComoUtilizada);

// Historial y trazabilidad de estados (CambioEstadoCompra)
router.get('/:id/historial', CompraController.obtenerHistorial);

// Chat dentro de la compra
router.get('/:compraId/mensajes', CompraController.obtenerMensajesChat);
router.post('/:compraId/mensajes', CompraController.enviarMensajeChat);

export default router;
