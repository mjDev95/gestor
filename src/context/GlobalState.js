import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import transactionReducer from './transactionReducer';
import { db } from '../db/firebase-config';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useMonth  } from './monthContext'; 
import { getRangoPeriodo } from '../utils/formatDate';
import { 
  obtenerMensualidadesPorTarjeta, 
  obtenerMensualidadesPorMes,
  calcularResumenMSIPorTarjeta,
  obtenerTodasMensualidadesActivas
} from '../services/msiService';

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

// Función para obtener las tarjetas guardadas en Firebase
const obtenerTarjetas = async (userId) => {
  try {
    if (!userId) {
      throw new Error("🚨 userId es obligatorio para obtener las tarjetas.");
    }

    const tarjetasQuery = query(
      collection(db, "tarjetas"),
      where("userId", "==", userId)
    );

    const tarjetasSnapshot = await getDocs(tarjetasQuery);
    const tarjetas = tarjetasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return tarjetas;
  } catch (error) {
    console.error("🚨 Error al obtener tarjetas:", error);
    return [];
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
  const [tarjetas, setTarjetas] = useState([]);

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

  // Función para cargar tarjetas desde Firebase
  useEffect(() => {
    const fetchTarjetas = async () => {
      if (!user?.uid) return;
      const tarjetasGuardadas = await obtenerTarjetas(user.uid);
      setTarjetas(tarjetasGuardadas);
    };
    fetchTarjetas();
  }, [user]);

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

  // Función para actualizar una transacción
  const updateTransaction = async (transaction, tipo) => {
    try {
      if (!transaction.id) {
        throw new Error('🚨 No se puede editar una transacción sin ID');
      }

      const ref = doc(db, tipo, transaction.id);

      const { id, ...data } = transaction;

      await updateDoc(ref, {
        ...data,
        userId: user.uid
      });

      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: transaction
      });
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
    }
  };

  // Función para manejar el guardado de un gasto/ingreso
  const handleSaveExpense = async (formData, tipo, modo = 'crear') => {
    if (!formData.nombre || !formData.monto) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const transaccion = {
      ...formData,
      tipo,
      userId: user.uid,
    };

    try {
      if (modo === 'editar') {
        await updateTransaction(transaccion, tipo);
      } else {
        await addTransaction(transaccion, tipo);
      }
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

  // Función para agregar una tarjeta
  const addTarjeta = async (tarjetaData) => {
    try {
      // Generar slug único: banco-terminacion
      const toSlug = (str) => str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const banco = toSlug(tarjetaData.banco || tarjetaData.nombre || 'tarjeta');
      const slug = `${banco}-${tarjetaData.terminacion || ''}`;

      const nuevaRef = await addDoc(collection(db, 'tarjetas'), {
        ...tarjetaData,
        slug, // Guardar slug en BD
        userId: user.uid,
      });

      const nuevaTarjeta = { id: nuevaRef.id, ...tarjetaData, slug };
      setTarjetas(prev => [...prev, nuevaTarjeta]);
      
      return true;
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
      return false;
    }
  };

  // Función para actualizar una tarjeta
  const updateTarjeta = async (tarjetaData) => {
    try {
      if (!tarjetaData.id) {
        throw new Error('🚨 No se puede editar una tarjeta sin ID');
      }

      // Generar slug actualizado
      const toSlug = (str) => str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const banco = toSlug(tarjetaData.banco || tarjetaData.nombre || 'tarjeta');
      const slug = `${banco}-${tarjetaData.terminacion || ''}`;

      const ref = doc(db, 'tarjetas', tarjetaData.id);
      const { id, ...data } = tarjetaData;

      await updateDoc(ref, {
        ...data,
        slug, // Actualizar slug en BD
        userId: user.uid
      });

      setTarjetas(prev => 
        prev.map(t => t.id === tarjetaData.id ? { ...t, ...data, slug } : t)
      );
      
      return true;
    } catch (error) {
      console.error('Error al actualizar tarjeta:', error);
      return false;
    }
  };

  // Función para eliminar una tarjeta
  const deleteTarjeta = async (id) => {
    try {
      await deleteDoc(doc(db, 'tarjetas', id));
      setTarjetas(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
      return { 
        success: false, 
        message: error.message || 'Error al eliminar la tarjeta'
      };
    }
  };

  // Función para verificar si una tarjeta tiene transacciones o MSI asociados
  const verificarTarjetaTieneTransacciones = async (tarjetaId) => {
    try {
      // Verificar si hay transacciones asociadas a esta tarjeta (sin filtro de fecha para evitar índice compuesto)
      const gastosQuery = query(
        collection(db, 'gastos'),
        where('userId', '==', user.uid),
        where('tarjetaId', '==', tarjetaId)
      );
      
      const ingresosQuery = query(
        collection(db, 'ingresos'),
        where('userId', '==', user.uid),
        where('tarjetaId', '==', tarjetaId)
      );

      const [gastosSnapshot, ingresosSnapshot] = await Promise.all([
        getDocs(gastosQuery),
        getDocs(ingresosQuery)
      ]);

      console.log('📊 Resultados:', { 
        gastos: gastosSnapshot.size, 
        ingresos: ingresosSnapshot.size 
      });

      const totalTransacciones = gastosSnapshot.size + ingresosSnapshot.size;
      
      if (totalTransacciones > 0) {
        console.log('⚠️ Tarjeta tiene transacciones asociadas');
        return {
          tieneTransacciones: true,
          totalTransacciones,
          mensaje: `Esta tarjeta tiene ${totalTransacciones} transacción${totalTransacciones > 1 ? 'es' : ''} asociada${totalTransacciones > 1 ? 's' : ''}.`
        };
      }

      // Verificar MSI asociados (los MSI son independientes del periodo)
      const msiQuery = query(
        collection(db, 'msi'),
        where('userId', '==', user.uid),
        where('tarjetaId', '==', tarjetaId)
      );
      
      const msiSnapshot = await getDocs(msiQuery);
      
      console.log('💳 MSI encontrados:', msiSnapshot.size);
      
      if (!msiSnapshot.empty) {
        console.log('⚠️ Tarjeta tiene MSI asociados');
        return {
          tieneTransacciones: true,
          totalMSI: msiSnapshot.size,
          mensaje: `Esta tarjeta tiene ${msiSnapshot.size} pago${msiSnapshot.size > 1 ? 's' : ''} a meses sin intereses activo${msiSnapshot.size > 1 ? 's' : ''}.`
        };
      }

      console.log('✅ Tarjeta sin transacciones ni MSI');
      return { tieneTransacciones: false };
    } catch (error) {
      console.error('❌ Error al verificar transacciones:', error);
      return { tieneTransacciones: false, error: error.message };
    }
  };

  // Función para manejar el guardado de una tarjeta
  const handleSaveTarjeta = async (tarjetaData, modo = 'crear') => {
    if (!tarjetaData.banco || !tarjetaData.terminacion) {
      alert("Por favor, complete todos los campos obligatorios.");
      return false;
    }

    try {
      if (modo === 'editar') {
        return await updateTarjeta(tarjetaData);
      } else {
        return await addTarjeta(tarjetaData);
      }
    } catch (error) {
      alert("Hubo un error al guardar la tarjeta.");
      return false;
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
        tarjetas,
        user,
        addTransaction,
        deleteTransaction,
        handleSaveExpense,
        updateTransaction,
        handleSaveTarjeta,
        deleteTarjeta,
        verificarTarjetaTieneTransacciones,
        // Funciones MSI
        obtenerMensualidadesPorTarjeta: (tarjetaId) => obtenerMensualidadesPorTarjeta(tarjetaId, user?.uid),
        obtenerMensualidadesPorMes: (mesAnio) => obtenerMensualidadesPorMes(user?.uid, mesAnio),
        calcularResumenMSIPorTarjeta,
        obtenerTodasMensualidadesActivas: () => obtenerTodasMensualidadesActivas(user?.uid)
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
