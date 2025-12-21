import { motion } from "framer-motion";
import SelectorMeses from "../meses/SelectorMeses";
import { useMonth } from "../../context/monthContext";
import { useMeses } from "../../hooks/useMeses";
import { getRangoPeriodo } from "../../utils/formatDate";
import { useDashboard } from "../../context/dashboardContext";

function PeriodoActualLabel() {
  const { meses } = useMeses();
  const { rangoFechas, mesSeleccionado } = useMonth();

  if (!mesSeleccionado || !rangoFechas || !meses.length) return null;

  const periodo = getRangoPeriodo(mesSeleccionado, rangoFechas);

  return (
    <div className="text-start text-secondary small mb-2">
      <strong>Periodo actual:</strong> {periodo.inicio} al {periodo.fin}
    </div>
  );
}

const DashboardHeader = () => {
  const { activeSection } = useDashboard();

  const isVisible = activeSection === "inicio";

  return (
    <div className={`${isVisible ? "d-block" : "d-none"}`}>
      <div className="row file-tabs sticky-top align-items-center g-0 px-3 pt-4 py-md-0">
        <div className="col-md-3">
          <PeriodoActualLabel />
        </div>

        <div className="col-md-6 ms-md-auto">
          <SelectorMeses />
        </div>
        <div className="col-lg-1">{/* Espacio reservado para contenido futuro */}</div>
      </div>
    </div>
  );
};

export default DashboardHeader;
