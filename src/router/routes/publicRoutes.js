import React from "react";
import AuthForm from '../../views/login/AuthForm';
import Page404 from "../../views/error404/Page404";
import Home from "../../views/home/Home";

const PUBLIC_ROUTE = [
  {
    path: "/",
    element: <Home />, // Página independiente para "/"
    name: "Home",
  },
  {
    path: "/login",
    element: <AuthForm />, // Página de login
    name: "Login",
  },
  {
    path: "/404",
    element: <Page404 />, // Página 404
    name: "Pagina no encontrada",
  },
];
export default PUBLIC_ROUTE;
