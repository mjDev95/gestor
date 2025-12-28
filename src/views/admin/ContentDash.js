import { useDashboard } from "../../context/dashboardContext";
import { useEffect, useRef } from "react";
import Inicio from "../../components/inicio/Inicio";
import Tarjetas from "../../components/tarjetas/Tarjetas";
import Maintenance from "../support/Maintenance";
import Transactions from "../../components/transactions/Transactions";
import { motion, AnimatePresence } from "framer-motion";

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
  const lastScrollTop = useRef(0);
  const sidebarVisible = useRef(true);

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

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const scrollingDown = scrollTop > lastScrollTop.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 5;

    lastScrollTop.current = scrollTop;

    // 📡 Emitimos señal global para el sidebar móvil
    window.dispatchEvent(
      new CustomEvent("dashboard-scroll", {
        detail: {
          scrollingDown,
          isBottom,
          scrollTop,
        },
      })
    );
  };

  return (
    <div  ref={containerRef} className="content-dash overflow-y-scroll h-100 overflow-x-hidden d-flex flex-column flex-md-fill order-0 order-md-1" 
      onScroll={() => {
        handleScroll();
      }}>
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
    </div>
  );
}

export default ContentDash;