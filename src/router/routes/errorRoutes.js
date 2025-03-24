import { Navigate } from "react-router-dom";

const ERROR_ROUTE = {
  path: "*", 
  element: <Navigate to="/404" />, 
};

export default ERROR_ROUTE;