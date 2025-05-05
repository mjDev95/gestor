import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useMeses } from '../../hooks/useMeses';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './SelectorMeses.scss';

const SelectorMeses = ({ onSelect }) => {
  const { meses, cargando } = useMeses();
  const [seleccionado, setSeleccionado] = useState(null);

  const mesActualStr = new Date().toISOString().slice(0, 7);

  const mesesOrdenados = useMemo(() => {
    return [...meses];
  }, [meses]);

  const inicialIndex = useMemo(() => {
    return mesesOrdenados.findIndex(
      (mes) => mes === mesActualStr
    );
  }, [mesesOrdenados, mesActualStr]);

  useEffect(() => {
    if (mesesOrdenados.includes(mesActualStr)) {
      setSeleccionado(mesActualStr);
      onSelect(mesActualStr);
    }
  }, [mesesOrdenados]);

  const manejarClick = (mes) => {
    setSeleccionado(mes);
    onSelect(mes);
  };

  if (cargando) return null;

  return (
    <div className="selector-meses position-relative" style={{ zIndex: '1000' }}>
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        initialSlide={inicialIndex}
        grabCursor={true}
        className="swiper-meses"
      >
        {mesesOrdenados.map((mesStr) => {
          const [anio, mes] = mesStr.split('-'); 
          const fecha = new Date(anio, mes - 1, 1); 
          const nombreMes = fecha.toLocaleString('default', { month: 'short' }).toUpperCase(); 
          const anioAbreviado = fecha.getFullYear().toString().slice(-2); 

          // Mostrar "MES XX", donde XX son los últimos 2 dígitos del año
          const textoMes = `${nombreMes} ${anioAbreviado}`;

          return (
            <SwiperSlide key={mesStr} style={{ width: 'auto' }} className='py-3'>
              <Button
                variant={seleccionado === mesStr ? 'primary' : 'light'}
                size="sm"
                className="rounded-pill px-4 text-uppercase w-100"
                onClick={() => manejarClick(mesStr)}
              >
                {textoMes}
              </Button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SelectorMeses;
