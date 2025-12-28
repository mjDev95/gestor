import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../db/firebase-config';

/**
 * Obtener todos los MSI activos del usuario
 */
export const obtenerMSIActivos = async (userId) => {
  try {
    const msiQuery = query(
      collection(db, 'msi'),
      where('userId', '==', userId),
      where('estado', '==', 'activo')
    );
    
    const snapshot = await getDocs(msiQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener MSI activos:', error);
    return [];
  }
};

/**
 * Obtener MSI por tarjeta
 */
export const obtenerMSIPorTarjeta = async (tarjetaId) => {
  try {
    const msiQuery = query(
      collection(db, 'msi'),
      where('tarjetaId', '==', tarjetaId),
      where('estado', '==', 'activo')
    );
    
    const snapshot = await getDocs(msiQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener MSI por tarjeta:', error);
    return [];
  }
};

/**
 * Calcular el total comprometido en MSI para una tarjeta
 */
export const calcularTotalComprometidoMSI = (msiList) => {
  return msiList.reduce((total, msi) => {
    return total + (msi.mesesRestantes * msi.montoPorMes);
  }, 0);
};

/**
 * Calcular el próximo pago total del usuario
 */
export const calcularProximoPagoTotal = (msiList) => {
  return msiList.reduce((total, msi) => {
    return total + msi.montoPorMes;
  }, 0);
};

/**
 * Crear un nuevo MSI
 */
export const crearMSI = async (msiData) => {
  try {
    const {
      userId,
      tarjetaId,
      transaccionId,
      concepto,
      montoTotal,
      meses,
      categoria = '',
      notas = ''
    } = msiData;
    
    const ahora = new Date();
    const montoPorMes = Math.round(montoTotal / meses);
    
    // Calcular fechas
    const fechaCompra = Timestamp.fromDate(ahora);
    
    const fechaPrimerPago = new Date(ahora);
    fechaPrimerPago.setMonth(fechaPrimerPago.getMonth() + 1);
    
    const fechaUltimoPago = new Date(ahora);
    fechaUltimoPago.setMonth(fechaUltimoPago.getMonth() + meses);
    
    const proximoPago = new Date(fechaPrimerPago);
    
    const nuevoMSI = {
      userId,
      tarjetaId,
      transaccionId,
      concepto,
      montoTotal,
      mesesTotal: meses,
      montoPorMes,
      mesesPagados: 0,
      mesesRestantes: meses,
      fechaCompra,
      fechaPrimerPago: Timestamp.fromDate(fechaPrimerPago),
      fechaUltimoPago: Timestamp.fromDate(fechaUltimoPago),
      proximoPago: Timestamp.fromDate(proximoPago),
      estado: 'activo',
      categoria,
      notas
    };
    
    const docRef = await addDoc(collection(db, 'msi'), nuevoMSI);
    return { id: docRef.id, ...nuevoMSI };
  } catch (error) {
    console.error('Error al crear MSI:', error);
    throw error;
  }
};

/**
 * Registrar un pago de MSI
 */
export const registrarPagoMSI = async (msiId, msiData) => {
  try {
    const mesesPagados = msiData.mesesPagados + 1;
    const mesesRestantes = msiData.mesesTotal - mesesPagados;
    
    // Calcular próximo pago
    const proximoPago = new Date(msiData.proximoPago.toDate());
    proximoPago.setMonth(proximoPago.getMonth() + 1);
    
    const updates = {
      mesesPagados,
      mesesRestantes,
      proximoPago: Timestamp.fromDate(proximoPago),
      estado: mesesRestantes === 0 ? 'completado' : 'activo'
    };
    
    await updateDoc(doc(db, 'msi', msiId), updates);
    return updates;
  } catch (error) {
    console.error('Error al registrar pago MSI:', error);
    throw error;
  }
};

/**
 * Obtener resumen de MSI del usuario
 */
export const obtenerResumenMSI = async (userId) => {
  try {
    const msiActivos = await obtenerMSIActivos(userId);
    
    const totalComprometido = calcularTotalComprometidoMSI(msiActivos);
    const proximoPago = calcularProximoPagoTotal(msiActivos);
    const cantidadActivos = msiActivos.length;
    
    // Agrupar por tarjeta
    const porTarjeta = msiActivos.reduce((acc, msi) => {
      if (!acc[msi.tarjetaId]) {
        acc[msi.tarjetaId] = {
          cantidad: 0,
          totalComprometido: 0,
          proximoPago: 0
        };
      }
      acc[msi.tarjetaId].cantidad += 1;
      acc[msi.tarjetaId].totalComprometido += msi.mesesRestantes * msi.montoPorMes;
      acc[msi.tarjetaId].proximoPago += msi.montoPorMes;
      return acc;
    }, {});
    
    return {
      totalComprometido,
      proximoPago,
      cantidadActivos,
      porTarjeta,
      msiList: msiActivos
    };
  } catch (error) {
    console.error('Error al obtener resumen MSI:', error);
    return {
      totalComprometido: 0,
      proximoPago: 0,
      cantidadActivos: 0,
      porTarjeta: {},
      msiList: []
    };
  }
};

/**
 * Calcular disponible real de una tarjeta de crédito considerando MSI
 */
export const calcularDisponibleRealConMSI = async (tarjeta, gastosActuales) => {
  if (tarjeta.tipo !== 'Crédito') {
    return 0;
  }
  
  const msiTarjeta = await obtenerMSIPorTarjeta(tarjeta.id);
  const comprometidoMSI = calcularTotalComprometidoMSI(msiTarjeta);
  
  const limite = tarjeta.limiteCredito || 0;
  const disponibleReal = limite - gastosActuales - comprometidoMSI;
  
  return {
    limite,
    gastosActuales,
    comprometidoMSI,
    disponibleReal,
    porcentajeUso: limite > 0 ? Math.round(((gastosActuales + comprometidoMSI) / limite) * 100) : 0
  };
};

/**
 * Formatear información de una mensualidad para display
 */
export const formatearMensualidad = (mensualidad) => {
  const { numeroMensualidad, totalMensualidades, montoMensual, mesVencimiento, estado } = mensualidad;
  
  return {
    etiqueta: `${numeroMensualidad}/${totalMensualidades}`,
    monto: `$${montoMensual.toFixed(2)}`,
    vencimiento: new Date(mesVencimiento).toLocaleDateString('es-MX', { 
      month: 'short', 
      year: 'numeric' 
    }),
    estaPagada: estado === 'pagado',
    estaPendiente: estado === 'pendiente',
    estaVencida: new Date(mesVencimiento) < new Date() && estado === 'pendiente'
  };
};

/**
 * Agrupar mensualidades por mes
 */
export const agruparMensualidadesPorMes = (mensualidades) => {
  return mensualidades.reduce((acc, mensualidad) => {
    const mes = mensualidad.mesVencimiento.substring(0, 7); // "YYYY-MM"
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(mensualidad);
    return acc;
  }, {});
};

/**
 * Calcular próximo pago de una tarjeta específica
 */
export const calcularProximoPagoTarjeta = (mensualidades) => {
  const hoy = new Date();
  const pendientes = mensualidades.filter(m => 
    m.estado === 'pendiente' && new Date(m.mesVencimiento) >= hoy
  );
  
  if (pendientes.length === 0) return null;
  
  // Ordenar por fecha más cercana
  pendientes.sort((a, b) => new Date(a.mesVencimiento) - new Date(b.mesVencimiento));
  
  const mesProximo = pendientes[0].mesVencimiento.substring(0, 7);
  const mensualidadesDelMes = pendientes.filter(m => m.mesVencimiento.startsWith(mesProximo));
  
  const totalMes = mensualidadesDelMes.reduce((sum, m) => sum + m.montoMensual, 0);
  
  return {
    fecha: pendientes[0].mesVencimiento,
    monto: totalMes,
    cantidad: mensualidadesDelMes.length,
    mensualidades: mensualidadesDelMes
  };
};

/**
 * Validar si una compra cabe en el límite disponible considerando MSI
 */
export const validarCompraMSI = (tarjeta, montoCompra, gastosActuales, mensualidadesPendientes) => {
  if (tarjeta.tipo !== 'Crédito' && tarjeta.tipo !== 'crédito') {
    return {
      valido: false,
      mensaje: 'Solo las tarjetas de crédito permiten MSI'
    };
  }
  
  const limite = tarjeta.limiteCredito || 0;
  const comprometidoMSI = mensualidadesPendientes.reduce((sum, m) => sum + m.montoMensual, 0);
  const disponible = limite - gastosActuales - comprometidoMSI;
  
  if (montoCompra > disponible) {
    return {
      valido: false,
      mensaje: `No tienes suficiente crédito disponible. Disponible: $${disponible.toFixed(2)}`,
      faltante: montoCompra - disponible
    };
  }
  
  return {
    valido: true,
    disponibleDespues: disponible - montoCompra
  };
};
