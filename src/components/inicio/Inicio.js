import React from "react";
import SaludoUsuario from "../../components/saludo/SaludoUsuario";
import DashboardHeader from "../../components/headers/DashboardHeader";
import ResumenFinanciero from "../../components/resumenFinanciero/ResumenFinanciero";
import TransactionList from "../../components/transactions/TransactionList";
import Presupuesto from "../../components/presupuesto/Presupuesto";
import TarjetasResumen from "../../components/tarjetas/TarjetasResumen";

function Inicio() {
  return (
    <main className="p-3 content-info ">
      {/* Contenido principal */}     
      <SaludoUsuario />
      <DashboardHeader />
      <div className="row g-2 g-lg-4">
        <div className="col-12 col-md-8">
            <ResumenFinanciero />
            <TarjetasResumen />
            <TransactionList view="resumen"/>
        </div>
        <div className="col-12 col-md-4 col-xxl-3 mt-2 mt-md-3">
          <Presupuesto />
        </div>
      </div>
    </main>
  );
}

export default Inicio;