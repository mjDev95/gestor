import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PUBLIC_ROUTE from "./routes/publicRoutes";
import PROTECTED_ROUTE from "./routes/protectedRoutes";
import ERROR_ROUTE from "./routes/errorRoutes";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "../components/transitions/PageTransition";

const Router = () => {
  const { user, loading } = useAuth(); // Incluye el estado de carga
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={location.pathname}
        location={location}
        isHome={location.pathname === "/"}
        readyToAnimate={!loading}
      >
        <Routes location={location}>
          {/* Rutas públicas */}
          {PUBLIC_ROUTE.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}

          {/* Ruta protegida */}
          <Route
            path={PROTECTED_ROUTE.path}
            element={
              loading ? null : user ? (
                <ProtectedRoute>
                  {PROTECTED_ROUTE.element}
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Ruta de error */}
          <Route
            path={ERROR_ROUTE.path}
            element={ERROR_ROUTE.element}
          />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

export default Router;