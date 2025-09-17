import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import './DonutComparativoTarjetas.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const coloresBase = ["#6574ff", "#b8f60d", "#8103fc", "#dc3545", "#198754", "#ffc107"];

function getPorcentajesPorBanco(tarjetas, transacciones, tipo) {
  // Filtra tarjetas por tipo (Crédito/Débito)
  const tarjetasTipo = tarjetas.filter(t => t.tipo === tipo);
  const bancos = [...new Set(tarjetasTipo.map(t => t.banco))];
  // Filtra transacciones por tipoTarjeta
  const transaccionesTipo = transacciones.filter(tr => tr.formaPago === 'Tarjeta' && tr.tipoTarjeta === tipo);
  const total = transaccionesTipo.reduce((acc, tr) => acc + (tr.monto || 0), 0);
  const porcentajes = {};
  bancos.forEach(banco => {
    const montoBanco = transaccionesTipo
      .filter(tr => tr.banco === banco)
      .reduce((acc, tr) => acc + (tr.monto || 0), 0);
    if (montoBanco > 0 && total > 0) {
      porcentajes[banco] = Math.round((montoBanco / total) * 100);
    }
  });
  return porcentajes;
}

const DonutComparativoTarjetas = ({ tarjetas = [], transacciones = [] }) => {
  // Porcentajes para crédito
  const porcentajesCredito = getPorcentajesPorBanco(tarjetas, transacciones, 'Crédito');
  const bancosCredito = Object.keys(porcentajesCredito);
  const valoresCredito = Object.values(porcentajesCredito);

  // Porcentajes para débito
  const porcentajesDebito = getPorcentajesPorBanco(tarjetas, transacciones, 'Débito');
  const bancosDebito = Object.keys(porcentajesDebito);
  const valoresDebito = Object.values(porcentajesDebito);

  const dataCredito = {
    labels: bancosCredito,
    datasets: [
      {
        data: valoresCredito,
        backgroundColor: bancosCredito.map((_, idx) => coloresBase[idx % coloresBase.length]),
        borderColor: "transparent",
        borderWidth: 3,
        borderRadius: 10,
        offset: 4,
      },
    ],
  };

  const dataDebito = {
    labels: bancosDebito,
    datasets: [
      {
        data: valoresDebito,
        backgroundColor: bancosDebito.map((_, idx) => coloresBase[idx % coloresBase.length]),
        borderColor: "transparent",
        borderWidth: 3,
        borderRadius: 10,
        offset: 4,
      },
    ],
  };

  const options = {
    cutout: "70%",
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        displayColors: true,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className="row g-4 mt-4">
      <div className="col-12 col-md-4 text-center">
        <h5 className="mb-3">Tarjetas de Crédito</h5>
        <div className="grafico-donut-tarjeta mx-auto position-relative">
          <Doughnut data={dataCredito} options={options} />
        </div>
      </div>
      <div className="col-12 col-md-4 text-center">
        <h5 className="mb-3">Tarjetas de Débito</h5>
        <div className="grafico-donut-tarjeta mx-auto position-relative">
          <Doughnut data={dataDebito} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DonutComparativoTarjetas;
