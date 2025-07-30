import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/scrollbar';
import "./TarjetasSwiper.scss";

const tarjetasEjemplo = [
  {
    banco: "BBVA",
    logo: "/img/banks/bbva.svg",
    terminacion: "1234",
    vence: "12/28",
    tipo: "Débito",
    principal: true,
  },
  {
    banco: "Santander",
    logo: "/img/banks/santander.svg",
    terminacion: "5678",
    vence: "09/27",
    tipo: "Crédito",
    principal: false,
  },
  {
    banco: "Banorte",
    logo: "/img/banks/banorte.svg",
    terminacion: "4321",
    vence: "05/26",
    tipo: "Débito",
    principal: false,
  },
  {
    banco: "HSBC",
    logo: "/img/banks/hsbc.svg",
    terminacion: "8765",
    vence: "11/29",
    tipo: "Crédito",
    principal: false,
  },
  {
    banco: "Citibanamex",
    logo: "/img/banks/banamex.svg",
    terminacion: "2468",
    vence: "07/25",
    tipo: "Débito",
    principal: false,
  },
  {
    banco: "Scotiabank",
    logo: "/img/banks/scotiabank.svg",
    terminacion: "1357",
    vence: "03/30",
    tipo: "Crédito",
    principal: false,
  },
];

const TarjetasSwiper = ({ tarjetas = tarjetasEjemplo, onEdit, onDelete }) => {
  return (
    <div className="tarjetas-swiper-container">
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{
            hide: false,
            draggable: true,
            snapOnRelease: true,
        }}
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          576: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        className="tarjetas-swiper"
      >
        {tarjetas.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="card shadow-sm border-0 tarjeta-virtual position-relative h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <img src={t.logo} alt={t.banco} width={36} height={36} className="me-2" />
                  <span className="fw-bold">{t.banco}</span>
                  {t.principal && <span className="badge bg-success ms-auto">Principal</span>}
                </div>
                <div className="mb-2">
                  <span className="fs-5 fw-semibold">**** {t.terminacion}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Vence: {t.vence}</span>
                  <span>{t.tipo}</span>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit && onEdit(idx)}>
                  <i className="bi bi-pencil"></i> Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete && onDelete(idx)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TarjetasSwiper;
