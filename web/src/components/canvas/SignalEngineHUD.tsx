"use client";

import React, { useState } from "react";
import { useSignalEngine, RenderStyleMode } from "@/context/SignalEngineContext";
import { audioEngine } from "@/lib/audioEngine";
import {
  Sliders,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Wand2,
} from "lucide-react";

export const SignalEngineHUD: React.FC = () => {
  const {
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
    fps,
    triggerShockwave,
  } = useSignalEngine();

  const [isOpen, setIsOpen] = useState(false);

  const styleOptions: { id: RenderStyleMode; label: string; icon: string; desc: string }[] = [
    {
      id: "prism",
      label: "Prism Shader",
      icon: "💎",
      desc: "Bioluminescent crystal facets & deep-sea light",
    },
    {
      id: "blueprint",
      label: "Blueprint Grid",
      icon: "📐",
      desc: "Lined engineering paper & pen crosshatching",
    },
    {
      id: "parchment",
      label: "Organic Paper",
      icon: "📜",
      desc: "Warm sketched charcoal & mycelium rings",
    },
  ];

  return (
    <aside
      aria-label="Signal Engine Controls"
      className="fixed bottom-6 left-6 z-40 max-w-sm w-full sm:w-80 select-none flex flex-col justify-end"
    >
      {/* Expanded Control Matrix (Expands Upwards) */}
      {isOpen && (
        <div className="mb-2 p-4 rounded-2xl border border-signal-border/70 bg-signal-card/95 backdrop-blur-xl shadow-2xl text-signal-mist space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Render Style Morphing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-wider uppercase text-signal-dim flex items-center">
                <Layers className="w-3 h-3 mr-1 text-signal-teal" /> Render Aesthetic
              </span>
              <span className="font-mono text-[9px] text-signal-teal uppercase">
                {styleMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {styleOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setStyleMode(opt.id);
                    audioEngine.playChime(opt.id === "prism" ? 4 : opt.id === "blueprint" ? 2 : 0, 0.4);
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                    styleMode === opt.id
                      ? "border-signal-teal bg-signal-subtle text-white shadow-glowTeal font-medium"
                      : "border-signal-border/50 bg-signal-bg/50 text-signal-mist/80 hover:border-signal-teal/40 hover:text-white"
                  }`}
                  title={opt.desc}
                >
                  <span className="text-base mb-0.5">{opt.icon}</span>
                  <span className="font-mono text-[10px] leading-tight">{opt.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Interactive Shockwave & Audio */}
          <div className="pt-2 border-t border-signal-border/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider uppercase text-signal-dim flex items-center">
                <Activity className="w-3 h-3 mr-1 text-signal-lime" /> Signal Pulse & Chimes
              </span>
            </div>

            <div className="flex gap-2">
              {/* Trigger Shockwave */}
              <button
                onClick={() => triggerShockwave()}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-signal-teal/20 border border-signal-teal/50 hover:bg-signal-teal hover:text-signal-bg text-signal-teal font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-glowTeal active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Emit Wave</span>
              </button>

              {/* Toggle Audio */}
              <button
                onClick={toggleAudio}
                className={`flex items-center justify-center py-2 px-3 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  audioActive
                    ? "bg-signal-lime/20 border-signal-lime/60 text-signal-lime shadow-glowLime"
                    : "bg-signal-bg/60 border-signal-border text-signal-dim hover:text-signal-mist"
                }`}
                title={audioActive ? "Mute Generative Synth" : "Activate Generative Synth (100% Code)"}
              >
                {audioActive ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                <span>{audioActive ? "Synth" : "Mute"}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Fine Tuning Sliders */}
          <div className="pt-2 border-t border-signal-border/40 space-y-2.5">
            {/* Fluidity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-signal-dim">Fluidity / Undulation</span>
                <span className="text-signal-teal">{creatureFluidity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.0"
                step="0.1"
                value={creatureFluidity}
                onChange={(e) => setCreatureFluidity(parseFloat(e.target.value))}
                className="w-full accent-signal-teal bg-signal-border/60 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Drift Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-signal-dim">Creature Velocity</span>
                <span className="text-signal-lime">{creatureSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={creatureSpeed}
                onChange={(e) => setCreatureSpeed(parseFloat(e.target.value))}
                className="w-full accent-signal-lime bg-signal-border/60 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Particle Density */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-signal-dim">Particle Stream</span>
                <span className="text-signal-mist">{particleDensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={particleDensity}
                onChange={(e) => setParticleDensity(parseFloat(e.target.value))}
                className="w-full accent-signal-mist bg-signal-border/60 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Volume slider when audio is active */}
            {audioActive && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-signal-dim">Harmonic Gain</span>
                  <span className="text-signal-teal">{Math.round(audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-full accent-signal-teal bg-signal-border/60 h-1 rounded appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-signal-border/30 flex items-center justify-between text-[9px] font-mono text-signal-dim">
            <span className="flex items-center">
              <Wand2 className="w-2.5 h-2.5 mr-1 text-signal-teal" /> Pure Canvas 2D + Web Audio
            </span>
            <span className="text-signal-teal font-semibold">0 Media Assets</span>
          </div>
        </div>
      )}

      {/* HUD Header Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-signal-teal/40 bg-signal-card/90 backdrop-blur-md text-white shadow-glowTeal hover:border-signal-teal transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-teal"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-signal-subtle border border-signal-teal/50 flex items-center justify-center text-signal-teal">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-xs font-bold text-signal-teal tracking-wider uppercase">
              Signal Engine
            </span>
            <span className="font-mono text-[9px] text-signal-dim tracking-tight">
              100% CODE • PROCEDURAL TOOL
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-signal-subtle text-signal-lime border border-signal-lime/30">
            {fps} FPS
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-signal-mist" />
          ) : (
            <ChevronUp className="w-4 h-4 text-signal-mist" />
          )}
        </div>
      </button>
    </aside>
  );
};
