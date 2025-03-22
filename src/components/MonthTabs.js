import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from "react-bootstrap";
import 'swiper/css';


const MesesTabs = () => {
  return (
      <div  id="slide-meses" className="ms-auto me-0 overflow-hidden">
        <Swiper
          spaceBetween={15}  
          slidesPerView="auto"
          freeMode={true}  
          grabCursor={true} 
          className="swiper-container"
        >
          {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Enearo", "Fesbrero", "Mas5rzo", "Absril", "Msayo","Ensero", "Febrsero"].map((month) => (
            <SwiperSlide key={month} className="custom-slide">
              <Button  variant="link" className="text-decoration-none swiper-button rounded-5 px-3">{month}</Button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
  );
};

export default MesesTabs;
