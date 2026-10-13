"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { audioEngine } from "@/lib/audioEngine";

export type RenderStyleMode = "prism" | "blueprint" | "parchment";

interface SignalEngineContextType {
  styleMode: RenderStyleMode;
  setStyleMode: (mode: RenderStyleMode) => void;
  audioActive: boolean;
  toggleAudio: () => Promise<void>;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  creatureSpeed: number;
  setCreatureSpeed: (val: number) => void;
  creatureFluidity: number;
  setCreatureFluidity: (val: number) => void;
  particleDensity: number;
  setParticleDensity: (val: number) => void;
  isHudOpen: boolean;
  setIsHudOpen: (open: boolean) => void;
  fps: number;
  setFps: (fps: number) => void;
  shockwaveCount: number;
  triggerShockwave: (x?: number, y?: number) => void;
  lastShockwave: { x: number; y: number; time: number } | null;
  isMoveMeMode: boolean;
  setIsMoveMeMode: (mode: boolean) => void;
}

const SignalEngineContext = createContext<SignalEngineContextType | null>(null);

export const SignalEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [styleMode, setStyleMode] = useState<RenderStyleMode>("prism");
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [audioVolume, setAudioVolumeState] = useState<number>(0.7);
  const [creatureSpeed, setCreatureSpeed] = useState<number>(1.0);
  const [creatureFluidity, setCreatureFluidity] = useState<number>(1.0);
  const [particleDensity, setParticleDensity] = useState<number>(1.0);
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);
  const [isMoveMeMode, setIsMoveMeMode] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [shockwaveCount, setShockwaveCount] = useState<number>(0);
  const [lastShockwave, setLastShockwave] = useState<{ x: number; y: number; time: number } | null>(null);

  const toggleAudio = useCallback(async () => {
    const active = await audioEngine.toggleMute();
    setAudioActive(active);
  }, []);

  const setAudioVolume = useCallback((vol: number) => {
    setAudioVolumeState(vol);
    audioEngine.setVolume(vol);
  }, []);

  const triggerShockwave = useCallback((x?: number, y?: number) => {
    const defaultX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    const defaultY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

    setLastShockwave({
      x: x !== undefined ? x : defaultX,
      y: y !== undefined ? y : defaultY,
      time: Date.now(),
    });

    setShockwaveCount((prev) => prev + 1);
    audioEngine.playShockwave();
  }, []);

  return (
    <SignalEngineContext.Provider
      value={{
        styleMode,
        setStyleMode,
        audioActive,
        toggleAudio,
        audioVolume,
        setAudioVolume,
        creatureSpeed,
        setCreatureSpeed,
        creatureFluidity,
        setCreatureFluidity,
        particleDensity,
        setParticleDensity,
        isHudOpen,
        setIsHudOpen,
        fps,
        setFps,
        shockwaveCount,
        triggerShockwave,
        lastShockwave,
        isMoveMeMode,
        setIsMoveMeMode,
      }}
    >
      {children}
    </SignalEngineContext.Provider>
  );
};

export const useSignalEngine = () => {
  const context = useContext(SignalEngineContext);
  if (!context) {
    throw new Error("useSignalEngine must be used within a SignalEngineProvider");
  }
  return context;
};
