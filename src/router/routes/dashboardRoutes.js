import Inicio from "../../components/inicio/Inicio";
import Tarjetas from "../../components/tarjetas/Tarjetas";
import Transactions from "../../components/transactions/Transactions";
import Maintenance from "../../views/support/Maintenance";

const DASHBOARD_ROUTES = [
  {
    path: "",
    element: <Inicio />,
    name: "Inicio",
  },
  {
    path: "tarjetas",
    element: <Tarjetas />,
    name: "Tarjetas",
  },
  {
    path: "tarjetas/:nombre",
    element: <Tarjetas />,
    name: "Detalle Tarjeta",
  },
  {
    path: "transacciones",
    element: <Transactions />,
    name: "Transacciones",
  },
  {
    path: "perfil",
    element: <Maintenance />,
    name: "Perfil",
  },
];

export default DASHBOARD_ROUTES;
