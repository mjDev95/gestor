import React, { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";

const App = () => {
  const [user, setUser] = useState(null);  // Estado para saber si el usuario está logueado
  const [loading, setLoading] = useState(true);

  // Verificamos el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Si el usuario está logueado, actualizamos el estado
      setLoading(false);  // Dejamos de mostrar el loading
    });
    
    return () => unsubscribe();  // Limpiamos el listener cuando el componente se desmonte
  }, []);

  const handleLogin = (guestUser = null) => {
    if (guestUser) {
      setUser(guestUser);  // Si es un usuario invitado, seteamos ese usuario
    } else {
      setUser(auth.currentUser);  // Si no, usamos el usuario autenticado con Firebase
    }
  };

  const handleLogout = () => {
    setUser(null);  // Actualizamos el estado a no logueado
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {user ? (
        <Dashboard onLogout={handleLogout} user={user}/>  // Mostramos el Dashboard si está logueado
      ) : (
        <AuthForm onLogin={handleLogin} />  // Mostramos el formulario de login si no está logueado
      )}
    </div>
  );
};

export default App;
