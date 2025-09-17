import React from "react";
import { useGlobalState } from '../../context/GlobalState';
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/scrollbar';
import "./TarjetasSwiper.scss";



const TarjetasSwiper = ({ onEdit, onDelete }) => {
  const { tarjetas } = useGlobalState();
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
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 2.5},
          1200:{ slidesPerView: 3 },
          1400:{ slidesPerView: 4 },
        }}
        className="tarjetas-swiper"
      >
        {tarjetas && tarjetas.length > 0 ? (
          tarjetas.map((t, idx) => (
            <SwiperSlide key={t.id || idx} className="pb-4">
              <div className="card shadow-sm border-0 tarjeta-virtual position-relative h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img src={t.logo} alt={t.banco} width={36} height={36} className="me-2 d-none" />
                    <span className="fw-bold">{t.banco}</span>
                    {t.principal && <span className="badge bg-success ms-auto">Principal</span>}
                  </div>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Vence: {t.vence}</span>
                    <span>{t.tipo}</span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                  <div className="mb-2">
                    <span className="fs-4 fw-semibold">**** **** **** {t.terminacion}</span>
                  </div>
                  <div className="logos-acreditacion d-flex align-items-center">
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center w-100 py-5">No tienes tarjetas guardadas.</div>
        )}
      </Swiper>
    </div>
  );
};

export default TarjetasSwiper;