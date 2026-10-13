"use client";

import React from "react";
import { WhatIDoContent } from "@/types/content";
import { CheckCircle2 } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface WhatIDoProps {
  content: WhatIDoContent;
}

export const WhatIDo: React.FC<WhatIDoProps> = ({ content }) => {
  return (
    <section
      id="what-i-do"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="What I Do Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <span>[ 02 // CAPABILITIES ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            WHAT I DO
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            Reliability-driven backend engineering across the software delivery lifecycle.
          </p>
        </div>

        {/* Three Large Stacked Panels */}
        <div className="space-y-10 md:space-y-12">
          {content.panels.map((panel, idx) => {
            const isAlternate = idx % 2 === 1;
            const accentColor = isAlternate ? "text-signal-lime" : "text-signal-teal";
            const borderColor = isAlternate
              ? "hover:border-signal-lime/50"
              : "hover:border-signal-teal/50";

            return (
              <div
                key={panel.id}
                onMouseEnter={() => audioEngine.playChime(idx * 2, 0.25)}
                className={`relative overflow-hidden rounded-xl border border-signal-border/60 bg-signal-card/85 backdrop-blur-md p-8 md:p-12 transition-all duration-500 hover:-translate-y-1 ${borderColor} hover:shadow-glowTeal`}
              >
                {/* Oversized Repeating Background Label (Marquee Style) */}
                <div
                  className="absolute -top-6 -right-12 md:-right-6 select-none pointer-events-none opacity-[0.06] font-display font-black text-7xl sm:text-9xl tracking-tighter uppercase whitespace-nowrap"
                  aria-hidden="true"
                >
                  {panel.keyword} {panel.keyword} {panel.keyword}
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                  {/* Left: Number + Keyword + Summary */}
                  <div className="max-w-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="font-mono text-xs tracking-widest text-signal-dim uppercase">
                        [{panel.number}]
                      </span>
                      <h3
                        className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight uppercase ${accentColor}`}
                      >
                        {panel.keyword}
                      </h3>
                    </div>
                    <p className="font-body text-lg sm:text-xl text-white font-medium leading-relaxed">
                      &ldquo;{panel.summary}&rdquo;
                    </p>
                  </div>

                  {/* Right: Capability Checklist */}
                  <div className="lg:w-1/2 pt-2 lg:pt-0">
                    <ul className="space-y-3.5">
                      {panel.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start space-x-3 text-signal-mist group"
                        >
                          <CheckCircle2
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              isAlternate ? "text-signal-lime/80" : "text-signal-teal/80"
                            } transition-transform group-hover:scale-110`}
                          />
                          <span className="font-mono text-sm sm:text-base leading-relaxed tracking-wide group-hover:text-white transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
