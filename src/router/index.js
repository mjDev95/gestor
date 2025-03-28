import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import AuthForm from '../views/login/AuthForm'; 
import Dashboard from '../views/admin/Dashboard';
import PUBLIC_ROUTE from './routes/publicRoutes'; 
import PROTECTED_ROUTE from './routes/protectedRoutes';
import ERROR_ROUTE from './routes/errorRoutes';
import ProtectedRoute from './components/ProtectedRoute';

const Router = () => {
  const { user, handleLogin, handleLogout } = useAuth();

  const router = createBrowserRouter([
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
    ...PUBLIC_ROUTE,
    ERROR_ROUTE,
  ]);

  return <RouterProvider router={router} />;
};

export default Router;