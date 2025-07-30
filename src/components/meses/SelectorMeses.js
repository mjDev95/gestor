import React, { useEffect, useMemo } from 'react';
import { useMonth } from '../../context/monthContext';
import { useMeses } from '../../hooks/useMeses';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getRangoPeriodo } from '../../utils/formatDate';
import 'swiper/css';
import './SelectorMeses.scss';

const SelectorMeses = () => {
  const { meses, cargando } = useMeses();
  const { rangoFechas, mesSeleccionado, cambiarMes } = useMonth();

  // Genera los periodos personalizados
  const periodos = useMemo(() => {
    if (!meses.length || !rangoFechas) return [];
    return meses.map((mesStr) => {
      const rango = getRangoPeriodo(mesStr, rangoFechas);

      // Obtener mes y año de la fecha de fin
      const fechaFin = new Date(rango.fin);
      const nombreTab = `${fechaFin.toLocaleString('es-ES', { month: 'short' }).toUpperCase()} ${fechaFin.getFullYear().toString().slice(-2)}`;

      return {
        mesStr,
        ...rango,
        nombreTab,
        periodoLabel: `${rango.inicio} - ${rango.fin}`,
        fechaInicio: rango.inicio,
        fechaFin: rango.fin,
      };
    });
  }, [meses, rangoFechas]);

  useEffect(() => {
    if (periodos.length) {
      console.log('Periodos generados hoy:', periodos);
    }
  }, [periodos]);

  // Detecta el periodo activo según la fecha actual
  useEffect(() => {
    const hoy = new Date();

    if (!mesSeleccionado && periodos.length) {
      const periodoActivo = [...periodos].reverse().find(
        (p) =>
          hoy >= new Date(p.fechaInicio) &&
          hoy <= new Date(p.fechaFin)
      );
      if (periodoActivo) cambiarMes(periodoActivo.mesStr);
    }
  }, [mesSeleccionado, periodos, cambiarMes]);

  const inicialIndex = useMemo(() => {
    return periodos.findIndex(
      (p) => p.mesStr === mesSeleccionado
    );
  }, [periodos, mesSeleccionado]);

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
          576: { slidesPerView: 3 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 6 },
        }}
      >
        {periodos.map((periodo) => (
          <SwiperSlide key={periodo.mesStr} style={{ width: 'auto' }} className='py-3'>
            <button
              className={`btn-month rounded-pill text-uppercase w-100 py-0 btn ${mesSeleccionado === periodo.mesStr ? 'active' : ''}`}
              onClick={() => cambiarMes(periodo.mesStr)}
              data-periodo={periodo.periodoLabel}
            >
              {periodo.nombreTab}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SelectorMeses;