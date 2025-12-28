import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  return (
    <DashboardContext.Provider value={{}}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  /**
   * Extrae la sección activa de la URL
   * Funciona automáticamente con cualquier ruta y sus hijos:
   * - /dashboard → "inicio"
   * - /dashboard/tarjetas → "tarjetas"
   * - /dashboard/tarjetas/bbva-1234 → "tarjetas" (ignora rutas hijas)
   * - /dashboard/configuracion/perfil → "configuracion"
   * 
   */
  const getActiveSection = () => {
    const path = location.pathname;
    
    // Página principal del dashboard
    if (path === "/dashboard" || path === "/dashboard/") return "inicio";
    
    // Extraer solo el primer segmento después de /dashboard/
    // Esto automáticamente agrupa rutas hijas con su padre
    const segment = path.replace("/dashboard/", "").split("/")[0];
    
    return segment || "inicio";
  };

  const activeSection = getActiveSection();

  // Navegación simplificada
  const navigateToSection = (section) => {
    if (section === "inicio") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${section}`);
    }
  };

  return { 
    activeSection,
    navigateToSection,
  };
}