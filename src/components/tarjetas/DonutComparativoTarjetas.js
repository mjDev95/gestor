import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./DonutComparativoTarjetas.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const coloresBase = [
  "#6574ff",
  "#b8f60d",
  "#8103fc",
  "#dc3545",
  "#198754",
  "#ffc107"
];

function buildData(labels = [], values = []) {
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map(
          (_, idx) => coloresBase[idx % coloresBase.length]
        ),
        borderColor: "transparent",
        borderWidth: 3,
        borderRadius: 10,
        offset: 4
      }
    ]
  };
}

const options = {
  cutout: "70%",
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom"
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw}%`
      }
    }
  }
};

const DonutComparativoTarjetas = ({
  credito = {},
  debito = {}
}) => {
  const bancosCredito = Object.keys(credito);
  const valoresCredito = Object.values(credito);

  const bancosDebito = Object.keys(debito);
  const valoresDebito = Object.values(debito);

  return (
    <div className="row mt-5">
      <div className="col-12 col-md-3 text-center">
        <h5 className="mb-3">Tarjetas de Crédito</h5>

        {bancosCredito.length > 0 ? (
          <div className="grafico-donut-tarjeta mx-auto position-relative">
            <Doughnut
              data={buildData(bancosCredito, valoresCredito)}
              options={options}
            />
          </div>
        ) : (
          <p className="text-muted">Sin movimientos en crédito</p>
        )}
      </div>

      <div className="col-12 col-md-3 text-center">
        <h5 className="mb-3">Tarjetas de Débito</h5>

        {bancosDebito.length > 0 ? (
          <div className="grafico-donut-tarjeta mx-auto position-relative">
            <Doughnut
              data={buildData(bancosDebito, valoresDebito)}
              options={options}
            />
          </div>
        ) : (
          <p className="text-muted">Sin movimientos en débito</p>
        )}
      </div>
    </div>
  );
};

export default DonutComparativoTarjetas;