import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from "chart.js";
import { useGlobalState } from "../../context/GlobalState";
import "./Presupuesto.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const Presupuesto = () => {
  const { transactions, loading, presupuestoFijo } = useGlobalState();

  const transaccionesGastos = transactions.actual.filter(
    (transaccion) => transaccion.tipo === "gastos"
  );

  // Calcular los gastos por categoría
  const coloresBase = ["#6574ff", "#b8f60d", "#8103fc"];
  const categorias = {};
  let colorIndex = 0;

  transaccionesGastos.forEach((transaccion) => {
    const { categoria, monto } = transaccion;
    if (!categorias[categoria]) {
      categorias[categoria] = { monto: 0, color: coloresBase[colorIndex] };
      colorIndex = (colorIndex + 1) % coloresBase.length;
    }
    categorias[categoria].monto += monto;
  });

  const gastosPorCategoria = Object.entries(categorias).map(([key, value]) => ({
    categoria: key,
    monto: value.monto,
    color: value.color,
  }));

  // Cálculos
  const totalGastado = gastosPorCategoria.reduce((acc, curr) => acc + curr.monto, 0);
  const disponible = Math.max(presupuestoFijo - totalGastado, 0);
  const porcentajeUtilizado = presupuestoFijo ? Math.min((totalGastado / presupuestoFijo) * 100, 100).toFixed(0) : 0;

  // Datos para el gráfico
  const data = {
    labels: [...gastosPorCategoria.map((g) => g.categoria), "Disponible"],
    datasets: [
      {
        data: [...gastosPorCategoria.map((g) => g.monto), disponible],
        backgroundColor: [...gastosPorCategoria.map((g) => g.color), "#E0E0E0"],
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
    animation: {
      duration: 1500,
      easing: "linear",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `$${value.toLocaleString("es-MX")}`;
          },
        },
      },
    },
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="d-flex flex-column p-4 rounded border-0 presupuesto-card h-100 justify-content-between">
      <div className="titular">
        <h2 className="text-start mb-4">Presupuesto</h2>
        <p>
          <strong>${totalGastado.toLocaleString("es-MX")}</strong> usado de ${presupuestoFijo.toLocaleString("es-MX")}
        </p>
      </div>
      
      <div className="grafico-presupuesto w-100 position-relative px-xxl-5">
        <Doughnut data={data} options={options} />
        <div className="porcentaje-centrado lh-1 position-absolute top-50 start-50 translate-middle text-center">
          <strong className="h4">{porcentajeUtilizado}%</strong>
          <p className="mb-0">usado</p>
        </div>
      </div>
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
    </div>
  );
};

export default Presupuesto;