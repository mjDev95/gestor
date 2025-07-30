import React from "react";
import TarjetasSwiper from "./TarjetasSwiper";
import "./TarjetasSwiper.scss";

function Tarjetas() {
  // Aquí podrías traer las tarjetas reales desde props, contexto o fetch
  return (
    <main className="p-3 content-info">
      <div className="container-fluid">
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h2 className="mb-0">Mis tarjetas</h2>
            <p className="text-muted mb-0">Gestiona y visualiza todas tus tarjetas bancarias y métodos de pago.</p>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Agregar tarjeta
            </button>
          </div>
        </div>
        <TarjetasSwiper />
      </div>
    </main>
  );
}

export default Tarjetas;