import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import eventoRoutes from './src/routes/eventoRoutes.js';
import compraRoutes from './src/routes/compraRoutes.js';
import resenaRoutes from './src/routes/resenaRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import categoriaRoutes from './src/routes/categoriaRoutes.js';
import seedRoutes from './src/routes/seedRoutes.js';
import { seedInitialData } from './src/config/container.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Habilitado para React Native (Web, Expo, Emulador, Dispositivo físico)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    servicio: 'AI Ticket It API',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/eventos', eventoRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api', usuarioRoutes); // Soporte para /api/compradores y /api/organizadores
app.use('/api/categorias', categoriaRoutes);
app.use('/api/seed', seedRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ exito: false, error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ exito: false, error: 'Error interno del servidor' });
});

// Precargar datos de prueba al arrancar para desarrollo
if (process.env.NODE_ENV !== 'test') {
  seedInitialData();
  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`API lista para conectar con React Native en http://localhost:${PORT}/api`);
  });
}

export default app;
