import { Navigate } from "react-router-dom";

const ERROR_ROUTE = {
  path: "*", 
  element: <Navigate to="/404" />, 
  name: "Pagina no encontrada",
};

export default ERROR_ROUTE;