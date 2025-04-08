import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const { user } = useAuth();

  // Determinar la ruta del botón según el estado del usuario
  const redirectPath = user ? "/dashboard" : "/login";

  return (
    <Container fluid className="p-0">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center justify-content-center text-center bg-dark text-white" style={{ height: "100vh" }}>
        <Container>
          <h1 className="display-4 fw-bold">Bienvenido a Control de Gastos</h1>
          <p className="lead mt-3">
            Administra tus finanzas de manera eficiente y organizada. ¡Empieza hoy mismo!
          </p>
          <Link to={redirectPath} className="btn btn-primary btn-lg mt-4">
            Ir al Gestor
          </Link>
        </Container>
      </section>

      {/* About Section */}
      <section className="about py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">¿Qué es Control de Gastos?</h2>
          <p className="text-center">
            Control de Gastos es una herramienta diseñada para ayudarte a gestionar tus finanzas personales o empresariales. 
            Con nuestra plataforma, puedes registrar tus ingresos y gastos, generar reportes y tomar decisiones informadas.
          </p>
        </Container>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio py-5">
        <Container>
          <h2 className="text-center mb-4">Características</h2>
          <Row>
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Gestión de Ingresos</Card.Title>
                  <Card.Text>
                    Registra y organiza todos tus ingresos de manera sencilla.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Control de Gastos</Card.Title>
                  <Card.Text>
                    Lleva un seguimiento detallado de tus gastos diarios, semanales o mensuales.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Reportes Financieros</Card.Title>
                  <Card.Text>
                    Genera reportes personalizados para analizar tu situación financiera.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services py-5 bg-primary text-white">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-warning mb-2">Servicios</p>
            <h2 className="fw-bold">Nuestros Servicios Principales</h2>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="bg-dark text-white shadow-sm">
                <Card.Img src="/images/creative-agency/service_7.jpeg" alt="WP Development" className="card-img-top" />
                <Card.Body>
                  <Card.Title>WP Development</Card.Title>
                  <Card.Text>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="bg-dark text-white shadow-sm">
                <Card.Img src="/images/creative-agency/service_8.jpeg" alt="UI/UX Design" className="card-img-top" />
                <Card.Body>
                  <Card.Title>UI/UX Design</Card.Title>
                  <Card.Text>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="bg-dark text-white shadow-sm">
                <Card.Img src="/images/creative-agency/service_9.jpeg" alt="Branding" className="card-img-top" />
                <Card.Body>
                  <Card.Title>Branding</Card.Title>
                  <Card.Text>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
};

export default Home;