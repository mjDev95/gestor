import { useMonth } from "../../context/monthContext";
import { useMeses } from "../../hooks/useMeses";
import { getRangoPeriodo } from "../../utils/formatDate";
import SaludoUsuario from "../../components/saludo/SaludoUsuario";
import SelectorMeses from "../../components/meses/SelectorMeses";
import ResumenFinanciero from "../../components/resumenFinanciero/ResumenFinanciero";
import TransactionList from "../../components/transactions/TransactionList";
import Presupuesto from "../../components/presupuesto/Presupuesto";

function PeriodoActualLabel() {
  const { meses } = useMeses();
  const { rangoFechas, mesSeleccionado } = useMonth();

  if (!mesSeleccionado || !rangoFechas || !meses.length) return null;

  const periodo = getRangoPeriodo(mesSeleccionado, rangoFechas);

  return (
    <div className="text-center text-secondary small mb-2">
      <strong>Periodo actual:</strong> {periodo.inicio} al {periodo.fin}
    </div>
  );
}

function Inicio() {
  return (
    <div className="content-info overflow-y-auto rounded-top-4">
      <main className="px-3 py-5">
        {/* Saludo y selector de meses */}
        <div className="col-md-3 mb-2 mb-md-0">
          <SaludoUsuario />
        </div>
        <div className="row file-tabs sticky-top align-items-center g-0 py-4 py-md-0">
          <div className="col-md-3 mb-2 mb-md-0">
            <PeriodoActualLabel />
          </div>
          <div className="col-md-6 ms-md-auto">
            <SelectorMeses />
          </div>
          <div className="col-md-1">
            {/* Espacio reservado para contenido futuro */}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="row">
          <div className="col-12 col-md-8">
            <ResumenFinanciero />
            <TransactionList />
          </div>
          <div className="col-12 col-md-4 col-xxl-3">
            <Presupuesto />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;