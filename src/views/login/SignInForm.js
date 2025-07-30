import React, { useState, useEffect } from "react";
import { LockClosedIcon, EyeSlashIcon, EyeIcon, EnvelopeIcon} from '@heroicons/react/24/solid';

const SignInForm = ({email, setEmail, password, setPassword, loading, user, handleLoginClick, loginSuccess, loginError}) => {

  const [showPassword, setShowPassword] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // 🔍 Funciones para detectar errores específicos
  const getEmailErrorMessage = (value) => {
    if (!value.includes("@")) return "Debe contener un '@'.";
    if (!/\.[a-zA-Z]{2,}$/.test(value)) return "Falta el dominio (por ejemplo, '.com').";
    return "";
  };

  const getPasswordErrorMessage = (value) => {
    const remaining = 8 - value.length;
    return remaining > 0 ? `Faltan ${remaining} caracteres.` : "";
  };

  // ⚠️ Evaluar si se debe mostrar mensaje
  const emailError =
    touchedEmail && email !== "" ? getEmailErrorMessage(email.trim()) : "";

  const passwordError =
    touchedPassword && password !== "" ? getPasswordErrorMessage(password) : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLoginClick("email");
      }}
    >
      {/* Email */}
      <div className="mb-3 text-start">
        <label htmlFor="login-email" className="form-label">
          Correo electrónico
        </label>
        <div className="position-relative">
          <EnvelopeIcon
            className="position-absolute top-50 start-0 translate-middle-y ms-3"
            style={{ pointerEvents: "none", width: "18px", height: "18px" }}
          />
          <input
            id="login-email"
            type="email"
            className="form-control ps-5"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouchedEmail(true)}
            required
            disabled={loading}
            autoComplete="email"
            inputMode="email"
          />
        </div>
        {emailError && (
          <div className="text-danger small mt-1">{emailError}</div>
        )}
      </div>

      {/* Contraseña */}
      <div className="mb-3 text-start">
        <label htmlFor="login-password" className="form-label">
          Contraseña
        </label>
        <div className="position-relative">
          <LockClosedIcon
            className="position-absolute top-50 start-0 translate-middle-y ms-3"
            style={{ pointerEvents: "none", width: "18px", height: "18px" }}
          />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            className="form-control ps-5"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouchedPassword(true)}
            required
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y px-2 py-0"
            tabIndex={0}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            style={{ lineHeight: 1, fontSize: "1.2rem" }}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeSlashIcon style={{ width: "18px", height: "18px" }} />
            ) : (
              <EyeIcon style={{ width: "18px", height: "18px" }} />
            )}
          </button>
        </div>
        {passwordError && (
          <div className="text-danger small mt-1">{passwordError}</div>
        )}
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div className="mb-3 text-end">
        <button
          type="button"
          className="btn btn-link small p-0 text-decoration-none"
          onClick={() => alert("Funcionalidad pendiente")}
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  );
};

export default SignInForm;