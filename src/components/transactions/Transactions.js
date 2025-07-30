import React from "react";
import TransactionList from "./TransactionList";


function Transactions() {
  return (
      <div className="row px-md-3">
        <div className="col-lg-11 ms-md-auto">
          <TransactionList view="detalle"/>
        </div>
        <div className="col-lg-1">
          {/* Espacio reservado para contenido futuro */}
        </div>
      </div>
    
  );
}

export default Transactions;