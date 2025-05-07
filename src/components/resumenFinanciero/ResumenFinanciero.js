import React from "react";
import { useGlobalState } from "../../context/GlobalState";
import { useMonth } from "../../context/monthContext";
import "./ResumenFinanciero.scss";
import { ArrowDownCircle, ArrowUpCircle, Wallet2, Coin } from "react-bootstrap-icons";
import { calcularVariacion } from "../../utils/math";
import { formatAmount } from "../../utils/formatMoney";
import { getNombreMes } from "../../utils/formatDate";
import { getMonthTransactions } from "../../utils/transactions";

const ResumenFinanciero = () => {
  const { transactions, loading, mesAnterior } = useGlobalState(); 
  const { mesSeleccionado } = useMonth();

  if (loading || !mesSeleccionado) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }
  
  console.log("Mes seleccionado:", mesSeleccionado);
  console.log("Mes anterior calculado:", mesAnterior);

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

  return (
    <div className="row resumen-financiero">
      {resumen.map((item, index) => {
        const { Icon, valor, previo } = item;
        const variacion = calcularVariacion(valor, previo);
        const aumento = variacion > 0;
        const colorClase = aumento ? "text-success" : "text-danger";

        return (
          <div key={index} className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div className={`p-4 rounded border-0 resumen-card ${item.clase}`}>
              <div className="d-flex align-items-center gap-3">
                <div className="icon-stage d-flex justify-content-center align-items-center rounded-3">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <h5 className="card-title fw-light h6 mb-1">{item.titulo}</h5>
                  <div className="d-flex d-lg-block align-items-center gap-2">
                    <p className="card-text resumen-valor h6 mb-0 ">
                      ${formatAmount(item.valor)}
                    </p>
                    <p className="d-none card-text resumen-valor h6 mb-0 ">
                      {getNombreMes(mesAnterior)}: ${formatAmount(item.previo)}
                    </p>
                  </div>
                </div>
                <div className="ms-auto mt-auto me-0">
                  {item.titulo !== "Saldo disponible" && (
                    <small className={`badge-resumen rounded-3 px-2 fw-normal d-flex align-items-center gap-1 ${colorClase}`}>
                      {variacion === 0 ? "0%" : `${variacion > 0 ? "+" : ""}${variacion}%`}
                    </small>
                  )}
                </div>
              </div>
              <div className="alerta-resumen mt-3">
                <small className="fw-light">
                  {item.valor === item.previo ? (
                    "Igual que el mes anterior"
                  ) : item.valor > item.previo ? (
                    <>
                      <span className="text-success">
                        ${formatAmount(item.valor - item.previo)}
                      </span>{" "}
                      más que el mes anterior
                    </>
                  ) : (
                    <>
                      <span className="text-danger">
                        ${formatAmount(item.previo - item.valor)}
                      </span>{" "}
                      menos que el mes anterior
                    </>
                  )}
                </small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResumenFinanciero;