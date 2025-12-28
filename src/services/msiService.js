import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../db/firebase-config';

/**
 * Guardar un gasto con MSI
 * 1. Guarda el gasto como referencia (no cuenta en presupuesto)
 * 2. Crea las mensualidades individuales en la colección 'msi'
 */
export const guardarGastoConMSI = async (gastoData, userId, tarjeta = null) => {
  try {
    const {
      nombre,
      monto,
      fecha,
      categoria,
      tarjetaId,
      mesesSinIntereses,
      notas
    } = gastoData;

    // 1. Guardar el gasto como REFERENCIA (esMSI: true)
    const gastoReferenciaRef = await addDoc(collection(db, 'gastos'), {
      userId,
      nombre,
      monto, // Monto TOTAL
      fecha,
      categoria,
      tipo: 'gastos',
      formaPago: 'tarjeta',
      tarjetaId,
      esMSI: true, // Flag importante: este gasto NO cuenta en el presupuesto
      mesesSinIntereses,
      notas: notas || '',
      fechaCreacion: new Date().toISOString()
    });

    console.log('✅ Gasto de referencia creado:', gastoReferenciaRef.id);

    // 2. Crear las mensualidades individuales
    const montoPorMes = monto / mesesSinIntereses;
    const mensualidades = [];
    
    // Obtener día de corte de la tarjeta (si existe)
    const diaCorte = tarjeta?.diaCorte ? parseInt(tarjeta.diaCorte) : null;
    const diaPago = tarjeta?.diaPago ? parseInt(tarjeta.diaPago) : null;

    console.log('🔍 Debug MSI - Tarjeta:', {
      banco: tarjeta?.banco,
      diaCorte,
      diaPago,
      fechaCompra: fecha
    });

    for (let i = 0; i < mesesSinIntereses; i++) {
      // Calcular la fecha de vencimiento según el ciclo de la tarjeta
      let fechaVencimiento;
      
      if (diaCorte && diaPago) {
        // Basado en día de corte: calcular en qué ciclo cae esta mensualidad
        const fechaCompra = new Date(fecha);
        const diaCompra = fechaCompra.getDate();
        let mesBase = fechaCompra.getMonth();
        let anioBase = fechaCompra.getFullYear();
        
        // Determinar si la compra entra en el ciclo actual o el siguiente
        if (diaCompra > diaCorte) {
          // Si compraste después del corte, entra en el SIGUIENTE ciclo
          mesBase += 1;
          if (mesBase > 11) {
            mesBase = 0;
            anioBase += 1;
          }
        }
        
        // Calcular el mes de pago para esta mensualidad (i indica cuántos ciclos adelante)
        let mesPago = mesBase + i;
        let anioPago = anioBase;
        
        // Ajustar año si el mes se pasa de 11
        while (mesPago > 11) {
          mesPago -= 12;
          anioPago += 1;
        }
        
        // El día de pago es después del corte
        // Si día de pago < día de corte, el pago es en el mes siguiente al corte
        if (diaPago < diaCorte) {
          mesPago += 1;
          if (mesPago > 11) {
            mesPago = 0;
            anioPago += 1;
          }
        }
        
        // Crear fecha con el día de pago FIJO (evita problemas de desfase)
        fechaVencimiento = new Date(anioPago, mesPago, diaPago);
      } else {
        // Sin día de corte definido: usar mes siguiente a la compra
        const fechaCompra = new Date(fecha);
        let mes = fechaCompra.getMonth() + i + 1;
        let anio = fechaCompra.getFullYear();
        
        while (mes > 11) {
          mes -= 12;
          anio += 1;
        }
        
        fechaVencimiento = new Date(anio, mes, fechaCompra.getDate());
      }
      
      const mensualidad = {
        userId,
        gastoReferenciaId: gastoReferenciaRef.id,
        nombre: `${nombre} (${i + 1}/${mesesSinIntereses})`,
        montoMensual: parseFloat(montoPorMes.toFixed(2)),
        numeroMensualidad: i + 1,
        totalMensualidades: mesesSinIntereses,
        mesVencimiento: fechaVencimiento.toISOString().split('T')[0],
        categoria,
        tarjetaId,
        estado: 'pendiente',
        fechaCompra: fecha,
        fechaCreacion: new Date().toISOString(),
        notas: `Mensualidad ${i + 1} de ${mesesSinIntereses} - ${nombre}`
      };

      console.log(`📅 Mensualidad ${i + 1}: Vence ${fechaVencimiento.toISOString().split('T')[0]}`);

      const mensualidadRef = await addDoc(collection(db, 'msi'), mensualidad);
      mensualidades.push({ id: mensualidadRef.id, ...mensualidad });
    }

    console.log(`✅ ${mesesSinIntereses} mensualidades creadas`);

    return {
      gastoReferenciaId: gastoReferenciaRef.id,
      mensualidades
    };
  } catch (error) {
    console.error('❌ Error al guardar gasto con MSI:', error);
    throw error;
  }
};

/**
 * Obtener mensualidades por tarjeta
 */
export const obtenerMensualidadesPorTarjeta = async (tarjetaId, userId) => {
  try {
    const msiQuery = query(
      collection(db, 'msi'),
      where('userId', '==', userId),
      where('tarjetaId', '==', tarjetaId)
    );

    const snapshot = await getDocs(msiQuery);
    const mensualidades = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Ordenar por fecha de vencimiento
    mensualidades.sort((a, b) => new Date(a.mesVencimiento) - new Date(b.mesVencimiento));

    return mensualidades;
  } catch (error) {
    console.error('❌ Error al obtener mensualidades:', error);
    return [];
  }
};

/**
 * Obtener mensualidades de un mes específico
 */
export const obtenerMensualidadesPorMes = async (userId, mesAnio) => {
  try {
    // mesAnio debe estar en formato "YYYY-MM"
    const inicioMes = `${mesAnio}-01`;
    const [anio, mes] = mesAnio.split('-');
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const finMes = `${mesAnio}-${ultimoDia}`;

    const msiQuery = query(
      collection(db, 'msi'),
      where('userId', '==', userId),
      where('mesVencimiento', '>=', inicioMes),
      where('mesVencimiento', '<=', finMes)
    );

    const snapshot = await getDocs(msiQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error al obtener mensualidades del mes:', error);
    return [];
  }
};

/**
 * Marcar una mensualidad como pagada
 */
export const marcarMensualidadPagada = async (mensualidadId) => {
  try {
    const mensualidadRef = doc(db, 'msi', mensualidadId);
    await updateDoc(mensualidadRef, {
      estado: 'pagado',
      fechaPago: new Date().toISOString()
    });
    console.log('✅ Mensualidad marcada como pagada');
  } catch (error) {
    console.error('❌ Error al marcar mensualidad como pagada:', error);
    throw error;
  }
};

/**
 * Calcular resumen de MSI por tarjeta
 */
export const calcularResumenMSIPorTarjeta = (mensualidades) => {
  const pendientes = mensualidades.filter(m => m.estado === 'pendiente');
  const pagadas = mensualidades.filter(m => m.estado === 'pagado');
  
  const totalComprometido = pendientes.reduce((sum, m) => sum + m.montoMensual, 0);
  
  // Siguiente pago (la mensualidad pendiente más cercana)
  const hoy = new Date();
  const siguientePago = pendientes
    .filter(m => new Date(m.mesVencimiento) >= hoy)
    .sort((a, b) => new Date(a.mesVencimiento) - new Date(b.mesVencimiento))[0];

  // Agrupar por gasto de referencia
  const porGasto = pendientes.reduce((acc, m) => {
    if (!acc[m.gastoReferenciaId]) {
      acc[m.gastoReferenciaId] = {
        nombre: m.nombre.split(' (')[0], // Quitar el " (1/12)"
        mensualidades: [],
        totalPendiente: 0,
        totalPagado: 0
      };
    }
    acc[m.gastoReferenciaId].mensualidades.push(m);
    acc[m.gastoReferenciaId].totalPendiente += m.montoMensual;
    return acc;
  }, {});

  // Agregar pagadas al resumen por gasto
  pagadas.forEach(m => {
    if (porGasto[m.gastoReferenciaId]) {
      porGasto[m.gastoReferenciaId].totalPagado += m.montoMensual;
      porGasto[m.gastoReferenciaId].mensualidades.push(m);
    }
  });

  return {
    totalComprometido,
    cantidadPendientes: pendientes.length,
    cantidadPagadas: pagadas.length,
    siguientePago,
    porGasto: Object.values(porGasto)
  };
};

/**
 * Obtener todas las mensualidades activas del usuario
 */
export const obtenerTodasMensualidadesActivas = async (userId) => {
  try {
    const msiQuery = query(
      collection(db, 'msi'),
      where('userId', '==', userId),
      where('estado', '==', 'pendiente')
    );

    const snapshot = await getDocs(msiQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error al obtener mensualidades activas:', error);
    return [];
  }
};
