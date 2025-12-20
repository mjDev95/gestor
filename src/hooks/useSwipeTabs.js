import { useRef } from "react";

export const useSwipeTabs = ({ tabs, activeTab, setActiveTab }) => {
  const touchStartX = useRef(null);

  const handleStart = (e) => {
    // Si no hay tabs o solo hay una, no aplica swipe
    if (!tabs || tabs.length < 2) return;

    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = (e) => {
    // Si no hay tabs o solo hay una, no aplica swipe
    if (!tabs || tabs.length < 2) return;

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
