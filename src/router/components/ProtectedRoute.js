import React from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ProtectedRoute = ({ children }) => {
  const [userInfo] = useLocalStorage("userInfo", null);  

  if (!userInfo) {
    return <Navigate to="/login" replace />; 
  }

  return children;
};

export default ProtectedRoute; 
