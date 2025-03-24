import React from "react";
import AuthForm from '../../views/login/AuthForm';
import Page404 from "../../views/error404/Page404";

const PUBLIC_ROUTE = [
  {
    path: "/login",
    element: <AuthForm />, // Página de login
  },
  {
    path: "/404",
    element: <Page404 />, // Página 404
  },
];
export default PUBLIC_ROUTE;
