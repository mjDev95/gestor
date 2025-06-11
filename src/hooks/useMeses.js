import { useEffect, useState } from 'react';
import { db } from '../db/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useMeses = () => {
  const [meses, setMeses] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const obtenerMeses = async () => {
      if (!user) return;

      setCargando(true);
      const colecciones = ['gastos', 'ingresos', 'ahorro'];
      const conjuntoMeses = new Set();

      for (const coleccion of colecciones) {
        const consulta = query(collection(db, coleccion), where("userId", "==", user.uid));
        const resultado = await getDocs(consulta);

        resultado.forEach(doc => {
          const datos = doc.data();
          const fecha = new Date(datos.fecha);
          const mesFormateado = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
          conjuntoMeses.add(mesFormateado);

          // Agregar también el mes anterior para cubrir periodos personalizados
          const mesAnterior = fecha.getMonth() === 0
            ? `${fecha.getFullYear() - 1}-12`
            : `${fecha.getFullYear()}-${String(fecha.getMonth()).padStart(2, '0')}`;
          conjuntoMeses.add(mesAnterior);
        });
      }

      // Agregar el mes actual y el siguiente para asegurar que siempre existan periodos activos
      const hoy = new Date();
      const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
      const mesSiguiente = hoy.getMonth() === 11
        ? `${hoy.getFullYear() + 1}-01`
        : `${hoy.getFullYear()}-${String(hoy.getMonth() + 2).padStart(2, '0')}`;
      conjuntoMeses.add(mesActual);
      conjuntoMeses.add(mesSiguiente);

      // Orden ascendente (más antiguo a más reciente)
      const mesesOrdenados = Array.from(conjuntoMeses).sort((a, b) => a.localeCompare(b));
      setMeses(mesesOrdenados);
      setCargando(false);
    };

    obtenerMeses();
  }, [user]);

  return { meses, cargando };
};