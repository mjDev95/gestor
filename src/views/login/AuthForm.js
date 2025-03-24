import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db, auth } from "../../db/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";  
import { useNavigate } from "react-router-dom";

const AuthForm = ({ onLogin, user }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para el login con Google
  const handleGoogleLogin = async () => {
    if (user) return; // Si ya hay un usuario, no permitimos el login con Google

    setLoading(true);
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
  
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            nombre: user.displayName || "Usuario",
            email: user.email,
            fotoURL: user.photoURL || "",
            creadoEn: new Date(),
            configuracion: { tema: "claro" }, 
            moneda: "MXN",
            categorias: ["Alimentos", "Transporte", "Entretenimiento"],
            ingresosMensuales: 0
          });
        }
        
        onLogin(user); // Guardamos al usuario de Google en el estado
        navigate("/dashboard"); // Redirigimos al Dashboard
      }
    } catch (error) {
      console.error("Error de login:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para el login como invitado
  const handleGuestLogin = () => {
    if (user) return; // Si ya hay un usuario, no permitimos login como invitado

    const guestUser = {
      name: "Invitado",
      email: "invitado@ejemplo.com",
    };

    onLogin(guestUser); // Guardamos al usuario invitado en el estado
    navigate("/dashboard"); // Redirigimos al Dashboard
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} sm={12}>
          <h2 className="text-center mb-4">Login</h2>
          <div className="text-center mt-4">
            <Button
              variant="outline-danger"
              onClick={handleGoogleLogin}
              disabled={loading || user} // Deshabilitamos si ya hay un usuario logueado
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
                onClick={handleGuestLogin}
                disabled={loading || user} // Deshabilitamos si ya hay un usuario logueado
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
