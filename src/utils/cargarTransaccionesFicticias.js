import { addDoc, collection } from 'firebase/firestore';
import { db } from '../db/firebase-config';

// Categorías ejemplo
const categoriasGasto = ['Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Ropa'];
const categoriasIngreso = ['Sueldo', 'Venta', 'Regalo', 'Intereses', 'Otro'];
const categoriasAhorro = ['Banco', 'Inversión', 'Guardado', 'Fondo emergencia', 'Caja chica'];

const formasDePago = ['Efectivo', 'Tarjeta', 'Transferencia'];

const generarFecha = (year, month, dayOffset) => {
  const day = String(1 + dayOffset).padStart(2, '0');
  return `${year}-${String(month).padStart(2, '0')}-${day}`;
};

export const cargarTransaccionesFicticias = async (userId) => {
  const inicio = new Date(2024, 5); // Junio 2024
  const fin = new Date(2025, 11);  // Diciembre 2025
  const transacciones = {
    gastos: [],
    ingresos: [],
    ahorro: []
  };

  let current = new Date(inicio);

  while (current <= fin) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;

    // Sueldo fijo en ingresos
    transacciones.ingresos.push({
      nombre: 'Sueldo',
      monto: 15000,
      fecha: generarFecha(year, month, 0),
      categoria: 'Sueldo',
      userId,
    });

    for (let i = 1; i <= 4; i++) {
      // Gastos
      transacciones.gastos.push({
        nombre: categoriasGasto[i % 5],
        monto: Math.floor(Math.random() * 1000) + 100,
        fecha: generarFecha(year, month, i),
        formaPago: formasDePago[i % 3],
        categoria: categoriasGasto[i % 5],
        userId,
      });

      // Ingresos adicionales
      transacciones.ingresos.push({
        nombre: categoriasIngreso[i % 5],
        monto: Math.floor(Math.random() * 2000) + 500,
        fecha: generarFecha(year, month, i + 1),
        categoria: categoriasIngreso[i % 5],
        userId,
      });

      // Ahorro
      transacciones.ahorro.push({
        nombre: categoriasAhorro[i % 5],
        monto: Math.floor(Math.random() * 3000) + 300,
        fecha: generarFecha(year, month, i + 2),
        categoria: categoriasAhorro[i % 5],
        userId,
      });
    }

    // Avanza al siguiente mes
    current.setMonth(current.getMonth() + 1);
  }

  // Subir a Firebase
  for (const tipo in transacciones) {
    const coleccion = collection(db, tipo);
    for (const t of transacciones[tipo]) {
      await addDoc(coleccion, t);
    }
  }

  console.log('✅ Transacciones ficticias cargadas');
};
