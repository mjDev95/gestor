import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Tabs from "../../components/tabs/Tabs";
import {useSwipeTabs } from '../../hooks/useSwipeTabs';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AnimatedButton from "./AnimatedButton";
import { morphToCircle, morphToRect, bounceCheck, showErrorMsg } from "../../utils/gsapAnimations";


const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [, setMorphing] = useState(false);
  const btnLoginRef = useRef();
  const errorMsgRef = useRef();
  const navigate = useNavigate();
  const { user, handleLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Nuevo login animado
  const handleLoginAnimated = async (type) => {
    if (user) return;
    setLoginError("");
    setMorphing(true);
    setLoading(false);
    setLoginSuccess(false);
    morphToCircle(btnLoginRef);
    await new Promise(res => setTimeout(res, 400));
    setLoading(true);
    let currentUser = null;
    try {
      if (type === "email") {
        currentUser = await handleLogin("email", email, password);
      } else {
        currentUser = await handleLogin(type);
      }
      setLoading(false);
      if (currentUser) {
        setLoginSuccess(true);
        bounceCheck(btnLoginRef);
        setTimeout(() => {
          navigate("/dashboard");
        }, 900);
      } else {
        setMorphing(false);
        morphToRect(btnLoginRef);
        setLoginError("Credenciales incorrectas o usuario no encontrado.");
        setTimeout(() => {
          if (errorMsgRef.current) {
            showErrorMsg(errorMsgRef);
          }
        }, 0);
        setTimeout(() => {
          morphToRect(btnLoginRef);
          setLoginError("");
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setMorphing(false);
      morphToRect(btnLoginRef);
      setLoginError("Intenta nuevamente.");
      setTimeout(() => {
        if (errorMsgRef.current) {
          showErrorMsg(errorMsgRef);
        }
      }, 0);
      setTimeout(() => {
        morphToRect(btnLoginRef);
        setLoginError("");
      }, 3000);
      console.error(`Error al iniciar sesión con ${type}:`, error);
    }
  };

  const tabs = [
    {
      key: "login",
      label: "Iniciar sesión",
      content: (
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          user={user}
          handleLoginClick={handleLoginAnimated}
          loginSuccess={loginSuccess}
          loginError={loginError}
        />
      ),
    },
    {
      key: "register",
      label: "Registrarse",
      content: (
        <SignUpForm
          loading={loading}
          user={user}
          handleLoginClick={handleLoginAnimated}
        />
      ),
    },
  ];
  
  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });
  

  return (
    <div className="d-flex flex-column min-vh-100 w-100 py-4 mx-auto px-4" style={{ maxWidth: 416 }}>
      <h1 className="h2 my-5 text-center">{activeTab === 'register' ? 'Crear una cuenta' : 'Iniciar sesión'}</h1>
      
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tabs-content dragrable overflow-y-auto overflow-x-hidden flex-grow-1 mt-4 px-3" onTouchStart={handleStart} onTouchEnd={handleEnd} onMouseDown={handleStart} onMouseUp={handleEnd}>
        {(tabs.find(tab => tab.key === activeTab)?.content) || tabs[0].content}
        <AnimatedButton  loading={loading} success={loginSuccess} error={loginError} btnRef={btnLoginRef} errorMsgRef={errorMsgRef}
          onClick={async (e) => {
            e.preventDefault();
            if (activeTab === "login") {
              await handleLoginAnimated("email");
            } else {
              await handleLoginAnimated("guest");
            }
          }}
        >
          {activeTab === "login" ? "Iniciar sesión" : "Entrar como Invitado"}
        </AnimatedButton>

        <div className="d-flex align-items-center my-4">
          <hr className="w-100 m-0" />
          <span className="fw-medium text-nowrap mx-4">o continuar con</span>
          <hr className="w-100 m-0" />
        </div>
        <div className="d-flex flex-column flex-sm-row gap-3 pb-4 mb-3 mb-lg-4">
          <button
            type="button"
            className="w-100 px-2 btn btn-outline-secondary d-flex align-items-center justify-content-center"
            onClick={() => handleLoginAnimated("google")}
            disabled={loading || user}
          >
            <i className="bi bi-google me-2" /> Google
          </button>
          <button
            type="button"
            className="d-none w-100 px-2 btn btn-outline-secondary d-flex align-items-center justify-content-center"
            disabled
          >
            <i className="bi bi-facebook me-2" /> Facebook
          </button>
          <button
            type="button"
            className="d-none w-100 px-2 btn btn-outline-secondary d-flex align-items-center justify-content-center"
            disabled
          >
            <i className="bi bi-apple me-2" /> Apple
          </button>
        </div>
      </div>

      <footer className="small mt-auto text-center pt-4">
        <div className="mb-4 nav">
          <a className="text-decoration-underline p-0 nav-link" href="/help">¿Necesitas ayuda?</a>
        </div>
        <p className="fs-xs mb-0">© Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default AuthForm;
