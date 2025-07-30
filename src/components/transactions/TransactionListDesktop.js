import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { formatearDinero } from '../../utils/formatMoney';
import { formatearFecha, formatearDiaMesCorto } from '../../utils/formatDate';
import './TransactionList.scss';

const TransactionListDesktop = ({ lista, agrupada = false, onEdit, onDelete }) => {
  if (!lista || lista.length === 0) {
    return (
      <ul className="px-0">
        <li className="transaction-item py-2 border-0 list-group-item">
          <p>No tienes transacciones registradas para este periodo.</p>
        </li>
      </ul>
    );
  }

  if (agrupada) {
    const transaccionesAgrupadas = lista.reduce((acc, transaccion) => {
      const clave = formatearDiaMesCorto(transaccion.fecha);
      if (!acc[clave]) acc[clave] = [];
      acc[clave].push(transaccion);
      return acc;
    }, {});

    return (
      <ul className="px-0">
        {Object.entries(transaccionesAgrupadas).map(([fecha, transacciones]) => (
          <li key={fecha} className="list-group-item px-0 py-3">
            <div className="fecha-transaccion fw-bold mb-2 mt-3">{fecha}</div>
            {transacciones.map((transaction) => (
              <div key={transaction.id} className="transaction-item py-2 border-0 list-group-item">
                <div className="row justify-content-between align-items-center">
                  <div className="col-10">
                    <div className="row">
                      <div className="col-6 col-lg-3 info-transacciones">
                        <h5 className="mb-1 h6">{transaction.nombre}</h5>
                      </div>
                      <div className="col-6 col-lg-3 cost me-auto me-lg-0 text-end text-lg-start">
                        <p className={`h6 mb-0 ${transaction.tipo === 'ingresos' ? 'text-success' : 'text-danger'}`}>{formatearDinero(transaction.monto, transaction.tipo)}</p>
                      </div>
                      <div className={`col-4 col-lg-3 form-pago ${transaction.tipo === 'ingresos' ? 'd-none' : ''}`}>
                        <p className="small mb-0">{transaction.formaPago}</p>
                      </div>
                      <div className="col-4 col-lg-3 form-cat">
                        <p className="small mb-0">{transaction.categoria}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    <button className="d-inline-flex align-items-center justify-content-center btn btn-link actions p-1 me-2" onClick={() => onEdit && onEdit(transaction)} aria-label="Editar">
                      <PencilIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                    <button className="d-inline-flex align-items-center justify-content-center btn btn-link actions p-1" onClick={() => onDelete && onDelete(transaction)} aria-label="Eliminar">
                      <TrashIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    );
  }

  // No agrupada
  return (
    <ul className="px-0 list-group list-group-flush">
      {lista.map((transaction) => (
        <li key={transaction.id} className="transaction-item py-2 border-0 list-group-item bg-transparent">
          <div className="row justify-content-between align-items-center text-capitalize">
            <div className="col-lg-3 info-transacciones">
              <h5 className="mb-1 h6">{transaction.nombre}</h5>
            </div>
            <div className="col-6 col-lg-2 info-transacciones">
              <p className='small mb-0'>{formatearFecha(transaction.fecha)}</p>
            </div>
            <div className="col-6 col-lg-2 form-pago">
              <p className="small mb-0">{transaction.categoria}</p>
            </div>
            <div className="col-6 col-lg-2 cost">
              <p className={`h6 mb-0 ${transaction.tipo === 'ingresos' ? 'text-success' : 'text-danger'}`}>{formatearDinero(transaction.monto, transaction.tipo)}</p>
            </div>
            <div className="col-6 col-lg-2 form-pago">
              <p className="small mb-0 ">{transaction.formaPago}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionListDesktop;
