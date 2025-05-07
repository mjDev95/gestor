import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const { user } = useAuth();

  // Determinar la ruta del botón según el estado del usuario
  const redirectPath = user ? "/dashboard" : "/login";

  return (
    <div className="p-0">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center justify-content-center text-center bg-dark text-white" style={{ height: "100vh" }}>
        <div className="container">
          <h1 className="display-4 fw-bold">Bienvenido a Control de Gastos</h1>
          <p className="lead mt-3">
            Administra tus finanzas de manera eficiente y organizada. ¡Empieza hoy mismo!
          </p>
          <Link to={redirectPath} className="btn btn-primary btn-lg mt-4">
            Ir al Gestor
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">¿Qué es Control de Gastos?</h2>
          <p className="text-center">
            Control de Gastos es una herramienta diseñada para ayudarte a gestionar tus finanzas personales o empresariales. 
            Con nuestra plataforma, puedes registrar tus ingresos y gastos, generar reportes y tomar decisiones informadas.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio py-5">
        <div className="container">
          <h2 className="text-center mb-4">Características</h2>
          
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-5 bg-primary text-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-uppercase text-warning mb-2">Servicios</p>
            <h2 className="fw-bold">Nuestros Servicios Principales</h2>
          </div>
      
        </div>
      </section>
    </div>
  );
};

export default Home;