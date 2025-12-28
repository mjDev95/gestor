import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../db/firebase-config';

// Tarjeta de débito
const tarjetaDebito = {
  nombre: 'Banco Azteca',
  logo: '/img/banks/azteca.svg',
  color: '#00A651',
  alias: 'Nómina'
};

// Tarjetas de crédito
const tarjetasCredito = [
  { nombre: 'Klar', logo: '/img/banks/klar.svg', color: '#FF6B00', limite: 25000 },
  { nombre: 'Nu', logo: '/img/banks/nu.svg', color: '#8A05BE', limite: 50000, principal: true },
  { nombre: 'Banco Azteca', logo: '/img/banks/azteca.svg', color: '#00A651', limite: 35000 },
  { nombre: 'Didi', logo: '/img/banks/didi.svg', color: '#FF7900', limite: 20000 },
];

// Generar tarjetas ficticias
const generarTarjetasFicticias = (userId) => {
  const tarjetas = [];
  const ahora = Timestamp.now();
  
  // 1 tarjeta de débito (Banco Azteca - Nómina)
  tarjetas.push({
    banco: tarjetaDebito.nombre,
    logo: tarjetaDebito.logo,
    terminacion: String(Math.floor(1000 + Math.random() * 9000)),
    vence: '12/29',
    tipo: 'Débito',
    principal: true, // Es la única de débito
    userId,
    fechaAlta: ahora,
    activa: true,
    color: tarjetaDebito.color,
    alias: tarjetaDebito.alias,
  });
  
  // 4 tarjetas de crédito
  tarjetasCredito.forEach((tarjeta, idx) => {
    const mes = String((idx + 1) * 3 % 12 || 12).padStart(2, '0'); // 03, 06, 09, 12
    const año = '30';
    
    tarjetas.push({
      // Campos comunes
      banco: tarjeta.nombre,
      logo: tarjeta.logo,
      terminacion: String(Math.floor(1000 + Math.random() * 9000)),
      vence: `${mes}/${año}`,
      tipo: 'Crédito',
      principal: tarjeta.principal || false,
      userId,
      fechaAlta: ahora,
      activa: true,
      color: tarjeta.color,
      alias: `${tarjeta.nombre} Crédito`,
      
      // Campos exclusivos de crédito
      limiteCredito: tarjeta.limite,
      diaCorte: 10 + (idx * 5), // Días 10, 15, 20, 25
      diaPago: 28 + idx,         // Días 28, 29, 30, 31 (o 1 del siguiente)
      tasaInteres: 0.42 + (idx * 0.05), // 42%, 47%, 52%, 57%
      comisionAnualidad: idx === 1 ? 0 : 500 + (idx * 250), // Nu sin anualidad
      fechaProximaAnualidad: new Timestamp(
        ahora.seconds + (365 * 24 * 60 * 60),
        ahora.nanoseconds
      ),
    });
  });
  
  return tarjetas;
};
// Cargar tarjetas ficticias en Firebase
export const cargarTarjetasFicticias = async (userId) => {
  const tarjetas = generarTarjetasFicticias(userId);
  const coleccion = collection(db, 'tarjetas');
  const tarjetasIds = [];
  
  for (const t of tarjetas) {
    const docRef = await addDoc(coleccion, t);
    tarjetasIds.push({ id: docRef.id, ...t });
  }
  
  console.log('✅ Tarjetas ficticias cargadas:', tarjetasIds.length);
  return tarjetasIds; // Retornar IDs para usar en MSI
};

// Generar MSI ficticios (al menos 5 por tarjeta de crédito)
const generarMSIFicticios = (userId, tarjetasCredito) => {
  const comprasPorTarjeta = [
    // Klar - 6 compras
    { concepto: 'iPhone 15 Pro Max', monto: 28999, meses: 12, categoria: 'Tecnología' },
    { concepto: 'iPad Air M2', monto: 14999, meses: 6, categoria: 'Tecnología' },
    { concepto: 'AirPods Pro 2', monto: 5999, meses: 3, categoria: 'Tecnología' },
    { concepto: 'Bicicleta Eléctrica', monto: 18000, meses: 12, categoria: 'Deportes' },
    { concepto: 'Colchón King Size', monto: 12000, meses: 9, categoria: 'Hogar' },
    { concepto: 'Cafetera Nespresso', monto: 3500, meses: 6, categoria: 'Electrodomésticos' },
    
    // Nu - 6 compras
    { concepto: 'MacBook Air M3', monto: 32999, meses: 18, categoria: 'Tecnología' },
    { concepto: 'Monitor LG 27" 4K', monto: 8999, meses: 6, categoria: 'Tecnología' },
    { concepto: 'Silla Gamer Herman Miller', monto: 15000, meses: 12, categoria: 'Muebles' },
    { concepto: 'Smart TV Samsung 65"', monto: 22000, meses: 12, categoria: 'Entretenimiento' },
    { concepto: 'PlayStation 5 + Juegos', monto: 13500, meses: 9, categoria: 'Entretenimiento' },
    { concepto: 'Curso Online Desarrollo', monto: 6000, meses: 6, categoria: 'Educación' },
    
    // Banco Azteca - 5 compras
    { concepto: 'Refrigerador Samsung', monto: 18000, meses: 12, categoria: 'Electrodomésticos' },
    { concepto: 'Lavadora LG', monto: 12000, meses: 12, categoria: 'Electrodomésticos' },
    { concepto: 'Microondas + Licuadora', monto: 4500, meses: 6, categoria: 'Electrodomésticos' },
    { concepto: 'Sala Moderna 3 Piezas', monto: 20000, meses: 18, categoria: 'Muebles' },
    { concepto: 'Comedor 6 Sillas', monto: 15000, meses: 12, categoria: 'Muebles' },
    
    // Didi - 5 compras
    { concepto: 'Llantas Michelin 4 pzas', monto: 8000, meses: 6, categoria: 'Automotriz' },
    { concepto: 'Seguro Auto Anual', monto: 12000, meses: 12, categoria: 'Seguros' },
    { concepto: 'Mantenimiento Mayor', monto: 6500, meses: 6, categoria: 'Automotriz' },
    { concepto: 'Sistema Audio Pioneer', monto: 5000, meses: 6, categoria: 'Automotriz' },
    { concepto: 'Dashcam + Sensores', monto: 4000, meses: 3, categoria: 'Automotriz' },
  ];
  
  const msiList = [];
  const ahora = new Date();
  
  // Distribuir compras entre tarjetas (6 + 6 + 5 + 5 = 22 compras)
  let compraIdx = 0;
  const comprasPorTarjetaCount = [6, 6, 5, 5];
  
  tarjetasCredito.forEach((tarjeta, tarjetaIdx) => {
    const numCompras = comprasPorTarjetaCount[tarjetaIdx];
    
    for (let i = 0; i < numCompras; i++) {
      const compra = comprasPorTarjeta[compraIdx];
      const montoPorMes = Math.round(compra.monto / compra.meses);
      const mesesPagados = Math.floor(Math.random() * Math.min(compra.meses, 6)); // Máximo 6 meses pagados
      
      // Fecha de compra: hace algunos meses
      const fechaCompra = new Date(ahora);
      fechaCompra.setMonth(fechaCompra.getMonth() - mesesPagados - 1);
      
      // Fecha primer pago: un mes después de la compra
      const fechaPrimerPago = new Date(fechaCompra);
      fechaPrimerPago.setMonth(fechaPrimerPago.getMonth() + 1);
      
      // Fecha último pago
      const fechaUltimoPago = new Date(fechaCompra);
      fechaUltimoPago.setMonth(fechaUltimoPago.getMonth() + compra.meses);
      
      // Próximo pago
      const proximoPago = new Date(fechaPrimerPago);
      proximoPago.setMonth(proximoPago.getMonth() + mesesPagados);
      
      msiList.push({
        userId,
        tarjetaId: tarjeta.id,
        transaccionId: null,
        concepto: compra.concepto,
        montoTotal: compra.monto,
        mesesTotal: compra.meses,
        montoPorMes,
        mesesPagados,
        mesesRestantes: compra.meses - mesesPagados,
        fechaCompra: Timestamp.fromDate(fechaCompra),
        fechaPrimerPago: Timestamp.fromDate(fechaPrimerPago),
        fechaUltimoPago: Timestamp.fromDate(fechaUltimoPago),
        proximoPago: Timestamp.fromDate(proximoPago),
        estado: mesesPagados >= compra.meses ? 'completado' : 'activo',
        categoria: compra.categoria,
        notas: '',
      });
      
      compraIdx++;
    }
  });
  
  return msiList;
};

// Cargar MSI ficticios en Firebase
export const cargarMSIFicticios = async (userId, tarjetasCredito) => {
  const msiList = generarMSIFicticios(userId, tarjetasCredito);
  const coleccion = collection(db, 'msi');
  
  for (const msi of msiList) {
    await addDoc(coleccion, msi);
  }
  
  console.log('✅ MSI ficticios cargados:', msiList.length);
};

// Función helper para cargar solo transacciones
export const cargarDatosFicticiosCompletos = async (userId) => {
  try {
    // 1. Obtener tarjetas de crédito existentes del usuario
    const { getDocs, query, where } = await import('firebase/firestore');
    const tarjetasQuery = query(
      collection(db, 'tarjetas'),
      where('userId', '==', userId),
      where('tipo', '==', 'Crédito')
    );
    
    const tarjetasSnapshot = await getDocs(tarjetasQuery);
    const tarjetasCredito = tarjetasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (tarjetasCredito.length === 0) {
      throw new Error('No se encontraron tarjetas de crédito. Por favor crea tarjetas primero.');
    }
    
    // 2. Cargar transacciones ficticias (10 revolventes + 3 MSI)
    await cargarTransaccionesFicticias(userId, tarjetasCredito);
    
    // 3. Cargar MSI ficticios
    await cargarMSIFicticios(userId, tarjetasCredito);
    
    console.log('✅ Transacciones y MSI ficticios cargados exitosamente');
    return { transaccionesCargadas: true, msiCargados: true };
  } catch (error) {
    console.error('❌ Error al cargar transacciones ficticias:', error);
    throw error;
  }
};

// Generar transacciones ficticias
const generarTransaccionesFicticias = (userId, tarjetasCredito) => {
  const transacciones = [];
  
  // Transacciones revolventes (normales) - 10 transacciones
  const transaccionesRevolventes = [
    { concepto: 'Uber Eats - Cena', monto: 450, categoria: 'Comida' },
    { concepto: 'Netflix Suscripción', monto: 299, categoria: 'Entretenimiento' },
    { concepto: 'Spotify Premium', monto: 115, categoria: 'Entretenimiento' },
    { concepto: 'Amazon - Libros', monto: 850, categoria: 'Compras' },
    { concepto: 'Gasolina Pemex', monto: 1200, categoria: 'Transporte' },
    { concepto: 'Supermercado Soriana', monto: 2500, categoria: 'Alimentos' },
    { concepto: 'Farmacia Guadalajara', monto: 650, categoria: 'Salud' },
    { concepto: 'Coppel - Ropa', monto: 1800, categoria: 'Vestimenta' },
    { concepto: 'Cinépolis - Boletos', monto: 520, categoria: 'Entretenimiento' },
    { concepto: 'Starbucks', monto: 180, categoria: 'Comida' },
  ];
  
  // Transacciones MSI - 3 transacciones
  const transaccionesMSI = [
    { concepto: 'Laptop HP 15"', monto: 18000, meses: 12, categoria: 'Tecnología' },
    { concepto: 'Mueble Recámara', monto: 9500, meses: 9, categoria: 'Muebles' },
    { concepto: 'Licuadora + Batidora', monto: 3200, meses: 6, categoria: 'Electrodomésticos' },
  ];
  
  // Distribuir transacciones entre Diciembre 2025 y Enero 2026
  const fechas = [];
  
  // Diciembre 2025 (5 revolventes)
  for (let i = 1; i <= 5; i++) {
    fechas.push(new Date(2025, 11, Math.floor(Math.random() * 28) + 1));
  }
  
  // Enero 2026 (5 revolventes)
  for (let i = 1; i <= 5; i++) {
    fechas.push(new Date(2026, 0, Math.floor(Math.random() * 28) + 1));
  }
  
  // Agregar transacciones revolventes
  transaccionesRevolventes.forEach((tr, idx) => {
    const tarjeta = tarjetasCredito[idx % tarjetasCredito.length];
    transacciones.push({
      userId,
      tipo: 'gastos',
      monto: tr.monto,
      concepto: tr.concepto,
      categoria: tr.categoria,
      fecha: Timestamp.fromDate(fechas[idx]),
      formaPago: 'Tarjeta',
      banco: tarjeta.banco,
      tipoTarjeta: 'Crédito',
      tarjetaId: tarjeta.id,
      esMSI: false,
      msiId: null,
      descripcion: tr.concepto,
    });
  });
  
  // Agregar transacciones MSI (en Diciembre)
  transaccionesMSI.forEach((tr, idx) => {
    const tarjeta = tarjetasCredito[idx % tarjetasCredito.length];
    const fechaCompra = new Date(2025, 11, 5 + (idx * 3)); // Días 5, 8, 11 de diciembre
    
    transacciones.push({
      userId,
      tipo: 'gastos',
      monto: tr.monto,
      concepto: `${tr.concepto} (${tr.meses} MSI)`,
      categoria: tr.categoria,
      fecha: Timestamp.fromDate(fechaCompra),
      formaPago: 'Tarjeta',
      banco: tarjeta.banco,
      tipoTarjeta: 'Crédito',
      tarjetaId: tarjeta.id,
      esMSI: true,
      msiMeses: tr.meses,
      msiId: null,
      descripcion: tr.concepto,
    });
  });
  
  return transacciones;
};

// Cargar transacciones ficticias en Firebase
export const cargarTransaccionesFicticias = async (userId, tarjetasCredito) => {
  const transacciones = generarTransaccionesFicticias(userId, tarjetasCredito);
  const coleccion = collection(db, 'gastos'); // Guardar directamente en la colección gastos
  
  for (const tr of transacciones) {
    // Convertir el campo 'tipo' al formato esperado por el sistema
    const { tipo, ...transaccionData } = tr;
    
    await addDoc(coleccion, {
      ...transaccionData,
      nombre: tr.concepto, // El sistema usa 'nombre' en lugar de 'concepto'
      fecha: tr.fecha.toDate().toISOString().split('T')[0], // Formato YYYY-MM-DD
    });
  }
  
  console.log('✅ Transacciones ficticias cargadas en gastos:', transacciones.length);
};