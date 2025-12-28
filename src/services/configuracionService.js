import { db } from "../db/firebase-config";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

export const guardarConfiguracionUsuario = async (userId, configuracion) => {
  try {
    if (!userId) {
      throw new Error("El userId es obligatorio para guardar la configuración.");
    }
    // Referencia a la colección "configuraciones"
    const configuracionesRef = collection(db, "configuraciones");

    // Crear una consulta para buscar el documento donde el campo "userId" sea igual al valor proporcionado
    const q = query(configuracionesRef, where("userId", "==", userId));

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el documento, actualizarlo
      const documento = querySnapshot.docs[0];
      const docRef = documento.ref; // Referencia al documento existente

      await setDoc(docRef, configuracion, { merge: true }); // Actualizar solo los campos especificados
    } else {
      // Si no se encuentra el documento, crear uno nuevo
      const nuevoDocRef = doc(configuracionesRef); // Generar un nuevo documento con un ID automático
      await setDoc(nuevoDocRef, { userId, ...configuracion });
    }
  } catch (error) {
    console.error("🚨 Error al guardar configuración:", error);
  }
};

export const obtenerConfiguracionUsuario = async (userId) => {
  try {
    if (!userId) {
      throw new Error("El userId es obligatorio para obtener la configuración.");
    }

    // Referencia a la colección "configuraciones"
    const configuracionesRef = collection(db, "configuraciones");

    // Crear una consulta para buscar el documento donde el campo "userId" sea igual al valor proporcionado
    const q = query(configuracionesRef, where("userId", "==", userId));

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el documento, retornar sus datos
      const documento = querySnapshot.docs[0];
      const data = documento.data();
      return data;
    } else {
      console.warn(`⚠️ No se encontró configuración para el usuario: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("🚨 Error al obtener configuración:", error);
    return null;
  }
};