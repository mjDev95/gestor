import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import transactionReducer from './transactionReducer';
import { db } from '../db/firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useMonth  } from './monthContext'; 
import { getRangoPeriodo } from '../utils/formatDate';

const GlobalContext = createContext();

const initialState = {
  transactions: { actual: [], previo: [] },
  loading: true,
  error: null,
  mesAnterior: null,
};

// Función para obtener el presupuesto desde Firebase
const obtenerPresupuesto = async (userId, mesSeleccionado, rangoFechas) => {
  try {
    if (!userId) {
      throw new Error("🚨 userId es obligatorio para obtener el presupuesto.");
    }

    const rango = getRangoPeriodo(mesSeleccionado, rangoFechas);
    const inicioFecha = rango.inicio;
    const finFecha = rango.fin;

    const presupuestoQuery = query(
      collection(db, "presupuestos"),
      where("userId", "==", userId),
      where("fecha", ">=", inicioFecha),
      where("fecha", "<=", finFecha)
    );

    const presupuestoSnapshot = await getDocs(presupuestoQuery);

    return !presupuestoSnapshot.empty ? presupuestoSnapshot.docs[0].data().monto : 0;
  } catch (error) {
    console.error("🚨 Error al obtener presupuesto:", error);
    return 0;
  }
};

// Función para obtener las transacciones del mes
const obtenerTransaccionesMes = async (userId, mesSeleccionado, rangoFechas) => {
  try {
    if (!userId) {
      throw new Error("🚨 userId es obligatorio para obtener las transacciones.");
    }

    const rango = getRangoPeriodo(mesSeleccionado, rangoFechas);
    const inicioFecha = rango.inicio;
    const finFecha = rango.fin;

    console.log("🔍 Consultando transacciones para usuario:", userId, "| Rango:", inicioFecha, "→", finFecha,"|");

    const colecciones = ["gastos", "ingresos"];
    const todas = [];

    for (const col of colecciones) {
      const q = query(
        collection(db, col),
        where("userId", "==", userId),
        where("fecha", ">=", inicioFecha),
        where("fecha", "<=", finFecha)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        todas.push({ id: doc.id, ...doc.data(), tipo: col });
      });
    }

    return todas;
  } catch (error) {
    console.error("🚨 Error al obtener transacciones:", error);
    return [];
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { user } = useAuth();
  const { mesSeleccionado, rangoFechas } = useMonth();
  const [presupuestoFijo, setPresupuestoFijo] = useState(0);

  // Función para cargar las transacciones desde Firebase
  useEffect(() => {
    const fetchTransacciones = async () => {
      if (!user || !rangoFechas || !mesSeleccionado) return

      dispatch({ type: "SET_LOADING" });

      // Calcula el mes anterior en formato YYYY-MM
      const [anio, mes] = mesSeleccionado.split("-");
      const mesAnterior = mes - 1 > 0 ? String(mes - 1).padStart(2, "0") : "12";
      const anioAnterior = mes - 1 > 0 ? anio : anio - 1;
      const mesAnteriorStr = `${anioAnterior}-${mesAnterior}`;
      const periodoAnterior = getRangoPeriodo(mesAnteriorStr, rangoFechas);

      console.log("🔍 Período anterior calculado:", periodoAnterior);

      if (!periodoAnterior) return; // Evitar errores si `null`

      const transaccionesActual = await obtenerTransaccionesMes(user.uid, mesSeleccionado, rangoFechas);
      const transaccionesPrevias = await obtenerTransaccionesMes(user.uid, mesAnteriorStr, rangoFechas);

      dispatch({
        type: "SET_TRANSACTIONS",
        payload: { actual: transaccionesActual, previo: transaccionesPrevias },
      });

      dispatch({ type: "SET_MES_ANTERIOR", payload: periodoAnterior.inicio });  
    };

    fetchTransacciones();
  }, [user, mesSeleccionado, rangoFechas]);

  // Función para cargar el presupuesto desde Firebase
  useEffect(() => {
    const fetchPresupuesto = async () => {
      if (!user?.uid || !rangoFechas) return;

      const presupuestoActual = await obtenerPresupuesto(user.uid, mesSeleccionado, rangoFechas);
      setPresupuestoFijo(presupuestoActual);
    };

    fetchPresupuesto();
  }, [user, mesSeleccionado, rangoFechas]);

  // Función para agregar una transacción
  const addTransaction = async (transaction, tipo) => {
    try {
      if (!transaction.fecha) {
        alert('La fecha es obligatoria y no puede estar vacía.'); // Mostrar alerta
        return; // Detener la ejecución si falta la fecha
      }
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

  // Función para manejar el guardado de un gasto/ingreso
  const handleSaveExpense = async (formData, tipo) => {
    if (!formData.nombre || !formData.monto) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const transaccion = {
      ...formData,
      tipo, // "gasto" o "ingreso"
      userId: user.uid,
    };

    try {
      await addTransaction(transaccion, tipo);
      // El cierre del modal ahora lo maneja el componente que llama a esta función
    } catch (error) {
      alert("Hubo un error al guardar la transacción.");
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
        handleSaveExpense
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
