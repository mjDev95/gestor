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

const obtenerGastos = async (userId) => {
  try {
    const q = query(collection(db, "gastos"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const gastos = [];
    querySnapshot.forEach((doc) => {
        gastos.push({ id: doc.id, ...doc.data() });
    });
    return gastos;
  } catch (error) {
    console.error('Error al obtener los gastos:', error);
    return [];
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { user } = useAuth();

  // Función para cargar las transacciones desde Firebase
  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;

      dispatch({ type: 'SET_LOADING' }); // Activar el loading

      const gastos = await obtenerGastos(user.uid);
      dispatch({ type: 'SET_TRANSACTIONS', payload: gastos });
    };

    fetchGastos();
  }, [user]); 

  // Función para agregar una transacción
  const addTransaction = (transaction) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: transaction,
    });
  };

  // Función para eliminar una transacción
  const deleteTransaction = (id) => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id,
    });
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
