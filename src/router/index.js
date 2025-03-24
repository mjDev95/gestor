import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AuthForm from '../views/login/AuthForm'; 
import Dashboard from '../views/admin/Dashboard';
import PUBLIC_ROUTE from './routes/publicRoutes'; 
import PROTECTED_ROUTE from './routes/protectedRoutes';
import ERROR_ROUTE from './routes/errorRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from "../db/firebase-config"; 

const Router = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí comprobamos si el usuario está autenticado
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? (
        <Navigate to="/dashboard" />
      ) : (
        <AuthForm onLogin={handleLogin} />
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
    ...PUBLIC_ROUTE,
    ERROR_ROUTE,
  ]);

  return <RouterProvider router={router} />;
};

export default Router;