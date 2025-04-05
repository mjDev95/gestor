import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";  
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} sm={12}>
          <h2 className="text-center mb-4">Login</h2>
          <div className="text-center mt-4">
            <Button
              variant="outline-danger"
              onClick={() => handleLoginClick("google")}
              disabled={loading || user}
              className="mb-3"
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Iniciar sesión con Google"
              )}
            </Button>
            <div>
              <Button
                variant="outline-primary"
                onClick={() => handleLoginClick("guest")}
                disabled={loading || user} 
              >
                Entrar como Invitado
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
