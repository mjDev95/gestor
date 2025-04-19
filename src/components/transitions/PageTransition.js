import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./PageTransition.scss";

const PageTransition = ({ children }) => {
  const [gridItems, setGridItems] = useState([]);
  const [gridStyle, setGridStyle] = useState({});
  const [, setMaxDelay] = useState(0);

  useEffect(() => {
    const createGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = 100;
      const cols = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      const items = [];
      let localMaxDelay = 0;

      for (let i = 0; i < rows * cols; i++) {
        const randomDelay = Math.random() * 0.6;
        const startOpacity = Math.random() < 0.5 ? 0.4 : 0.8;
        if (randomDelay > localMaxDelay) localMaxDelay = randomDelay;

        items.push(
          <motion.div
            key={i}
            className="grid-item"
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: {
                delay: randomDelay,
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            exit={{
              opacity: startOpacity,
              transition: {
                delay: randomDelay,
                duration: 0.1,
                ease: [0.33, 1, 0.68, 1],
              },
            }}
          />
        );
      }

      setMaxDelay(localMaxDelay);
      setGridItems(items);
      setGridStyle({
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        pointerEvents: "none",
        backgroundColor: "transparent",
      });
    };

    createGrid();
    window.addEventListener("resize", createGrid);
    return () => window.removeEventListener("resize", createGrid);
  }, []);

  return (
    <>
      <motion.div
        className="grid-container"
        style={gridStyle}
      >
        {gridItems}
      </motion.div>
      {children}
    </>
  );
};

export default PageTransition;
