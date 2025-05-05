import { db } from "./db/firebase-config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

/**
 * Agregar una tarjeta a Firestore
 */
export const agregarTarjeta = async (uid, tarjetaData) => {
    try {
        const tarjetaRef = collection(db, 'tarjetas');
        await addDoc(tarjetaRef, {
            userId: uid,
            nombre: tarjetaData.nombre,
            tipo: tarjetaData.tipo, // Tipo de tarjeta (Crédito o Débito)
            timestamp: new Date()
        });
        console.log('Tarjeta agregada correctamente');
    } catch (error) {
        console.error("Error al agregar la tarjeta", error);
        throw error;
    }
};

/**
 * Obtener las tarjetas del usuario
 */
export const obtenerTarjetas = async (userId) => {
    try {
        const q = query(collection(db, "tarjetas"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const tarjetas = [];
        querySnapshot.forEach((doc) => {
            tarjetas.push({ id: doc.id, ...doc.data() });
        });
        return tarjetas;
    } catch (error) {
        console.error("Error al obtener las tarjetas:", error);
        return [];
    }
};

/**
 * Agregar un gasto a Firestore
 */
export const agregarGasto = async (uid, expenseData) => {
    try {
        const docRef = await addDoc(collection(db, 'gastos'), {
            userId: uid,
            cantidad: expenseData.cantidad,
            categoria: expenseData.categoria,
            fecha: expenseData.fecha,
            descripcion: expenseData.descripcion,
            formaPago: expenseData.formaPago, // Forma de pago
            tarjetaId: expenseData.tarjetaId || null, // ID de la tarjeta si aplica
            timestamp: new Date()
        });
        console.log('Documento agregado con ID:', docRef.id);
    } catch (e) {
        console.error('Error al agregar el gasto:', e);
    }
};
