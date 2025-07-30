export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';

  // Dividir la fecha en partes (año, mes, día)
  const [anio, mes, dia] = fechaISO.split('-');

  // Obtener el nombre del mes en español
  const nombreMes = new Date(anio, mes - 1).toLocaleString('es-ES', { month: 'long' });
  const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  return `${parseInt(dia)} ${mesCapitalizado} ${anio}`; // Formatear como "9 Mayo 2025"
};

export function getRangoPeriodo(mesStr, rangoFechas) {
  const [anio, mes] = mesStr.split('-').map(Number);
  const inicio = parseInt(rangoFechas.inicio, 10);
  const fin = parseInt(rangoFechas.fin, 10);

  // Función para obtener el último día del mes
  const getUltimoDiaMes = (anio, mes) => {
    return new Date(anio, mes, 0).getDate();
  };

  if (inicio <= fin) {
    // Limitar el día fin al último día del mes
    const ultimoDia = getUltimoDiaMes(anio, mes);
    const diaFin = Math.min(fin, ultimoDia);
    const fechaInicio = new Date(anio, mes - 1, inicio);
    const fechaFin = new Date(anio, mes - 1, diaFin);
    return {
      inicio: fechaInicio.toISOString().slice(0, 10),
      fin: fechaFin.toISOString().slice(0, 10),
    };
  } else {
    // Rango cruzado: fin es del siguiente mes (puede ser siguiente año)
    const ultimoDiaMesActual = getUltimoDiaMes(anio, mes);
    const diaInicio = Math.min(inicio, ultimoDiaMesActual);
    const fechaInicio = new Date(anio, mes - 1, diaInicio);

    // Siguiente mes y posible cambio de año
    let siguienteAnio = anio;
    let siguienteMes = mes + 1;
    if (siguienteMes > 12) {
      siguienteMes = 1;
      siguienteAnio += 1;
    }
    const ultimoDiaSiguienteMes = getUltimoDiaMes(siguienteAnio, siguienteMes);
    const diaFin = Math.min(fin, ultimoDiaSiguienteMes);
    const fechaFin = new Date(siguienteAnio, siguienteMes - 1, diaFin);

    return {
      inicio: fechaInicio.toISOString().slice(0, 10),
      fin: fechaFin.toISOString().slice(0, 10),
    };
  }
}

export const getNombreMes = (mesSeleccionado) => {
  if (!mesSeleccionado || typeof mesSeleccionado !== "string") {
    console.error("🚨 Error: mesSeleccionado es inválido:", mesSeleccionado);
    return "Mes no definido";
  }

  const [anio, mes] = mesSeleccionado.split("-").map(Number);
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

export const obtenerMesActual = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${anio}-${mes}`;
};


// Devuelve "12 Jun"
export const formatearDiaMesCorto = (fechaISO) => {
  if (!fechaISO) return "";

  const fecha = new Date(fechaISO);
  const dia = fecha.getDate();
  const nombreMesCorto = fecha.toLocaleString("es-ES", {
    month: "short",
  });

  return `${dia} ${nombreMesCorto.charAt(0).toUpperCase()}${nombreMesCorto.slice(1)}`;
};
