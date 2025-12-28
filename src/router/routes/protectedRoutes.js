import Dashboard from "../../views/admin/Dashboard";
import DASHBOARD_ROUTES from "./dashboardRoutes";

const PROTECTED_ROUTE = {
  path: "/dashboard",
  element: <Dashboard />,
  name: "Gestor",
  children: DASHBOARD_ROUTES,
};

export default PROTECTED_ROUTE;