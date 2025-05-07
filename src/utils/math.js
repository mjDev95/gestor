export const calcularVariacion = (actual, anterior) => {
    if (anterior === 0) {
      return actual === 0 ? 0 : 100;
    }
    const diferencia = actual - anterior;
    const porcentaje = (diferencia / anterior) * 100;
    return Math.round(porcentaje);
};