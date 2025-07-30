import React , { useState } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import { motion } from "framer-motion";
import { Plus } from 'react-bootstrap-icons';
import { useMonth } from '../../context/monthContext'; 
import { getRangoPeriodo } from '../../utils/formatDate';
import { useModal } from "../../context/ModalContext";
import { useDashboard } from '../../context/dashboardContext';
import Tabs from "../tabs/Tabs";
import {useSwipeTabs } from '../../hooks/useSwipeTabs';
import TransactionListMobile from './TransactionListMobile';
import TransactionListDesktop from './TransactionListDesktop';

import  './TransactionList.scss'; 

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const TransactionList = ({ view = "resumen" }) => {

  const { transactions, loading, error } = useGlobalState();
  const { mesSeleccionado, rangoFechas } = useMonth();
  const { handleSaveExpense, user } = useGlobalState();
  const { setActiveSection } = useDashboard();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState(() => {
    if (view === "detalle") return "gastos"; 
    return "todas";
  });
  const isDetalle = view === "detalle";
  const isMobile = useIsMobile();


  // Obtener el rango real de fechas del periodo seleccionado
  const { inicio: fechaInicio, fin: fechaFin } = getRangoPeriodo(mesSeleccionado, rangoFechas);

  // Filtrar las transacciones por el rango de fechas seleccionado
  const transaccionesFiltradas = transactions.actual.filter((transaccion) => {
    return transaccion.fecha >= fechaInicio && transaccion.fecha <= fechaFin;
  });

  const transaccionesOrdenadas = [...transaccionesFiltradas].sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha); // Ordenar por fecha descendente
  });

  // Handlers para editar/eliminar (puedes implementar la lógica real)
  const handleEdit = (transaction) => {
    openModal('editar', { transaction });
  };
  const handleDelete = (transaction) => {
    openModal('eliminar', { transaction });
  };

  // Definir tabs antes de usar useSwipeTabs
  const listaTodas = isDetalle ? transaccionesOrdenadas : transaccionesOrdenadas.slice(0, 5);
  const listaGastos = isDetalle ? transaccionesOrdenadas.filter(t => t.tipo === "gastos") : transaccionesOrdenadas.filter(t => t.tipo === "gastos").slice(0, 5);
  const listaIngresos = isDetalle ? transaccionesOrdenadas.filter(t => t.tipo === "ingresos") : transaccionesOrdenadas.filter(t => t.tipo === "ingresos").slice(0, 5);
  const listaAhorros = isDetalle ? transaccionesOrdenadas.filter(t => t.tipo === "ahorro") : transaccionesOrdenadas.filter(t => t.tipo === "ahorro").slice(0, 5);

  const tabs = isDetalle
    ? [
        { key: "gastos", label: "Gastos", content: isMobile ? <TransactionListMobile lista={listaGastos} agrupada onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaGastos} agrupada onEdit={handleEdit} onDelete={handleDelete} /> },
        { key: "ingresos", label: "Ingresos", content: isMobile ? <TransactionListMobile lista={listaIngresos} agrupada onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaIngresos} agrupada onEdit={handleEdit} onDelete={handleDelete} /> },
        { key: "ahorros", label: "Ahorros", content: isMobile ? <TransactionListMobile lista={listaAhorros} agrupada onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaAhorros} agrupada onEdit={handleEdit} onDelete={handleDelete} /> },
      ]
    : [
        { key: "todas", label: "Todas", content: isMobile ? <TransactionListMobile lista={listaTodas} onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaTodas} onEdit={handleEdit} onDelete={handleDelete} /> },
        { key: "gastos", label: "Gastos", content: isMobile ? <TransactionListMobile lista={listaGastos} onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaGastos} onEdit={handleEdit} onDelete={handleDelete} /> },
        { key: "ingresos", label: "Ingresos", content: isMobile ? <TransactionListMobile lista={listaIngresos} onEdit={handleEdit} onDelete={handleDelete} /> : <TransactionListDesktop lista={listaIngresos} onEdit={handleEdit} onDelete={handleDelete} /> },
      ];

  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });

  if (loading) {
    return <p>Cargando transacciones...</p>;
  }

  if (error) {
    return <p>Error al cargar las transacciones: {error}</p>;
  }

  return (
    <motion.div layoutId="transaction-panel" className={`transactions-list rounded ${isDetalle ? "vh-100 d-flex flex-column is-detalle p-0 pt-4" : "p-4"}`} layout transition={{ duration: 0.3, ease: "easeInOut" }}>
      <div className={`d-flex justify-content-between align-items-center mb-4 ${isDetalle ? "px-3" : ""}`} >
        <h2 className="text-start mb-0">
          {isDetalle ? "Movimientos" : "Transacciones recientes"}
        </h2>
        <button className="btn btn-primary rounded px-5 ms-auto me-lg-0 btn-list" onClick={() => isDetalle ? openModal("transaccion", { handleSaveExpense, user }) : setActiveSection("transacciones") } >
          {isDetalle ? ( <> Agregar <Plus size={20} /> </> ) : ( "Ver todas" )}
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={`tabs-content dragrable  ${isDetalle ? "overflow-y-auto overflow-x-hidden flex-grow-1 px-3" : "mt-3 "}`} onTouchStart={handleStart} onTouchEnd={handleEnd} onMouseDown={handleStart} onMouseUp={handleEnd}>
        {(tabs.find(tab => tab.key === activeTab)?.content) || tabs[0].content}
      </div>
    
    </motion.div>
  );
};

export default TransactionList;