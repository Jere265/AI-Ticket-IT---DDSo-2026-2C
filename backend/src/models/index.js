/**
 * Índice de exportación del dominio.
 * Centraliza las exportaciones de entidades, value objects, repositorios y DTOs.
 */

// Entidades
export { Usuario } from './Usuario.js';
export { Organizador } from './Organizador.js';
export { Comprador } from './Comprador.js';
export { Categoria } from './Categoria.js';
export { Evento } from './Evento.js';
export { TipoEntrada } from './TipoEntrada.js';
export { Compra } from './Compra.js';
export { CambioEstadoCompra } from './CambioEstadoCompra.js';
export { Mensaje } from './Mensaje.js';
export { Resena, Resenia } from './Resena.js';

// Value objects
export { EstadoCompra } from './value-objects/EstadoCompra.js';

// Repositorios
export { BaseRepository } from '../repositories/BaseRepository.js';
export { UsuarioRepository } from '../repositories/UsuarioRepository.js';
export { OrganizadorRepository } from '../repositories/OrganizadorRepository.js';
export { CompradorRepository } from '../repositories/CompradorRepository.js';
export { CategoriaRepository } from '../repositories/CategoriaRepository.js';
export { EventoRepository } from '../repositories/EventoRepository.js';
export { TipoEntradaRepository } from '../repositories/TipoEntradaRepository.js';
export { CompraRepository } from '../repositories/CompraRepository.js';
export { CambioEstadoCompraRepository } from '../repositories/CambioEstadoCompraRepository.js';
export { MensajeRepository } from '../repositories/MensajeRepository.js';
export { ResenaRepository } from '../repositories/ResenaRepository.js';

// DTOs
export { EventoDTO } from './dtos/EventoDTO.js';
export { CompraDTO } from './dtos/CompraDTO.js';
export { ResenaDTO } from './dtos/ResenaDTO.js';
export { MensajeDTO } from './dtos/MensajeDTO.js';
