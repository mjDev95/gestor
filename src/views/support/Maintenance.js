import React from "react";
import stayImage from "../../assets/img/code.jpg";

function Maintenance() {
  return (
    <div className="container vw-100 vh-100 text-center py-5 d-flex flex-column align-items-center justify-content-center">
      <div className="mb-4">
        <img 
          className="img-construccion"
          src={stayImage}
          alt="en construcción" 
          />
      </div>
      <h2 className="fw-bold display-1">¡Algo increíble está en camino!</h2>
      <p className="lead h5">Estamos trabajando para construir una experiencia mejor, más dinámica y personalizada para ti.
Mientras afinamos los últimos detalles, queremos que sepas que cada línea de código, cada ajuste y cada mejora están pensados para ofrecerte lo mejor. ✨
Pronto estaremos listos para sorprenderte. ¡Mantente atento!</p>
    </div>
  );
}

export default Maintenance;