import React, { useEffect, useRef } from 'react';
import './Tabs.scss';
import { animateTabIndicator } from '../../utils/gsapAnimations';

const Tabs = ({ tabs, activeTab, setActiveTab, onTabChange }) => {
  const indicatorRef = useRef(null);
  const tabsRefs = useRef({});
  const dragStartX = useRef(null);

  useEffect(() => {
    const activeButton = tabsRefs.current[activeTab];
    if (activeButton && indicatorRef.current) {
      animateTabIndicator(indicatorRef.current, activeButton);
    }
  }, [activeTab]);

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (onTabChange) onTabChange(key);
  };

  // Touch & Mouse handlers
  const handleStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      dragStartX.current = e.touches[0].clientX;
    } else if (e.type === "mousedown") {
      dragStartX.current = e.clientX;
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
    }
  };

  const handleEnd = (e) => {
    let endX;
    if (e.changedTouches && e.changedTouches.length === 1) {
      endX = e.changedTouches[0].clientX;
    } else if (e.type === "mouseup") {
      endX = e.clientX;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
    } else {
      dragStartX.current = null;
      return;
    }
    const deltaX = endX - dragStartX.current;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
      if (deltaX < 0 && currentIndex < tabs.length - 1) {
        handleTabClick(tabs[currentIndex + 1].key);
      } else if (deltaX > 0 && currentIndex > 0) {
        handleTabClick(tabs[currentIndex - 1].key);
      }
    }
    dragStartX.current = null;
  };

  // Para mouse drag, necesitamos capturar el mouseup fuera del div
  const handleMove = (e) => {
    // No hacemos nada aquí, solo necesitamos para que mouseup funcione correctamente
  };

  return (
    <div
      className="tabs-header d-flex position-relative"
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      style={{ userSelect: "none", cursor: "grab" }}
    >
      <div className="tabs-indicator position-absolute bottom-0" ref={indicatorRef} />
      {tabs.map(({ label, key }) => (
        <button
          key={key}
          ref={(el) => (tabsRefs.current[key] = el)}
          className={`tab-button btn-tab py-2 px-3 border-0 ${activeTab === key ? 'active' : ''}`}
          onClick={() => handleTabClick(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;