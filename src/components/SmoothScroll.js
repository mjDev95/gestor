import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null); 

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true, 
      multiplier: 1,
      smartphone: {
        smooth: true, 
      },
      tablet: {
        smooth: true,
      },
    });

    // Limpieza cuando el componente se desmonta
    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div data-scroll-container ref={scrollRef} className="d-flex flex-column">
      {children}
    </div>
  );
};

export default SmoothScroll;
