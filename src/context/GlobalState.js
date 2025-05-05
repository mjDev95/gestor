import React, { createContext, useReducer, useContext, useEffect } from 'react';
import transactionReducer from './transactionReducer';
import { db } from '../db/firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const GlobalContext = createContext();

const initialState = {
  transactions: [], 
  loading: true,
  error: null,
};

const obtenerTransacciones = async (userId) => {
  try {
    const colecciones = ['gastos', 'ingresos'];
    const todas = [];

    for (const col of colecciones) {
      const q = query(collection(db, col), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todas.push({ id: doc.id, ...doc.data(), tipo: col }); // Añadir 'tipo' para identificar
      });
    }

    return todas;
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    return [];
  }
};


export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { user } = useAuth();

  // Función para cargar las transacciones desde Firebase
  useEffect(() => {
    const fetchTransacciones = async () => {
      if (!user) return;
  
      dispatch({ type: 'SET_LOADING' });
      const transacciones = await obtenerTransacciones(user.uid);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transacciones });
    };
  
    fetchTransacciones();
  }, [user]);

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
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
