import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { obtenerConfiguracionUsuario, guardarConfiguracionUsuario } from "../services/configuracionService";
import { obtenerMesActual } from "../utils/formatDate";

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [mesSeleccionadoLocal, setMesSeleccionadoLocal] = useLocalStorage("mesSeleccionado", obtenerMesActual());
  const [mesSeleccionado, setMesSeleccionado] = useState(mesSeleccionadoLocal);

  const [rangoFechasLocal, setRangoFechasLocal] = useLocalStorage("rangoFechas", { inicio: "01", fin: "31" });
  const [rangoFechas, setRangoFechas] = useState(rangoFechasLocal);

  useEffect(() => {
    setMesSeleccionadoLocal(mesSeleccionado);
  }, [mesSeleccionado, setMesSeleccionadoLocal]);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      if (!user?.uid) return;
      try {
        const configuracion = await obtenerConfiguracionUsuario(user.uid);
        if (configuracion?.rangoFechas) {
          setRangoFechas(configuracion.rangoFechas);
        }
      } catch (error) {
        console.error("🚨 Error al cargar configuración:", error);
      }
    };
    cargarConfiguracion();
  }, [user?.uid]); 

  const definirRangoFechas = async (nuevoRango) => {
    setRangoFechas(nuevoRango);
    setRangoFechasLocal(nuevoRango);
    if (!user?.uid) return;
    try {
      await guardarConfiguracionUsuario(user.uid, { rangoFechas: nuevoRango });
    } catch (error) {
      console.error("🚨 Error al guardar configuración:", error);
    }
  };

  const cambiarMes = (nuevoMes) => {
    setMesSeleccionado(nuevoMes);
  };

  return (
    <MonthContext.Provider value={{ 
      mesSeleccionado, 
      setMesSeleccionado, 
      rangoFechas, 
      setRangoFechas, 
      cambiarMes, 
      definirRangoFechas 
    }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => useContext(MonthContext);