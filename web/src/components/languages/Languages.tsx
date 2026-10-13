"use client";

import React from "react";
import { LanguagesContent } from "@/types/content";
import { audioEngine } from "@/lib/audioEngine";
import { Globe2 } from "lucide-react";

interface LanguagesProps {
  content: LanguagesContent;
}

export const Languages: React.FC<LanguagesProps> = ({ content }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <section
      id="languages"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Languages & Proficiency Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <Globe2 className="w-4 h-4 text-signal-teal" />
            <span>[ 07 // MULTILINGUAL SIGNAL ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            LANGUAGES
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            Fluency across diverse cultural and technical environments.
          </p>
        </div>

        {/* Four Glowing Nodes with SVG Proficiency Rings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {content.languages.map((lang, idx) => {
            const strokeOffset =
              circumference - (lang.proficiencyPercent / 100) * circumference;
            const isNative = lang.level === "Native";

            return (
              <div
                key={lang.name}
                onMouseEnter={() => audioEngine.playChime(idx * 2 + 2, 0.35)}
                className="group relative rounded-xl border border-signal-border/60 bg-signal-card/80 p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-signal-teal hover:shadow-glowTeal hover:-translate-y-1 cursor-pointer"
              >
                {/* SVG Ring Node */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 flex items-center justify-center">
                  <svg
                    className="w-full h-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    {/* Background Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="rgba(79, 255, 208, 0.12)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Active Proficiency Signal Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={isNative ? "#4FFFD0" : "#B8FF6B"}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Inner Node Core */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display text-lg md:text-xl font-bold text-white tracking-tight">
                      {lang.proficiencyPercent}%
                    </span>
                    <span className="font-mono text-[10px] text-signal-dim uppercase">
                      Signal
                    </span>
                  </div>
                </div>

                {/* Language Info */}
                <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-signal-teal transition-colors">
                  {lang.name}
                </h3>
                <span className="font-mono text-xs text-signal-lime uppercase tracking-wider font-semibold">
                  {lang.level}
                </span>
                <span className="font-body text-xs text-signal-mist/70 mt-2">
                  {lang.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
