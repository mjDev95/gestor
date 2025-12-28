import React, { Suspense } from 'react';
import { LazyLogin, LazyHome, LazyError404 } from '../lazyComponents';

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

const PUBLIC_ROUTE = [
  {
    path: "/",
    element: withSuspense(LazyHome),
    name: "Home",
  },
  {
    path: "/login",
    element: withSuspense(LazyLogin),
    name: "Login",
  },
  {
    path: "/404",
    element: withSuspense(LazyError404),
    name: "Pagina no encontrada",
  },
];
export default PUBLIC_ROUTE;
