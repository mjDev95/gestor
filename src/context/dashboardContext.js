import { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeSection, setActiveSectionState] = useState(() => {
    const storedSection = localStorage.getItem("dashboard_active_section");
    return storedSection ? storedSection : "inicio";
  });

  const [lastSection, setLastSection] = useState(null);

  const setActiveSection = (section) => {
    setLastSection(activeSection);
    setActiveSectionState(section);
  };

  useEffect(() => {
    localStorage.setItem("dashboard_active_section", activeSection);
  }, [activeSection]);

  const resetDashboardSection = () => {
    localStorage.removeItem("dashboard_active_section");
    setLastSection(activeSection);
    setActiveSectionState("inicio");
  };

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection, lastSection, resetDashboardSection }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}