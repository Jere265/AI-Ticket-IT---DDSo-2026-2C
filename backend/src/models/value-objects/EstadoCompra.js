/**
 * Enumeración de estados posibles de una Compra.
 * Según el modelo conceptual del enunciado y reglas de negocio BR-05.
 * Incluye tanto PENDIENTE (diagrama tentativo) como PENDIENTE_PAGO (descripción narrativa).
 */
export const EstadoCompra = {
  PENDIENTE: 'PENDIENTE',
  PENDIENTE_PAGO: 'PENDIENTE_PAGO',
  CONFIRMADA: 'CONFIRMADA',
  UTILIZADA: 'UTILIZADA',
  CANCELADA: 'CANCELADA',
  REEMBOLSADA: 'REEMBOLSADA'
};

/**
 * Valida si un valor es un estado de compra válido.
 * @param {string} estado - Valor a validar
 * @returns {boolean}
 */
EstadoCompra.esValido = function (estado) {
  return Object.values(EstadoCompra).includes(estado);
};

/**
 * Devuelve la lista de todos los estados válidos.
 * @returns {string[]}
 */
EstadoCompra.listarTodos = function () {
  return [
    EstadoCompra.PENDIENTE,
    EstadoCompra.PENDIENTE_PAGO,
    EstadoCompra.CONFIRMADA,
    EstadoCompra.UTILIZADA,
    EstadoCompra.CANCELADA,
    EstadoCompra.REEMBOLSADA
  ];
};
