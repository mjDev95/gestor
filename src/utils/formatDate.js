export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);

  // Obtenemos día, mes y año
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString('es-ES', { month: 'long' });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const año = fecha.getFullYear();

  return `${dia} ${mesCapitalizado} ${año}`;
};

export const getMesAnterior = (mesStr) => {
  const [anio, mes] = mesStr.split('-').map(Number);
  const fechaAnterior = new Date(anio, mes - 2, 1);
  return `${fechaAnterior.getFullYear()}-${(fechaAnterior.getMonth() + 1).toString().padStart(2, '0')}`;
};

export const getNombreMes = (mesStr) => {
  const [anio, mes] = mesStr.split("-").map(Number);
  const fecha = new Date(anio, mes - 1);
  return fecha.toLocaleString("es-MX", { month: "long" });
};

export const formatearMes = (mesStr) => {
  const [anio, mes] = mesStr.split('-');
  const fecha = new Date(anio, mes - 1, 1);
  const nombreMes = fecha.toLocaleString('default', { month: 'short' }).toUpperCase();
  const anioAbreviado = fecha.getFullYear().toString().slice(-2);
  return `${nombreMes} ${anioAbreviado}`;
};