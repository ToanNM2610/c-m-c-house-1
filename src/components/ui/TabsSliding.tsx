"use client";

import { useEffect, useRef, useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsSlidingProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export default function TabsSliding({ tabs, activeTab, onChange, className = "", tabClassName = "" }: TabsSlidingProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const moveTo = (tabEl: HTMLElement, animate: boolean) => {
    if (!pillRef.current) return;
    const pill = pillRef.current;
    if (!animate) {
      const prev = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${tabEl.offsetLeft}px)`;
      pill.style.width = `${tabEl.offsetWidth}px`;
      void pill.offsetWidth;
      pill.style.transition = prev;
    } else {
      pill.style.transform = `translateX(${tabEl.offsetLeft}px)`;
      pill.style.width = `${tabEl.offsetWidth}px`;
    }
  };

  useEffect(() => {
    if (!barRef.current) return;
    const activeEl = barRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeEl) {
      moveTo(activeEl, true);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (!barRef.current) return;
      const activeEl = barRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (activeEl) {
        moveTo(activeEl, false);
      }
    };
    
    // Initial position without animation
    setTimeout(handleResize, 10);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  return (
    <div ref={barRef} className={`t-tabs ${className}`} role="tablist">
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true"></span>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onChange(tab.id)}
          className={`t-tab ${tabClassName} ${activeTab === tab.id ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
