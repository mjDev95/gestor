import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { formatearDinero } from '../../utils/formatMoney';
import { formatearFecha, formatearDiaMesCorto } from '../../utils/formatDate';
import './TransactionList.scss';

const TransactionListMobile = ({ lista, agrupada = false, onEdit, onDelete }) => {
  const [openId, setOpenId] = useState(null);

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
              <div key={transaction.id} className="transaction-item-mobile mb-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-1 h5">{transaction.nombre}</h5>
                      <div className={`h5 mb-0 ms-2 ${transaction.tipo === 'ingresos' ? 'text-success' : 'text-danger'}`}>{formatearDinero(transaction.monto, transaction.tipo)}</div>
                    </div>
                  </div>
                  <button className="btn btn-link actions w-auto p-1 text-decoration-none" onClick={() => setOpenId(openId === transaction.id ? null : transaction.id)} aria-label="Acciones">
                    <span className="fw-bold">⋮</span>
                  </button>
                </div>
                <AnimatePresence>
                  {openId === transaction.id && (
                    <motion.div
                      className="collapse-actions mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="w-100">
                        {transaction.notas && (
                          <div className="small"><b>Descripción:</b> <br/>{transaction.notas}</div>
                        )}
                        {transaction.categoria && (
                          <div className="small"><b>Categoría:</b> <br/>{transaction.categoria}</div>
                        )}
                        {transaction.formaPago && (
                          <div className="small"><b>Forma de pago:</b> <br/>{transaction.formaPago}</div>
                        )}
                      </div>
                      <button className="btn btn-link p-1" onClick={() => onEdit && onEdit(transaction)} aria-label="Editar">
                        <PencilIcon style={{ width: '18px', height: '18px' }} />
                      </button>
                      <button className="btn btn-link p-1" onClick={() => onDelete && onDelete(transaction)} aria-label="Eliminar">
                        <TrashIcon style={{ width: '18px', height: '18px' }} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <li key={transaction.id} className="list-group-item text-main py-4 bg-transparent px-0">
          <div className="d-flex align-items-center justify-content-between">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-1 h5">{transaction.nombre}</h5>
                <div className={`h5 mb-0 ms-2 ${transaction.tipo === 'ingresos' ? 'text-success' : 'text-danger'}`}>{formatearDinero(transaction.monto, transaction.tipo)}</div>
              </div>
              <div className="small">{formatearFecha(transaction.fecha)}</div>
            </div>
            <button className="btn btn-link actions w-auto p-1 text-decoration-none" onClick={() => setOpenId(openId === transaction.id ? null : transaction.id)} aria-label="Acciones">
              <span className="fw-bold">⋮</span>
            </button>
          </div>
          <AnimatePresence>
            {openId === transaction.id && (
              <motion.div
                className="collapse-actions mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-100">
                  {transaction.notas && (
                    <div className="small"><b>Descripción:</b> <br/>{transaction.notas}</div>
                  )}
                  {transaction.categoria && (
                    <div className="small"><b>Categoría:</b> <br/>{transaction.categoria}</div>
                  )}
                  {transaction.formaPago && (
                    <div className="small"><b>Forma de pago:</b> <br/>{transaction.formaPago}</div>
                  )}
                </div>
                <button className="btn btn-link actions p-1" onClick={() => onEdit && onEdit(transaction)} aria-label="Editar">
                  <PencilIcon style={{ width: '18px', height: '18px' }} />
                </button>
                <button className="btn btn-link  actions p-1" onClick={() => onDelete && onDelete(transaction)} aria-label="Eliminar">
                  <TrashIcon style={{ width: '18px', height: '18px' }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
};

export default TransactionListMobile;
