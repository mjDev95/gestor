import React from "react";
import { motion } from "framer-motion";
import "./PageTransition.scss";

const PageTransition = ({ children }) => {
  return (
    <>
      {/* Animación de entrada */}
      <motion.div
        className="slide-in"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Renderiza el contenido de la página */}
      <div className="page-content">{children}</div>

      {/* Animación de salida */}
      <motion.div
        className="slide-out"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};

export default PageTransition;