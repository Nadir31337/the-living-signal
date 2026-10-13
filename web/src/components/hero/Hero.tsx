"use client";

import React, { useState, useEffect } from "react";
import { LivingSignalCanvas } from "../canvas/LivingSignalCanvas";
import { useSignalEngine } from "@/context/SignalEngineContext";
import { ProfileContent } from "@/types/content";
import { ArrowDown, Download, Sparkles, BookOpen, Zap } from "lucide-react";

interface HeroProps {
  profile: ProfileContent;
  onActiveProjectChange?: (index: number | null) => void;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { triggerShockwave, styleMode, isMoveMeMode, setIsMoveMeMode } = useSignalEngine();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleToggle = (moveMode: boolean) => {
    if (reducedMotion && moveMode) return;
    setIsMoveMeMode(moveMode);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden border-b border-signal-border/30"
      aria-label="Hero Section"
    >
      {/* Radial Gradient Vignette for light-through-water bioluminescent feel */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-signal-teal/5 via-signal-bg/50 to-signal-bg/90 z-[1]"
        aria-hidden="true"
      />

      {/* Main Hero Container */}
      <div
        className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-700 ${
          isMoveMeMode
            ? "opacity-25 pointer-events-none scale-95 blur-[1px]"
            : "opacity-100 pointer-events-auto scale-100 blur-0"
        }`}
      >
        <div className="flex flex-col items-start space-y-6 md:space-y-8">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-signal-teal/30 bg-signal-card/80 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-signal-teal animate-signal-pulse" />
            <span className="font-mono text-xs tracking-widest text-signal-teal uppercase">
              {profile.hero.eyebrow}
            </span>
          </div>

          {/* Oversized Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl break-words">
            {profile.hero.headline}
          </h1>

          {/* Subline */}
          <p className="font-body text-lg sm:text-xl text-signal-mist/90 max-w-2xl leading-relaxed">
            {profile.hero.subline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {profile.hero.ctas.map((cta) => {
              if (cta.primary) {
                return (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded text-sm font-mono tracking-wider uppercase font-semibold text-signal-bg bg-signal-teal hover:bg-signal-lime hover:shadow-glowLime transition-all duration-300"
                  >
                    <span>{cta.label}</span>
                    <ArrowDown className="ml-2 w-4 h-4" />
                  </a>
                );
              }
              if (cta.download) {
                return (
                  <a
                    key={cta.label}
                    href={cta.href}
                    download="Nadir_Saidi_CV.pdf"
                    className="inline-flex items-center justify-center px-5 py-3.5 rounded text-sm font-mono tracking-wider uppercase text-signal-mist border border-signal-border/80 hover:border-signal-teal hover:text-white bg-signal-card/60 backdrop-blur-sm transition-all duration-300"
                  >
                    <Download className="mr-2 w-4 h-4 text-signal-teal" />
                    <span>{cta.label}</span>
                  </a>
                );
              }
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded text-sm font-mono tracking-wider uppercase text-signal-mist hover:text-signal-teal border border-transparent hover:border-signal-border/50 transition-all duration-300"
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Two-State Toggle ("Read Me" / "Move Me") */}
      <div className="absolute bottom-8 right-6 md:right-12 z-30">
        <div
          role="group"
          aria-label="Hero view mode toggle"
          className="flex items-center p-1 rounded-full border border-signal-border bg-signal-card/90 backdrop-blur-md shadow-lg"
        >
          <button
            onClick={() => handleToggle(false)}
            aria-pressed={!isMoveMeMode}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
              !isMoveMeMode
                ? "bg-signal-teal text-signal-bg font-semibold shadow-glowTeal"
                : "text-signal-mist hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{profile.hero.toggleLabels.readMe}</span>
          </button>

          <button
            onClick={() => handleToggle(true)}
            disabled={reducedMotion}
            aria-pressed={isMoveMeMode}
            title={reducedMotion ? "Move Me disabled (prefers-reduced-motion)" : "Interactive network mode"}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
              isMoveMeMode
                ? "bg-signal-lime text-signal-bg font-semibold shadow-glowLime"
                : reducedMotion
                ? "opacity-40 cursor-not-allowed text-signal-dim"
                : "text-signal-mist hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.hero.toggleLabels.moveMe}</span>
          </button>
        </div>

        {/* Move Me Mode HUD notice when active */}
        {isMoveMeMode && (
          <div className="mt-3 flex items-center justify-end space-x-2">
            <button
              onClick={() => triggerShockwave()}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-signal-teal/20 border border-signal-teal/60 text-signal-teal hover:bg-signal-teal hover:text-signal-bg font-mono text-[10px] tracking-wider uppercase font-semibold transition-all shadow-glowTeal active:scale-95"
            >
              <Zap className="w-3 h-3" />
              <span>Emit Wave</span>
            </button>
            <span className="font-mono text-[10px] text-signal-lime tracking-wider uppercase bg-signal-subtle/80 px-2.5 py-1 rounded-full border border-signal-lime/30">
              Style: {styleMode.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
