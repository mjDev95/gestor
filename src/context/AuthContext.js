import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../db/firebase-config';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [, setUserInfo] = useLocalStorage("userInfo", null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserInfo(currentUser);
      } else {
        setUser(null);
        setUserInfo(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (type = "google") => {
    try {
      let currentUser;

      if (type === "google") {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
      } else if (type === "guest") {
        const result = await signInAnonymously(auth);
        currentUser = result.user;
      }

      if (currentUser) {
        setUser(currentUser);
        setUserInfo(currentUser);
      }

      return currentUser;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserInfo(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};