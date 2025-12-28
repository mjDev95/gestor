import { lazy } from 'react';

// Lazy load de componentes de rutas
export const LazyInicio = lazy(() => import('../components/inicio/Inicio'));
export const LazyTarjetas = lazy(() => import('../components/tarjetas/Tarjetas'));
export const LazyTransactions = lazy(() => import('../components/transactions/Transactions'));
export const LazyMaintenance = lazy(() => import('../views/support/Maintenance'));
export const LazyLogin = lazy(() => import('../views/login/AuthForm'));
export const LazyHome = lazy(() => import('../views/home/Home'));
export const LazyError404 = lazy(() => import('../views/error404/Page404'));
