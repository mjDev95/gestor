import { useDashboard } from "../../context/dashboardContext";
import Inicio from "../../components/inicio/Inicio";
import Maintenance from "../support/Maintenance";
/*import Tarjetas from "../../components/tarjetas/Tarjetas";
import Transacciones from "../../components/transactions/Transacciones";
import Configuracion from "../../components/configuracion/Configuracion";*/

const sections = {
  inicio: Inicio,
  mantenimiento: Maintenance,
  /*tarjetas: Tarjetas,
  transacciones: Transacciones,
  configuracion: Configuracion,*/
};

function ContentDash() {
  const { activeSection } = useDashboard();
  const ActiveComponent = sections[activeSection] || Inicio; 

  return (
    <div className="content-dash flex-md-fill overflow-x-auto ps-md-1 vstack order-0 order-md-1">
      <ActiveComponent />
    </div>
  );
}

export default ContentDash;