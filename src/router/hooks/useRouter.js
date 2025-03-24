// src/hooks/useRouter.js
import { useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Usamos useNavigate desde react-router-dom

export function useRouter() {
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      back: () => navigate(-1), // Regresa a la página anterior
      forward: () => navigate(1), // Avanza a la siguiente página
      reload: () => window.location.reload(), // Recarga la página
      push: (href) => navigate(href), // Navega a una nueva ruta
      replace: (href) => navigate(href, { replace: true }), // Reemplaza la ruta actual
    }),
    [navigate]
  );

  return router;
}
