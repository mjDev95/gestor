import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PUBLIC_ROUTE from "./routes/publicRoutes";
import PROTECTED_ROUTE from "./routes/protectedRoutes";
import ERROR_ROUTE from "./routes/errorRoutes";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "../components/transitions/PageTransition";

const Router = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Función para obtener dinámicamente el nombre de la página
  const getPageName = (pathname) => {
    const allRoutes = [
      ...PUBLIC_ROUTE.map((route) => ({ path: route.path, name: route.name })),
      { path: PROTECTED_ROUTE.path, name: PROTECTED_ROUTE.name },
      { path: ERROR_ROUTE.path, name: ERROR_ROUTE.name },
    ];

    const matchedRoute = allRoutes.find((route) => route.path === pathname);

    return matchedRoute ? matchedRoute.name : "Error";
  };

  return (
    <PageTransition location={location} nextPageName={getPageName(location.pathname)} isHome={location.pathname === "/"}>
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
            user ? (
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
  );
};

export default Router;