import React, { Suspense } from 'react';
import { LazyInicio, LazyTarjetas, LazyTransactions, LazyMaintenance } from '../lazyComponents';

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const DASHBOARD_ROUTES = [
  {
    path: "",
    element: withSuspense(LazyInicio),
    name: "Inicio",
  },
  {
    path: "tarjetas",
    element: withSuspense(LazyTarjetas),
    name: "Tarjetas",
  },
  {
    path: "tarjetas/:nombre",
    element: withSuspense(LazyTarjetas),
    name: "Detalle Tarjeta",
  },
  {
    path: "transacciones",
    element: withSuspense(LazyTransactions),
    name: "Transacciones",
  },
  {
    path: "perfil",
    element: withSuspense(LazyMaintenance),
    name: "Perfil",
  },
];

export default DASHBOARD_ROUTES;
