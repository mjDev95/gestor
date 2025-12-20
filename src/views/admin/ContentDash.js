import { useDashboard } from "../../context/dashboardContext";
import { useEffect, useRef } from "react";
import Inicio from "../../components/inicio/Inicio";
import Tarjetas from "../../components/tarjetas/Tarjetas";
import Maintenance from "../support/Maintenance";
import SaludoUsuario from "../../components/saludo/SaludoUsuario";
import Transactions from "../../components/transactions/Transactions";
import DashboardHeader from "../../components/headers/DashboardHeader";

/*import Tarjetas from "../../components/tarjetas/Tarjetas";
import Configuracion from "../../components/configuracion/Configuracion";*/

const sections = {
  inicio: Inicio,
  mantenimiento: Maintenance,
  transacciones: Transactions,
  tarjetas: Tarjetas,
  /*configuracion: Configuracion,*/
};

function ContentDash() {
  const { activeSection } = useDashboard();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // reset vertical scroll to top when activeSection changes
    try {
      el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      el.scrollTop = 0;
    }
  }, [activeSection]);
  const ActiveComponent = sections[activeSection] || Inicio;

  return (
    <div ref={containerRef} className="content-dash overflow-y-scroll h-100 overflow-x-hidden d-flex flex-column flex-md-fill order-0 order-md-1">
      <SaludoUsuario />
      <DashboardHeader />
      <ActiveComponent />
    </div>
  );
}

export default ContentDash;