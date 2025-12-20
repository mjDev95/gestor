import React from "react";
import { useGlobalState } from "../../context/GlobalState";
import { useMonth } from "../../context/monthContext";
import "./ResumenFinanciero.scss";
import { ArrowDownCircle, ArrowUpCircle, Wallet2, Coin } from "react-bootstrap-icons";
import { calcularVariacion } from "../../utils/math";
import { formatAmount } from "../../utils/formatMoney";
import { getRangoPeriodo } from "../../utils/formatDate";
import { getMonthTransactions } from "../../utils/transactions";

const ResumenFinanciero = () => {
  const { transactions, loading, mesAnterior } = useGlobalState(); 
  const { mesSeleccionado, rangoFechas } = useMonth();

  if (loading || !mesSeleccionado) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  const ingresosActual = getMonthTransactions(transactions.actual, "ingresos");
  const ingresosPrevio = getMonthTransactions(transactions.previo, "ingresos");

  const gastosActual = getMonthTransactions(transactions.actual, "gastos");
  const gastosPrevio = getMonthTransactions(transactions.previo, "gastos");

  const ahorroActual = getMonthTransactions(transactions.actual, "ahorro");
  const ahorroPrevio = getMonthTransactions(transactions.previo, "ahorro");

  const saldoActual = ingresosActual - gastosActual;
  const saldoPrevio = ingresosPrevio - gastosPrevio;

  const resumen = [
    {
      titulo: "Saldo disponible",
      valor: saldoActual,
      previo: saldoPrevio,
      clase: "saldo",
      Icon: Wallet2,
    },
    {
      titulo: "Ingresos",
      valor: ingresosActual,
      previo: ingresosPrevio,
      clase: "ingresos",
      Icon: ArrowDownCircle,
    },
    {
      titulo: "Gastos",
      valor: gastosActual,
      previo: gastosPrevio,
      clase: "gastos",
      Icon: ArrowUpCircle,
    },
    {
      titulo: "Ahorros",
      valor: ahorroActual,
      previo: ahorroPrevio,
      clase: "ahorro",
      Icon: Coin,
    },
  ];

  // Calcula el rango del periodo anterior
  const periodoAnterior = mesAnterior && rangoFechas
    ? getRangoPeriodo(mesAnterior, rangoFechas)
    : null;

  return (
    <div className="row g-2 g-lg-4 resumen-financiero justify-content-between align-items-stretch">
      {resumen.map((item, index) => {
        const { Icon, valor, previo } = item;
        const variacion = calcularVariacion(valor, previo);
        const aumento = variacion > 0;
        const colorClase = aumento ? "text-success" : "text-danger";

        return (
          <div key={index} className="col-xxl-3 col-6 mb-0 mb-xxl-4">
            <div className={`d-flex flex-column justify-content-between p-3 p-md-4 rounded border-0 h-100 resumen-card position-relative ${item.clase}`}>
              <div className="d-flex flex-row align-items-center gap-2">
                <div className="icon-stage d-flex justify-content-center align-items-center rounded-3">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="w-100 d-flex justify-content-between align-items-center my-2">
                  <div>
                    <h5 className="card-title fw-light h6 mb-1">{item.titulo}</h5>
                    <p className="card-text resumen-valor h5 mb-0 ">
                      ${formatAmount(item.valor)}
                    </p>
                    <p className="d-none card-text resumen-valor h6 mb-0">
                      {periodoAnterior
                        ? `${periodoAnterior.inicio} a ${periodoAnterior.fin}: ${formatAmount(item.previo)}`
                        : "Periodo anterior no disponible"}
                    </p>
                  </div>
                  <div className="position-absolute top-0 end-0 m-2">
                    {item.titulo !== "Saldo disponible" && (
                      <small className={`badge-resumen rounded-5 px-2 fw-normal d-flex align-items-center ${colorClase}`}>
                        {variacion === 0 ? "0%" : `${variacion > 0 ? "+" : ""}${variacion}%`}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              {/* Solo mostrar alerta-resumen si NO es "Saldo disponible" */}
              {item.titulo !== "Saldo disponible" && (
                <div className="alerta-resumen mt-1">
                  <small className="fw-light lh-1">
                    {item.valor === item.previo ? (
                      "Igual que el periodo anterior"
                    ) : item.valor > item.previo ? (
                      <>
                        <span className="text-success">
                          ${formatAmount(item.valor - item.previo)}
                        </span>{" "}
                        más que el periodo anterior
                      </>
                    ) : (
                      <>
                        <span className="text-danger">
                          ${formatAmount(item.previo - item.valor)}
                        </span>{" "}
                        menos que el periodo anterior
                      </>
                    )}
                  </small>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResumenFinanciero;