import React, { createContext, useReducer, useContext, useEffect } from 'react';
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
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
