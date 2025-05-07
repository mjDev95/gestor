import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, handleLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLoginClick = async (type) => {
    if (user) return;

    setLoading(true);
    try {
      const currentUser = await handleLogin(type);
      if (currentUser) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(`Error al iniciar sesión con ${type}:`, error);
    }
  };

  return (
    <div className="mt-5 container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <h2 className="text-center mb-4">Login</h2>
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-danger mb-3"
              onClick={() => handleLoginClick("google")}
              disabled={loading || user}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Iniciar sesión con Google"
              )}
            </button>
            <div>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleLoginClick("guest")}
                disabled={loading || user}
              >
                Entrar como Invitado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
