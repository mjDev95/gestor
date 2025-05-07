export const formatearDinero = (cantidad, tipo = 'ingresos') => {
  const valor = Number(cantidad);

  const formato = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

  return tipo === 'ingresos' ? `+ ${formato}` : `- ${formato}`;
};
  
export const formatAmount = (valor) => {
  return valor % 1 === 0
    ? valor.toLocaleString("es-MX", { maximumFractionDigits: 0 })
    : valor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};