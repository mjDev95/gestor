import React from "react";
import { motion } from "framer-motion";

/**
 * Transición suave para navegación interna del dashboard
 * Animación más rápida y sutil para cambios frecuentes
 */
const DashboardTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeInOut" 
      }}
      className="h-100"
    >
      {children}
    </motion.div>
  );
};

export default DashboardTransition;
