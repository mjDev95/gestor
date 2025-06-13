import React from "react";
import ResumenFinanciero from "../../components/resumenFinanciero/ResumenFinanciero";
import TransactionList from "../../components/transactions/TransactionList";
import Presupuesto from "../../components/presupuesto/Presupuesto";

function Inicio() {
  return (
    <main className="p-3 content-info h-100 overflow-y-auto rounded-top-4">
      {/* Contenido principal */}
      <div className="row">
        <div className="col-12 col-md-8">
          <ResumenFinanciero />
          <TransactionList view="resumen"/>
        </div>
        <div className="col-12 col-md-4 col-xxl-3">
          <Presupuesto />
        </div>
      </div>
    </main>
  );
}

export default Inicio;