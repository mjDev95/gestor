export function getPorcentajesPorBanco({ tarjetas, transacciones, tipo }) {
  // Filtramos las tarjetas por tipo (Crédito o Débito)
  const tarjetasTipo = tarjetas.filter(t => t.tipo === tipo);

  // Obtenemos una lista única de bancos a partir de las tarjetas filtradas
  const bancos = [...new Set(tarjetasTipo.map(t => t.banco))];

  // Filtramos las transacciones que:
  const transaccionesTipo = transacciones.filter(
    tr => tr.formaPago === 'Tarjeta' && tr.tipoTarjeta === tipo
  );

  // Calculamos el monto total gastado con ese tipo de tarjeta
  const total = transaccionesTipo.reduce(
    (acc, tr) => acc + (tr.monto || 0),
    0
  );

  // Objeto donde guardaremos el porcentaje final por banco
  const porcentajes = {};

  // Recorremos cada banco y calculamos cuánto representa
  bancos.forEach(banco => {
    // Sumamos todas las transacciones del banco actual
    const montoBanco = transaccionesTipo
      .filter(tr => tr.banco === banco)
      .reduce((acc, tr) => acc + (tr.monto || 0), 0);

    // Solo calculamos el porcentaje si hay datos válidos
    if (montoBanco > 0 && total > 0) {
      porcentajes[banco] = Math.round((montoBanco / total) * 100);
    }
  });

  // Retornamos un objeto con la estructura: { "BBVA": 40, "Santander": 60 }
  return porcentajes;
}

export function getGastosPorTarjeta(tarjeta, transacciones) {
  // Filtramos transacciones de la tarjeta específica
  const gastos = transacciones.filter(tr => {
    return tr.banco === tarjeta.banco && tr.tipoTarjeta === tarjeta.tipo && tr.formaPago === 'Tarjeta';
  });

  // Sumamos los gastos
  const totalGastos = gastos.reduce((acc, tr) => acc + (tr.monto || 0), 0);

  return {
    total: totalGastos,
    cantidad: gastos.length,
    transacciones: gastos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
  };
}

export function getDetallesTarjeta(tarjeta, transacciones) {
  const gastos = getGastosPorTarjeta(tarjeta, transacciones);
  
  // Calcular límite y disponible según el tipo de tarjeta
  const limite = tarjeta.tipo === 'Crédito' ? (tarjeta.limiteCredito || 0) : 0;
  const disponible = tarjeta.tipo === 'Crédito' 
    ? limite - gastos.total 
    : 0; // Débito no tiene límite/disponible
  
  return {
    id: tarjeta.id,
    banco: tarjeta.banco,
    tipo: tarjeta.tipo,
    terminacion: tarjeta.terminacion,
    vence: tarjeta.vence,
    color: tarjeta.color,
    principal: tarjeta.principal,
    logo: tarjeta.logo,
    alias: tarjeta.alias,
    activa: tarjeta.activa,
    
    // Gastos calculados
    totalGastos: gastos.total,
    cantidadTransacciones: gastos.cantidad,
    transaccionesRecientes: gastos.transacciones.slice(0, 5),
    
    // Límite y disponible (solo para crédito)
    limite,
    saldoDisponible: disponible,
    
    // Campos específicos de crédito
    ...(tarjeta.tipo === 'Crédito' && {
      limiteCredito: tarjeta.limiteCredito,
      diaCorte: tarjeta.diaCorte,
      diaPago: tarjeta.diaPago,
      tasaInteres: tarjeta.tasaInteres,
      comisionAnualidad: tarjeta.comisionAnualidad,
      deudaActual: gastos.total,
      porcentajeUso: limite > 0 ? Math.round((gastos.total / limite) * 100) : 0,
    }),
  };
}
