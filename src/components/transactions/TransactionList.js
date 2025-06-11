import React , { useState } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import  { Plus } from 'react-bootstrap-icons';
import { useMonth } from '../../context/monthContext'; 
import { formatearFecha } from '../../utils/formatDate';
import { formatearDinero } from '../../utils/formatMoney';
import { getRangoPeriodo } from '../../utils/formatDate';
import { useModal } from "../../context/ModalContext";
import Tabs from "../tabs/Tabs";

import  './TransactionList.scss'; 

const TransactionList = () => {
  const { transactions, loading, error, deleteTransaction } = useGlobalState();
  const { mesSeleccionado, rangoFechas } = useMonth();
  const { handleSaveExpense, user } = useGlobalState();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState("todas");


  if (loading) {
    return <p>Cargando transacciones...</p>;
  }

  if (error) {
    return <p>Error al cargar las transacciones: {error}</p>;
  }

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
  // Filtrar por tipo
  const gastos = transaccionesOrdenadas.filter(t => t.tipo === "gastos");
  const ingresos = transaccionesOrdenadas.filter(t => t.tipo === "ingresos");

  // Configuración de tabs
  const tabs = [
    {
      key: "todas",
      label: "Todas",
      content: renderLista(transaccionesOrdenadas)
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

  return (
    <div className="transactions-list rounded p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-start mb-0">Transacciones recientes</h2>
        <button className="btn btn-primary rounded" onClick={() => openModal("transaccion", { handleSaveExpense, user })}>Agregar <Plus size={20} /></button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tabs-content mt-3">
        {(tabs.find(tab => tab.key === activeTab)?.content) || tabs[0].content}
      </div>
    
    </div>
  );
};

export default TransactionList;