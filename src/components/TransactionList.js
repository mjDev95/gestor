import React from 'react';
import { useGlobalState } from '../context/GlobalState';
import { formatearFecha } from '../utils/formatDate';
import { formatearDinero } from '../utils/formatMoney';


const TransactionList = () => {
  const { transactions, loading, error, deleteTransaction } = useGlobalState();

  if (loading) {
    return <p>Cargando transacciones...</p>;
  }

  if (error) {
    return <p>Error al cargar las transacciones: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-start mb-4">Transacciones recientes</h2>
      <ul className="transactions-list rounded-4 p-4">
        {transactions.length === 0 ? (
          <li className="transaction-item py-2 border-0 list-group-item">
            <p>No tienes transacciones registradas.</p>
          </li>
        ) : (
          <>
            {transactions
              .slice(-5)  
              .reverse() 
              .map((transaction) => (
                <li key={transaction.id} className="transaction-item py-2 border-0 list-group-item">
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='info-transacciones'>
                      <h5 className='mb-1 h5'>{transaction.nombre}</h5>
                      <p className='small mb-0'>{formatearFecha(transaction.fecha)}</p>
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
    </div>
  );
};

export default TransactionList;
