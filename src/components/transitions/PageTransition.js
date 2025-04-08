import React, { useRef, useEffect, useState } from "react";
import { initLoader } from "../../animations/initLoader";
import { initLoaderHome } from "../../animations/initLoaderHome";
import { pageTransitionOut } from "../../animations/pageTransitionOut";
import{ pageTransitionIn } from "../../animations/pageTransitionIn";
import "./PageTransition.scss";

const PageTransition = ({ children, location, nextPageName, isHome }) => {
  const topLiRefs = useRef([]); 
  const bottomLiRefs = useRef([]);
  const textRef = useRef(null);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    const handleTransition = async () => {
      if (isHome) {
        // Animación específica para el Home
        await initLoaderHome(topLiRefs, bottomLiRefs, textRef);
      } else {
        // Animación genérica para otras páginas
        await initLoader(topLiRefs, bottomLiRefs, textRef);
      }

      // Actualizar el contenido después de la animación
      setDisplayChildren(children);
    };

    handleTransition();
  }, [location.pathname, children, isHome]);
   

  return (
    <>
      {/* Contenedor de transiciones */}
      <div className="loading-container fixed-top top-0 w-100 h-100 overflow-hidden">
        <div className="loading-screen w-100 h-100 start-0 position-relative">
          {/* Cortina superior */}
          <ul className="transition top m-0 p-0 w-100 list-unstyled">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <li
                  key={`top-${index}`}
                  ref={(el) => (topLiRefs.current[index] = el)} // Asignar referencia a cada <li>
                  className="transition-item"
                ></li>
              ))}
          </ul>

          {/* Texto del nombre de la página */}
          <div className="loading-words" ref={textRef}>
            {nextPageName}
          </div>

          {/* Cortina inferior */}
          <ul className="transition bottom m-0 p-0 w-100 list-unstyled">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <li
                  key={`bottom-${index}`}
                  ref={(el) => (bottomLiRefs.current[index] = el)} // Asignar referencia a cada <li>
                  className="transition-item"
                ></li>
              ))}
          </ul>
        </div>
      </div>

      {/* Contenido de la página */}
      <div className="page-content">{displayChildren}</div>
    </>
  );
};

export default PageTransition;