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
  