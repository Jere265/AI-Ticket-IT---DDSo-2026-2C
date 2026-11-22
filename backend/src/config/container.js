import { EventoRepository } from '../repositories/EventoRepository.js';
import { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';
import { CompraRepository } from '../repositories/CompraRepository.js';
import { CambioEstadoCompraRepository } from '../repositories/CambioEstadoCompraRepository.js';
import { CompradorRepository } from '../repositories/CompradorRepository.js';
import { OrganizadorRepository } from '../repositories/OrganizadorRepository.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';
import { MensajeRepository } from '../repositories/MensajeRepository.js';
import { ResenaRepository } from '../repositories/ResenaRepository.js';

import { EventoService } from '../services/EventoService.js';
import { CompraService } from '../services/CompraService.js';
import { CompradorService } from '../services/CompradorService.js';
import { OrganizadorService } from '../services/OrganizadorService.js';
import { UsuarioService } from '../services/UsuarioService.js';
import { CategoriaService } from '../services/CategoriaService.js';
import { MensajeService } from '../services/MensajeService.js';
import { ResenaService } from '../services/ResenaService.js';

import { Organizador } from '../models/Organizador.js';
import { Comprador } from '../models/Comprador.js';
import { Categoria } from '../models/Categoria.js';
import { Evento } from '../models/Evento.js';
import { TipoEntrada } from '../models/TipoEntrada.js';

// Repositorios compartidos (persistencia en memoria)
export const eventoRepository = new EventoRepository();
export const tipoEntradaRepository = new TipoEntradaRepository();
export const compraRepository = new CompraRepository();
export const cambioEstadoCompraRepository = new CambioEstadoCompraRepository();
export const compradorRepository = new CompradorRepository();
export const organizadorRepository = new OrganizadorRepository();
export const usuarioRepository = new UsuarioRepository();
export const categoriaRepository = new CategoriaRepository();
export const mensajeRepository = new MensajeRepository();
export const resenaRepository = new ResenaRepository();

// Servicios compartidos
export const eventoService = new EventoService(eventoRepository, tipoEntradaRepository);
export const compraService = new CompraService(compraRepository, tipoEntradaRepository, eventoRepository, cambioEstadoCompraRepository);
export const compradorService = new CompradorService(compradorRepository);
export const organizadorService = new OrganizadorService(organizadorRepository);
export const usuarioService = new UsuarioService(usuarioRepository);
export const categoriaService = new CategoriaService(categoriaRepository);
export const mensajeService = new MensajeService(mensajeRepository, compraRepository);
export const resenaService = new ResenaService(resenaRepository, compraRepository, eventoRepository);

/**
 * Carga datos iniciales para demostración y desarrollo de la app mobile.
 */
export function seedInitialData() {
  // Limpiar repositorios para idempotencia
  eventoRepository._elementos = [];
  tipoEntradaRepository._elementos = [];
  compraRepository._elementos = [];
  cambioEstadoCompraRepository._elementos = [];
  compradorRepository._elementos = [];
  organizadorRepository._elementos = [];
  usuarioRepository._elementos = [];
  categoriaRepository._elementos = [];
  mensajeRepository._elementos = [];
  resenaRepository._elementos = [];

  // Categorías
  const catMusica = categoriaRepository.guardar(new Categoria({ id: 1, nombre: 'Música', descripcion: 'Recitales y festivales en vivo' }));
  const catTeatro = categoriaRepository.guardar(new Categoria({ id: 2, nombre: 'Teatro', descripcion: 'Obras teatrales y comedia' }));
  const catDeportes = categoriaRepository.guardar(new Categoria({ id: 3, nombre: 'Deportes', descripcion: 'Partidos y torneos' }));

  // Organizadores
  const org1 = organizadorRepository.guardar(new Organizador({
    id: 1,
    nombre: 'Producciones Rock & Pop',
    apellido: 'Eventos',
    email: 'contacto@rockypop.com'
  }));
  const org2 = organizadorRepository.guardar(new Organizador({
    id: 2,
    nombre: 'Teatro Gran Vía',
    apellido: 'Cultura',
    email: 'info@granvia.com'
  }));

  // Compradores
  const comp1 = compradorRepository.guardar(new Comprador({
    id: 1,
    nombre: 'Jeremías',
    apellido: 'Pérez',
    email: 'jeremias@test.com'
  }));
  const comp2 = compradorRepository.guardar(new Comprador({
    id: 2,
    nombre: 'Lucía',
    apellido: 'Gómez',
    email: 'lucia@test.com'
  }));

  // Fechas de prueba
  const en15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  const en30Dias = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const hace10Dias = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

  // Evento 1: Recital Futuro
  eventoService.crearEvento({
    organizadorId: org1.id,
    nombre: 'Cosquín Rock 2027',
    descripcion: 'El festival de música más grande del país con más de 50 bandas en escena.',
    categoria: catMusica.nombre,
    fecha: en30Dias,
    multimedia: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800']
  }, [
    { nombre: 'Campo General', precio: 15000, cupoTotal: 500, descripcion: 'Acceso a escenario principal y campo abierto' },
    { nombre: 'VIP Fan Experience', precio: 35000, cupoTotal: 100, descripcion: 'Acceso preferencial, barra libre y catering' }
  ]);

  // Evento 2: Obra Teatral
  eventoService.crearEvento({
    organizadorId: org2.id,
    nombre: 'Toc Toc - Gira Nacional',
    descripcion: 'La comedia récord de espectadores sobre seis personajes con trastornos obsesivos convulsivos.',
    categoria: catTeatro.nombre,
    fecha: en15Dias,
    multimedia: ['https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800']
  }, [
    { nombre: 'Platea Alta', precio: 8000, cupoTotal: 80, descripcion: 'Excelente visión panorámica' },
    { nombre: 'Platea Baja', precio: 12000, cupoTotal: 120, descripcion: 'Fila 1 a 10 frente al escenario' }
  ]);

  // Evento 3: Evento Pasado (para reseñas)
  const evPasadoRes = eventoService.crearEvento({
    organizadorId: org1.id,
    nombre: 'Noche de Jazz en el Parque',
    descripcion: 'Edición aniversario al aire libre.',
    categoria: catMusica.nombre,
    fecha: hace10Dias,
    multimedia: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800']
  }, [
    { nombre: 'Entrada Única', precio: 5000, cupoTotal: 100, descripcion: 'Acceso general' }
  ]);

  // Compra pasada y utilizada para permitir reseña
  if (evPasadoRes.exito && evPasadoRes.tiposEntrada.length > 0) {
    const compraPasada = compraService.crearCompra({
      compradorId: comp1.id,
      eventoId: evPasadoRes.evento.id,
      tipoEntradaId: evPasadoRes.tiposEntrada[0].id,
      cantidad: 2
    });

    if (compraPasada.exito) {
      compraService.marcarComoUtilizada(compraPasada.compra.id);
      resenaService.crearResena({
        compraId: compraPasada.compra.id,
        eventoId: evPasadoRes.evento.id,
        compradorId: comp1.id,
        puntuacion: 5,
        detalle: 'Increíble sonido y puntualidad del organizador. Muy recomendable!'
      });
    }
  }

  // Compras de prueba para Jeremías en evento 1
  const ev1 = eventoRepository.buscarPorId(1);
  const tiposEv1 = tipoEntradaRepository.buscarPorEvento(1);
  if (tiposEv1.length > 0) {
    const compraActual = compraService.crearCompra({
      compradorId: comp1.id,
      eventoId: 1,
      tipoEntradaId: tiposEv1[0].id,
      cantidad: 2
    });

    if (compraActual.exito) {
      mensajeService.enviarMensaje({
        compraId: compraActual.compra.id,
        remitente: 'comprador',
        usuarioId: comp1.id,
        mensaje: 'Hola, ¿a qué hora habilitan el estacionamiento?'
      });
      mensajeService.enviarMensaje({
        compraId: compraActual.compra.id,
        remitente: 'organizador',
        usuarioId: org1.id,
        mensaje: 'Hola Jeremías, se habilita a las 16:00 hs con el código de tu entrada.'
      });
    }
  }

  return {
    mensaje: 'Datos iniciales cargados con éxito',
    categorias: categoriaRepository.listarTodos().length,
    organizadores: organizadorRepository.listarTodos().length,
    compradores: compradorRepository.listarTodos().length,
    eventos: eventoRepository.listarTodos().length,
    compras: compraRepository.listarTodos().length,
    resenas: resenaRepository.listarTodos().length
  };
}
