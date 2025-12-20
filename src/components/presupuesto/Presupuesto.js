import React, { useMemo } from "react";
import { useGlobalState } from "../../context/GlobalState";
import getGastosPorCategoria from "./getGastosPorCategoria";
import PresupuestoChart from "./PresupuestoChart";
import PresupuestoLegend from "./PresupuestoLegend";
import "./Presupuesto.scss";

const Presupuesto = () => {
  const { transactions, loading, presupuestoFijo } = useGlobalState();

  const transaccionesGastos = useMemo(
    () => transactions.actual.filter((t) => t.tipo === "gastos"),
    [transactions]
  );

  const gastosPorCategoria = useMemo(
    () => getGastosPorCategoria(transaccionesGastos),
    [transaccionesGastos]
  );

  const totalGastado = useMemo(() => gastosPorCategoria.reduce((acc, curr) => acc + curr.monto, 0), [gastosPorCategoria]);
  const disponible = Math.max(presupuestoFijo - totalGastado, 0);
  const porcentajeUtilizado = presupuestoFijo ? Math.min((totalGastado / presupuestoFijo) * 100, 100).toFixed(0) : 0;

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

      <PresupuestoChart gastosPorCategoria={gastosPorCategoria} disponible={disponible} porcentajeUtilizado={porcentajeUtilizado} />
      <PresupuestoLegend gastosPorCategoria={gastosPorCategoria} />
    </div>
  );
};

export default Presupuesto;