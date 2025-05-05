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
        });
      }

      const mesesOrdenados = Array.from(conjuntoMeses).sort((a, b) => a.localeCompare(b));
      setMeses(mesesOrdenados);
      setCargando(false);
    };

    obtenerMeses();
  }, [user]);

  return { meses, cargando };
};
