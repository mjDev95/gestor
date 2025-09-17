import { addDoc, collection } from 'firebase/firestore';
import { db } from '../db/firebase-config';
// Bancos ejemplo para tarjetas
const bancos = [
  { nombre: 'BBVA', logo: '/img/banks/bbva.svg' },
  { nombre: 'Santander', logo: '/img/banks/santander.svg' },
  { nombre: 'Banorte', logo: '/img/banks/banorte.svg' },
  { nombre: 'HSBC', logo: '/img/banks/hsbc.svg' },
  { nombre: 'Citibanamex', logo: '/img/banks/banamex.svg' },
];

// Generar tarjetas ficticias
const generarTarjetasFicticias = (userId) => {
  const tarjetas = [];
  // 5 de débito
  bancos.forEach((banco, idx) => {
    tarjetas.push({
      banco: banco.nombre,
      logo: banco.logo,
      terminacion: String(Math.floor(1000 + Math.random() * 9000)),
      vence: `0${(idx+1)%12+1}/2${8+idx}`,
      tipo: 'Débito',
      principal: idx === 0, // La primera es principal
      userId,
    });
  });
  // 5 de crédito
  bancos.forEach((banco, idx) => {
    tarjetas.push({
      banco: banco.nombre,
      logo: banco.logo,
      terminacion: String(Math.floor(1000 + Math.random() * 9000)),
      vence: `1${(idx+1)%12+1}/2${9+idx}`,
      tipo: 'Crédito',
      principal: idx === 0, // La primera es principal
      userId,
    });
  });
  return tarjetas;
};
// Cargar tarjetas ficticias en Firebase
export const cargarTarjetasFicticias = async (userId) => {
  const tarjetas = generarTarjetasFicticias(userId);
  const coleccion = collection(db, 'tarjetas');
  for (const t of tarjetas) {
    await addDoc(coleccion, t);
  }
  console.log('✅ Tarjetas ficticias cargadas');
};