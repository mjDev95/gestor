import { useRef } from "react";

export const useSwipeTabs = ({ tabs, activeTab, setActiveTab }) => {
  const touchStartX = useRef(null);

  const handleStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = (e) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - touchStartX.current;

    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const threshold = 50;

    if (diff > threshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].key);
    } else if (diff < -threshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }

    touchStartX.current = null;
  };

  return { handleStart, handleEnd };
};
