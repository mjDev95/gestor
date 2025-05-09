import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import transactionReducer from './transactionReducer';
import { db } from '../db/firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useMonth } from './monthContext'; 
import { getMesAnterior } from '../utils/formatDate';

const GlobalContext = createContext();

const initialState = {
  transactions: { actual: [], previo: [] },
  loading: true,
  error: null,
  mesAnterior: null,
};
// Función para obtener el presupuesto desde Firebase
const obtenerPresupuesto = async (mesSeleccionado) => {
  try {
    // Construir el rango de fechas para el mes seleccionado
    const inicioMes = `${mesSeleccionado}-01`; // Ejemplo: "2024-07-01"
    const finMes = `${mesSeleccionado}-31`; // Ejemplo: "2024-07-31"

    const presupuestoQuery = query(
      collection(db, "presupuestos"),
      where("fecha", ">=", inicioMes), // Inicio del mes
      where("fecha", "<=", finMes) // Fin del mes
    );

    const presupuestoSnapshot = await getDocs(presupuestoQuery);

    console.log("Consulta presupuesto:", presupuestoSnapshot.docs); // Depuración

    if (!presupuestoSnapshot.empty) {
      const presupuestoData = presupuestoSnapshot.docs[0].data();
      console.log("Presupuesto encontrado:", presupuestoData); // Depuración
      return presupuestoData.monto; // Retornar el monto del presupuesto
    } else {
      console.log("No se encontró presupuesto para el mes:", mesSeleccionado); // Depuración
      return 0; // Si no hay presupuesto, retornar 0
    }
  } catch (error) {
    console.error("Error al obtener el presupuesto:", error);
    return 0;
  }
};
// Función para obtener las transacciones del mes
const obtenerTransaccionesMes = async (userId, mes) => {
  try {
    const colecciones = ['gastos', 'ingresos'];
    const todas = [];

    for (const col of colecciones) {
      const q = query(
        collection(db, col),
        where("userId", "==", userId),
        where("fecha", ">=", `${mes}-01`),
        where("fecha", "<=", `${mes}-31`)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todas.push({ id: doc.id, ...doc.data(), tipo: col });
      });
    }

    return todas;
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return [];
  }
};



export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { user } = useAuth();
  const { mesSeleccionado } = useMonth();
  const [presupuestoFijo, setPresupuestoFijo] = useState(0);

  // Función para cargar las transacciones desde Firebase
  useEffect(() => {
    const fetchTransacciones = async () => {
      if (!user) return;
  
      dispatch({ type: "SET_LOADING" });
  
      // ✅ Obtenemos los dos meses
      const mesAnterior = getMesAnterior(mesSeleccionado);
  
      // ✅ Llamamos la función dos veces con diferentes meses
      const transaccionesActual = await obtenerTransaccionesMes(user.uid, mesSeleccionado);
      const transaccionesPrevias = await obtenerTransaccionesMes(user.uid, mesAnterior);
  
      dispatch({
        type: "SET_TRANSACTIONS",
        payload: { actual: transaccionesActual, previo: transaccionesPrevias },
      });
  
      dispatch({ type: "SET_MES_ANTERIOR", payload: mesAnterior });
    };
  
    fetchTransacciones();
  }, [user, mesSeleccionado]);

  // Función para cargar el presupuesto desde Firebase
  useEffect(() => {
    const fetchPresupuesto = async () => {
      const monto = await obtenerPresupuesto(mesSeleccionado);
      setPresupuestoFijo(monto); // Actualizar el estado del presupuesto fijo
    };

    fetchPresupuesto();
  }, [mesSeleccionado]);

  // Función para agregar una transacción
  const addTransaction = async (transaction, tipo) => {
    try {
      if (!transaction.fecha) {
        alert('La fecha es obligatoria y no puede estar vacía.'); // Mostrar alerta
        return; // Detener la ejecución si falta la fecha
      }
      console.log('Fecha enviada a Firebase:', transaction.fecha); // Depuración
      const nuevaRef = await addDoc(collection(db, tipo), {
        ...transaction,
        fecha: transaction.fecha,
        userId: user.uid,
      });
  
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: { id: nuevaRef.id, ...transaction, tipo, userId: user.uid },
      });
    } catch (error) {
      console.error('Error al agregar transacción:', error);
    }
  };

  // Función para eliminar una transacción
  const deleteTransaction = async (id, tipo) => {
    try {
      await deleteDoc(doc(db, tipo, id));
      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id,
      });
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        loading: state.loading,
        error: state.error,
        mesAnterior: state.mesAnterior,
        presupuestoFijo,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
