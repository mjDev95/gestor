import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./PageTransition.scss";

const PageTransition = ({ loading, children }) => {
  const liRefs = useRef([]); 
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Animación de salida
      const tl = gsap.timeline(
        {
          onComplete: () => setIsAnimating(false),
        }
      );
      tl.to(liRefs.current, {
        duration: 0.3,
        scaleY: 0,
        transformOrigin: "bottom left",
        stagger: 0.1,
        delay: 0.1,
      });
    }
  }, [loading]);

  return (
    <>
      {/* Contenedor de la transición */}
      {isAnimating && (
        <ul className="transition d-inline-flex position-absolute top-0 start-0 m-0 p-0 w-100 vh-100 m-0 p-0 list-unstyled">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <li
                key={index}
                ref={(el) => (liRefs.current[index] = el)}
              ></li>
            ))}
        </ul>
      )}

      {/* Contenido de la página */}
      {!loading && <div style={{ position: "relative", zIndex: 1 }}>{children}</div>}
    </>
  );
};

export default PageTransition;