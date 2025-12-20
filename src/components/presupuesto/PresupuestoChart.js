import React, { useRef, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PresupuestoChart = ({ gastosPorCategoria, disponible, porcentajeUtilizado }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const chart = chartRef.current;
      if (!chart) return;
      // react-chartjs-2 exposes the chart instance under .current?.chart or .current depending on version
      const instance = chart?.chart ? chart.chart : chart;
      if (instance && typeof instance.resize === "function") {
        try {
          instance.resize();
        } catch (e) {
          instance.update && instance.update();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "linear",
    },
    plugins: {
      legend: { display: false },
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

  return (
    <div className="grafico-presupuesto w-100 position-relative px-xxl-5" style={{ height: 400 }}>
      <Doughnut ref={chartRef} data={data} options={options} />
      <div className="porcentaje-centrado lh-1 position-absolute top-50 start-50 translate-middle text-center">
        <strong className="h4">{porcentajeUtilizado}%</strong>
        <p className="mb-0">usado</p>
      </div>
    </div>
  );
};

export default PresupuestoChart;
