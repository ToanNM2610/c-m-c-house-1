"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type IntroState = "darkness" | "light" | "reveal" | "enter" | "done";
export type TransitionPhase = "idle" | "exiting" | "entering";

interface SceneContextType {
  introState: IntroState;
  setIntroState: (state: IntroState) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (val: boolean) => void;
  transitionPhase: TransitionPhase;
  setTransitionPhase: (phase: TransitionPhase) => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [introState, setIntroState] = useState<IntroState>("darkness");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle");
  const pathname = usePathname();

  useEffect(() => {
    // If we're not on the home page, skip intro entirely
    if (pathname !== "/") {
      setIntroState("done");
    } else {
      // Re-trigger intro when navigating to home page? 
      // Usually, we only want intro once per session, but for demonstration, let's reset.
      // Wait, if it's cinematic, maybe we should keep a session storage flag so it only plays once.
      const hasPlayed = sessionStorage.getItem("camcu_intro_played");
      if (hasPlayed) {
        setIntroState("done");
      } else {
        setIntroState("darkness");
      }
    }
  }, [pathname]);

  return (
    <SceneContext.Provider
      value={{
        introState,
        setIntroState,
        scrollProgress,
        setScrollProgress,
        isTransitioning,
        setIsTransitioning,
        transitionPhase,
        setTransitionPhase,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error("useScene must be used within a SceneProvider");
  }
  return context;
}
