import React, { useEffect, useRef } from 'react';
import './Tabs.scss';
import { animateTabIndicator } from '../../utils/gsapAnimations';
import { useSwipeTabs } from '../../hooks/useSwipeTabs';  

const Tabs = ({ tabs, activeTab, setActiveTab, onTabChange }) => {
  const indicatorRef = useRef(null);
  const tabsRefs = useRef({});

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
  
  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });

  return (
    <div className="tabs-header d-flex position-relative dragrable" onTouchStart={handleStart} onTouchEnd={handleEnd} onMouseDown={handleStart} onMouseUp={handleEnd}>
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