export function getGastosPorCategoria(transaccionesGastos, coloresBase = ["#6574ff", "#b8f60d", "#8103fc"]) {
  const categorias = {};
  let colorIndex = 0;

  transaccionesGastos.forEach((transaccion) => {
    const { categoria, monto } = transaccion;
    if (!categorias[categoria]) {
      categorias[categoria] = { monto: 0, color: coloresBase[colorIndex] };
      colorIndex = (colorIndex + 1) % coloresBase.length;
    }
    categorias[categoria].monto += monto;
  });

  return Object.entries(categorias).map(([categoria, { monto, color }]) => ({
    categoria,
    monto,
    color,
  }));
}

export default getGastosPorCategoria;
