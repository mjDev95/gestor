import React , { useState } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import { motion } from "framer-motion";
import  { Plus } from 'react-bootstrap-icons';
import { useMonth } from '../../context/monthContext'; 
import { formatearFecha } from '../../utils/formatDate';
import { formatearDinero } from '../../utils/formatMoney';
import { getRangoPeriodo } from '../../utils/formatDate';
import { useModal } from "../../context/ModalContext";
import { useDashboard } from '../../context/dashboardContext';
import Tabs from "../tabs/Tabs";
import {useSwipeTabs } from '../../hooks/useSwipeTabs';

import  './TransactionList.scss'; 

const TransactionList = ({ view = "resumen" }) => {

  const { transactions, loading, error, deleteTransaction } = useGlobalState();
  const { mesSeleccionado, rangoFechas } = useMonth();
  const { handleSaveExpense, user } = useGlobalState();
  const { setActiveSection } = useDashboard();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState(() => {
    if (view === "detalle") return "gastos"; 
    return "todas";
  });
  const isDetalle = view === "detalle";


  // Obtener el rango real de fechas del periodo seleccionado
  const { inicio: fechaInicio, fin: fechaFin } = getRangoPeriodo(mesSeleccionado, rangoFechas);

  // Filtrar las transacciones por el rango de fechas seleccionado
  const transaccionesFiltradas = transactions.actual.filter((transaccion) => {
    return transaccion.fecha >= fechaInicio && transaccion.fecha <= fechaFin;
  });

  const transaccionesOrdenadas = [...transaccionesFiltradas].sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha); // Ordenar por fecha descendente
  });

  // Función para renderizar la lista de transacciones
  const renderLista = (lista) => (
    <ul className="px-0">
      {lista.length === 0 ? (
        <li className="transaction-item py-2 border-0 list-group-item">
          <p>No tienes transacciones registradas para este periodo.</p>
        </li>
      ) : (
        <>
          {lista.map((transaction) => (
            <li key={transaction.id} className="transaction-item py-2 border-0 list-group-item">
              <div className='d-flex justify-content-between align-items-center'>
                <div className='info-transacciones'>
                  <h5 className='mb-1 h5'>{transaction.nombre}</h5>
                  <p className='small mb-0'>{formatearFecha(transaction.fecha)}</p>
                </div>
                <div className='form-pago'>
                  <p className='small mb-0'>{transaction.formaPago}</p>
                </div>
                <div className='cost'>
                  <p className={`h6 mb-0 ${transaction.tipo === 'ingresos' ? 'text-success' : 'text-danger'}`}>
                    {formatearDinero(transaction.monto, transaction.tipo)}
                  </p>
                  <button onClick={() => deleteTransaction(transaction.id)} className="delete-btn btn btn-primary d-none" >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </>
      )}
    </ul>
  );

  const transaccionesRecientes = isDetalle
    ? transaccionesOrdenadas
    : transaccionesOrdenadas.slice(0, 5);

  const gastos = isDetalle
    ? transaccionesOrdenadas.filter(t => t.tipo === "gastos")
    : transaccionesOrdenadas.filter(t => t.tipo === "gastos").slice(0, 5);

  const ingresos = isDetalle
    ? transaccionesOrdenadas.filter(t => t.tipo === "ingresos")
    : transaccionesOrdenadas.filter(t => t.tipo === "ingresos").slice(0, 5);
  
  const ahorros = isDetalle
    ? transaccionesOrdenadas.filter(t => t.tipo === "ahorro")
    : transaccionesOrdenadas.filter(t => t.tipo === "ahorro").slice(0, 5);
    
  // Configuración de tabs
  const tabs = isDetalle
    ? [
        {
          key: "gastos",
          label: "Gastos",
          content: renderLista(gastos)
        },
        {
          key: "ingresos",
          label: "Ingresos",
          content: renderLista(ingresos)
        },
        {
          key: "ahorros",
          label: "Ahorros",
          content: renderLista(ahorros)
        }
      ]
    : [
        {
          key: "todas",
          label: "Todas",
          content: renderLista(transaccionesRecientes)
        },
        {
          key: "gastos",
          label: "Gastos",
          content: renderLista(gastos)
        },
        {
          key: "ingresos",
          label: "Ingresos",
          content: renderLista(ingresos)
        }
      ];


  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });

  if (loading) {
    return <p>Cargando transacciones...</p>;
  }

  if (error) {
    return <p>Error al cargar las transacciones: {error}</p>;
  }

  return (
    <motion.div layoutId="transaction-panel" className={`transactions-list  rounded p-4 ${isDetalle ? "h-100 d-flex flex-column" : ""}`} layout transition={{ duration: 0.5, ease: "easeInOut" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-start mb-0">
          {isDetalle ? "Todas tus transacciones" : "Transacciones recientes"}
        </h2>
        <button className="btn btn-primary rounded px-5 ms-auto me-lg-0 btn-list" onClick={() => isDetalle ? openModal("transaccion", { handleSaveExpense, user }) : setActiveSection("transacciones") } >
          {isDetalle ? ( <> Agregar <Plus size={20} /> </> ) : ( "Ver todas" )}
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={`tabs-content mt-3 dragrable  ${isDetalle ? "overflow-auto flex-grow-1" : ""}`} onTouchStart={handleStart} onTouchEnd={handleEnd} onMouseDown={handleStart} onMouseUp={handleEnd}>
        {(tabs.find(tab => tab.key === activeTab)?.content) || tabs[0].content}
      </div>
    
    </motion.div>
  );
};

export default TransactionList;