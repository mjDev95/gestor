import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DashboardTransition from "../../components/transitions/DashboardTransition";

/**
 * Wrapper para las rutas del dashboard
 * Aplica DashboardTransition a todas las rutas hijas
 */
const DashboardRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <DashboardTransition key={location.pathname}>
        <Outlet />
      </DashboardTransition>
    </AnimatePresence>
  );
};

export default DashboardRoutes;
