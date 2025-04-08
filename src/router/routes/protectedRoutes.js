import Dashboard from "../../views/admin/Dashboard";

const PROTECTED_ROUTE = {
  path: "/dashboard",
  element: <Dashboard />,
  name: "Gestor",
};

export default PROTECTED_ROUTE;