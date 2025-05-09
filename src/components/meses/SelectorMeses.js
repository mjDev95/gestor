import React, { useEffect, useMemo } from 'react';
import { useMonth } from '../../context/monthContext';
import { useMeses } from '../../hooks/useMeses';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatearMes } from '../../utils/formatDate';
import 'swiper/css';
import './SelectorMeses.scss';



const SelectorMeses = () => {
  const { meses, cargando } = useMeses();
  const { mesSeleccionado, cambiarMes } = useMonth(); // Accedemos al mes y a la función cambiarMes desde el contexto

  const mesActualStr = new Date().toISOString().slice(0, 7);

  const mesesOrdenados = useMemo(() => {
    return [...meses];
  }, [meses]);

  const inicialIndex = useMemo(() => {
    return mesesOrdenados.findIndex(
      (mes) => mes === mesSeleccionado || mes === mesActualStr
    );
  }, [mesesOrdenados, mesSeleccionado, mesActualStr]);

  useEffect(() => {
    if (!mesSeleccionado && mesesOrdenados.includes(mesActualStr)) {
      cambiarMes(mesActualStr); // Actualizamos el mes en el contexto
    }
  }, [mesSeleccionado, mesesOrdenados, mesActualStr, cambiarMes]);

  const manejarClick = (mes) => {
    cambiarMes(mes); 
  };

  if (cargando) return null;

  return (
    <div className="selector-meses position-relative px-1" style={{ zIndex: '1000' }}>
      <Swiper
        spaceBetween={8}
        slidesPerView="3"
        initialSlide={inicialIndex}
        grabCursor={true}
        className="swiper-meses"
        breakpoints={{
          576: {
            slidesPerView: 3, // Tablet pequeña
          },
          768: {
            slidesPerView: 3, // Tablet
          },
          992: {
            slidesPerView: 5, // Desktop
          },
          1200: {
            slidesPerView: 6, // Pantallas más grandes
          },
        }}
      >
        {mesesOrdenados.map((mesStr) => {
          const textoMes = formatearMes(mesStr);

          return (
            <SwiperSlide key={mesStr} style={{ width: 'auto' }} className='py-3'>
              <button
                className={`btn-month rounded-pill text-uppercase w-100 btn ${mesSeleccionado === mesStr ? 'active' : ''}`}
                onClick={() => manejarClick(mesStr)}
              >
                {textoMes}
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SelectorMeses;