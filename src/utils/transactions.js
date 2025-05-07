export const getMonthTransactions = (transacciones, tipo) =>
    transacciones
      .filter((t) => t.tipo === tipo)
      .reduce((acc, curr) => acc + Number(curr.monto), 0);