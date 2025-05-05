import React from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useGlobalState } from "../../context/GlobalState";
import "./ResumenFinanciero.scss";

const ResumenFinanciero = () => {
  const { transactions, loading } = useGlobalState();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  const formatAmount = (valor) => {
    return valor % 1 === 0
      ? valor.toLocaleString("es-MX", { maximumFractionDigits: 0 })
      : valor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const ingresos = transactions
    .filter((t) => t.tipo === "ingresos")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  const gastos = transactions
    .filter((t) => t.tipo === "gastos")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  const ahorro = transactions
    .filter((t) => t.tipo === "ahorro")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  const saldo = ingresos - gastos;

  const resumen = [
    { titulo: "Saldo disponible", valor: saldo, clase: "saldo" },
    { titulo: "Ingresos", valor: ingresos, clase: "ingresos" },
    { titulo: "Gastos", valor: gastos, clase: "gastos" },
    { titulo: "Ahorros", valor: ahorro, clase: "ahorro" },
  ];

  return (
    <Row className="resumen-financiero">
      {resumen.map((item, index) => (
        <Col key={index} lg={3} md={6} sm={12} className="mb-4">
          <Card className={`resumen-card ${item.clase}`}>
            <Card.Body>
              <Card.Title>{item.titulo}</Card.Title>
              <Card.Text className="resumen-valor">
                ${formatAmount(item.valor)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ResumenFinanciero;
