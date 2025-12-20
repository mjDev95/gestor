import React from "react";

const PresupuestoLegend = ({ gastosPorCategoria }) => {
  return (
    <div className="desglose-categorias">
      <ul className="list-unstyled">
        {gastosPorCategoria.map((gasto, idx) => (
          <li key={idx} className="mb-0 small fw-light">
            <span
              style={{
                backgroundColor: gasto.color,
                width: 12,
                height: 12,
                display: "inline-block",
                borderRadius: "50%",
                marginRight: 8,
              }}
            ></span>
            <strong>{gasto.categoria}:</strong> ${gasto.monto.toLocaleString("es-MX")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PresupuestoLegend;
