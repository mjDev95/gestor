import React from 'react';
import { useGlobalState } from '../context/GlobalState';

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
      {transactions.length === 0 ? (
        <p>No tienes transacciones registradas.</p>
      ) : (
        <ul className="transactions-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div>
                <strong>{transaction.categoria}:</strong>
                <p>${transaction.cantidad} {transaction.fecha}</p>
                <small>{transaction.descripcion}</small>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
