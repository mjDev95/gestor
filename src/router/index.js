import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import AuthForm from '../views/login/AuthForm'; 
import Dashboard from '../views/admin/Dashboard';
import PUBLIC_ROUTE from './routes/publicRoutes'; 
import PROTECTED_ROUTE from './routes/protectedRoutes';
import ERROR_ROUTE from './routes/errorRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from "../components/transitions/PageTransition";


const Router = () => {
  const { user, handleLogin, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true); // Controla si la validación inicial está en progreso

  useEffect(() => {
    const validateAuth = async () => {
      // Simula la validación del usuario (puedes reemplazarlo con lógica real)
      setTimeout(() => {
        setLoading(false); // Marca la validación como completa
      }, 1000); // Tiempo para completar la validación
    };

    validateAuth();
  }, []);


  return (
    <PageTransition loading={loading}>
      {loading ? null : (
        <RouterProvider
          router={createBrowserRouter([
            {
              path: "/",
              element: user ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthForm onLogin={handleLogin} user={user} />
              ),
            },
            {
              ...PROTECTED_ROUTE,
              element: user ? (
                <ProtectedRoute user={user}>
                  <Dashboard onLogout={handleLogout} user={user} />
                </ProtectedRoute>
              ) : (
                <Navigate to="/" />
              ),
            },
            ...PUBLIC_ROUTE.map((route) => ({
              ...route,
              element: route.element,
            })),
            {
              ...ERROR_ROUTE,
              element: ERROR_ROUTE.element,
            },
          ])}
        />
      )}
    </PageTransition>
  );
};

export default Router;