import { useDashboard } from "../../context/dashboardContext";
import { useEffect, useRef } from "react";
import Inicio from "../../components/inicio/Inicio";
import Tarjetas from "../../components/tarjetas/Tarjetas";
import Maintenance from "../support/Maintenance";
import Transactions from "../../components/transactions/Transactions";
import { motion, AnimatePresence } from "framer-motion";

import { Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { useModal } from "../../context/ModalContext";
import { useGlobalState } from "../../context/GlobalState";

/*import Configuracion from "../../components/configuracion/Configuracion";*/

const sections = {
  inicio: Inicio,
  mantenimiento: Maintenance,
  transacciones: Transactions,
  tarjetas: Tarjetas,
  /*configuracion: Configuracion,*/
};

function ContentDash() {
  const { activeSection } = useDashboard();
      const { openModal } = useModal();
      const { handleSaveExpense, user } = useGlobalState();
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
    <div  ref={containerRef} className="content-dash overflow-y-scroll h-100 overflow-x-hidden d-flex flex-column flex-md-fill order-0 order-md-1" >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-100"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
      <button className="btn btn-primary shadow-sm fixed-bottom start-100 m-3 end-0 btn-sidebar add" onClick={() => openModal("transaccion", { handleSaveExpense, user })}>
        <Plus color="green" size={20} />
      </button>
    </div>
  );
}

export default ContentDash;