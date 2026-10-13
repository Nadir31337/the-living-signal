"use client";

import React from "react";
import { LearningContent } from "@/types/content";
import { BookMarked, Cpu, Cloud, CheckSquare, BrainCircuit } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface CurrentlyLearningProps {
  content: LearningContent;
}

export const CurrentlyLearning: React.FC<CurrentlyLearningProps> = ({
  content,
}) => {
  const icons = [Cpu, Cloud, CheckSquare, BrainCircuit];

  return (
    <section
      id="learning"
      className="py-24 md:py-36 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Currently Learning Sticky Section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <BookMarked className="w-4 h-4 text-signal-teal" />
            <span>[ 08 // KNOWLEDGE EXPANSION ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            CURRENTLY LEARNING
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            {content.subheading}
          </p>
        </div>

        {/* Sticky Card-Stack Container */}
        <div className="relative space-y-8 md:space-y-12">
          {content.cards.map((card, idx) => {
            const Icon = icons[idx] || Cpu;
            // Sticky top position offset for each card to create stacked deck effect
            const topOffset = `calc(100px + ${idx * 28}px)`;

            return (
              <div
                key={card.step}
                onMouseEnter={() => audioEngine.playChime(idx + 3, 0.3)}
                style={{ top: topOffset }}
                className="sticky rounded-2xl border border-signal-border/80 bg-signal-card/85 backdrop-blur-xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:border-signal-teal hover:shadow-glowTeal"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Left Metadata */}
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg bg-signal-subtle border border-signal-teal/30 text-signal-teal">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs tracking-widest text-signal-lime uppercase font-semibold">
                        Module // {card.step}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {card.topic}
                    </h3>

                    <p className="font-body text-base sm:text-lg text-signal-mist/90 leading-relaxed font-normal">
                      {card.summary}
                    </p>
                  </div>

                  {/* Right: Technical Focus Pill Box */}
                  <div className="md:w-72 shrink-0 rounded-lg border border-signal-border/40 bg-signal-subtle/50 p-4">
                    <p className="font-mono text-[11px] text-signal-dim tracking-wider uppercase mb-2">
                      Active Investigation:
                    </p>
                    <p className="font-mono text-xs text-signal-teal leading-relaxed">
                      {card.focus}
                    </p>
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
