"use client";

import React from "react";
import { PrinciplesContent } from "@/types/content";
import { audioEngine } from "@/lib/audioEngine";
import { ShieldCheck, CheckCheck, Compass } from "lucide-react";

interface PrinciplesProps {
  content: PrinciplesContent;
}

export const Principles: React.FC<PrinciplesProps> = ({ content }) => {
  const icons = [ShieldCheck, CheckCheck, Compass];

  return (
    <section
      id="principles"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Core Principles Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <span>[ 04 // CORE VALUES ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            PRINCIPLES
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            Non-negotiables guiding how I design, test, and ship backend software.
          </p>
        </div>

        {/* Three-Column Values Triptych */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {content.principles.map((principle, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            const isCenter = idx === 1;

            return (
              <div
                key={principle.number}
                onMouseEnter={() => audioEngine.playChime(idx * 2 + 1, 0.35)}
                className={`group relative rounded-xl border p-8 md:p-10 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isCenter
                    ? "border-signal-lime/40 bg-signal-card/85 hover:border-signal-lime hover:shadow-glowLime hover:-translate-y-1"
                    : "border-signal-border/60 bg-signal-card/75 hover:border-signal-teal hover:shadow-glowTeal hover:-translate-y-1"
                }`}
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs tracking-widest text-signal-dim uppercase">
                      [{principle.number}]
                    </span>
                    <Icon
                      className={`w-6 h-6 ${
                        isCenter ? "text-signal-lime" : "text-signal-teal"
                      } transition-transform group-hover:scale-110`}
                    />
                  </div>

                  {/* Uppercase Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white uppercase mb-4">
                    {principle.title}
                  </h3>

                  {/* One-Sentence Statement */}
                  <p className="font-body text-base text-signal-mist/90 leading-relaxed font-normal">
                    &ldquo;{principle.statement}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-signal-border/20">
                  <span className="font-mono text-[11px] tracking-wider text-signal-dim uppercase">
                    Core Standard
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
