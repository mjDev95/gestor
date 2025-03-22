import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "./firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "./firebase-config"; 
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";  

const AuthForm = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  // Función para el login con Google
  const handleGoogleLogin = async () => {
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
        
        onLogin(user);
      }
    } catch (error) {
      console.error("Error de login:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Función para el login como invitado
  const handleGuestLogin = () => {
    const guestUser = {
      name: "Invitado",
      email: "invitado@ejemplo.com",
    };
    onLogin(guestUser); // Pasa el usuario invitado a onLogin
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
              disabled={loading}
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
