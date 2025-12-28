import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { DashboardProvider } from "../context/dashboardContext";
import PUBLIC_ROUTE from "./routes/publicRoutes";
import PROTECTED_ROUTE from "./routes/protectedRoutes";
import ERROR_ROUTE from "./routes/errorRoutes";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRoutes from "./components/DashboardRoutes";
import PageTransition from "../components/transitions/PageTransition";

const Router = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Detectar si estamos dentro del dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={isDashboardRoute ? "/dashboard" : location.pathname}
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

          {/* Ruta protegida con rutas anidadas */}
          <Route
            path={PROTECTED_ROUTE.path}
            element={
              loading ? null : user ? (
                <ProtectedRoute>
                  <DashboardProvider>
                    {PROTECTED_ROUTE.element}
                  </DashboardProvider>
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            {/* Wrapper con DashboardTransition */}
            <Route element={<DashboardRoutes />}>
              {/* Rutas anidadas del dashboard */}
              {PROTECTED_ROUTE.children?.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  index={route.path === ""}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>

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