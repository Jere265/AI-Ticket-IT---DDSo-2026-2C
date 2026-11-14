/**
 * Enumeración de estados posibles de una Compra.
 * Regla de negocio BR-05: Toda compra debe encontrarse en uno de los estados definidos.
 */
export const EstadoCompra = {
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
 * Devuelve la lista de todos los estados válidos (solo valores de cadena).
 * @returns {string[]}
 */
EstadoCompra.listarTodos = function () {
  return [
    EstadoCompra.PENDIENTE_PAGO,
    EstadoCompra.CONFIRMADA,
    EstadoCompra.UTILIZADA,
    EstadoCompra.CANCELADA,
    EstadoCompra.REEMBOLSADA
  ];
};

