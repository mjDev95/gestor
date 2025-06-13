import { useDashboard } from "../../context/dashboardContext";
import Inicio from "../../components/inicio/Inicio";
import Maintenance from "../support/Maintenance";
import Transactions from "../../components/transactions/Transactions";
import DashboardHeader from "../../components/headers/DashboardHeader";

/*import Tarjetas from "../../components/tarjetas/Tarjetas";
import Configuracion from "../../components/configuracion/Configuracion";*/

const sections = {
  inicio: Inicio,
  mantenimiento: Maintenance,
  transacciones: Transactions,
  /*tarjetas: Tarjetas,*/
  /*configuracion: Configuracion,*/
};

function ContentDash() {
  const { activeSection } = useDashboard();
  const ActiveComponent = sections[activeSection] || Inicio; 

  return (
    <div className="content-dash vh-100 overflow-hidden d-flex flex-column flex-md-fill order-0 order-md-1">
      <DashboardHeader />
      <div className="overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default ContentDash;