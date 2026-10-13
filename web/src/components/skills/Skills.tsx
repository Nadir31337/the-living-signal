"use client";

import React, { useState } from "react";
import { SkillsContent } from "@/types/content";
import { audioEngine } from "@/lib/audioEngine";
import { useSignalEngine } from "@/context/SignalEngineContext";
import { Network, Sparkles, Layers } from "lucide-react";

interface SkillsProps {
  content: SkillsContent;
}

export const Skills: React.FC<SkillsProps> = ({ content }) => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const { triggerShockwave } = useSignalEngine();

  const clusterIcons = [Layers, Network, Sparkles];

  return (
    <section
      id="skills"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Skills & Constellations Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <span>[ 05 // SKILL CONSTELLATIONS ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            SKILLS & CAPABILITIES
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            Grouped as interconnected biological signal clusters, not arbitrary progress bars.
          </p>
        </div>

        {/* Constellation Clusters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.clusters.map((cluster, idx) => {
            const Icon = clusterIcons[idx] || Layers;
            const isHighlighted = idx === 1;

            return (
              <div
                key={cluster.category}
                className={`relative rounded-xl border p-8 bg-signal-card/80 transition-all duration-300 flex flex-col justify-between ${
                  isHighlighted
                    ? "border-signal-teal/50 shadow-glowTeal"
                    : "border-signal-border/60 hover:border-signal-border"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-signal-subtle border border-signal-teal/30 text-signal-teal">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white tracking-tight">
                      {cluster.category}
                    </h3>
                  </div>

                  <p className="font-body text-sm text-signal-mist/70 mb-8 leading-relaxed">
                    {cluster.description}
                  </p>

                  {/* Constellation Node Chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {cluster.skills.map((skill, sIdx) => {
                      const isActive = activeSkill === skill;
                      return (
                        <button
                          key={skill}
                          type="button"
                          onMouseEnter={() => {
                            setActiveSkill(skill);
                            audioEngine.playChime(idx * 3 + sIdx, 0.25);
                          }}
                          onMouseLeave={() => setActiveSkill(null)}
                          onClick={(e) => {
                            triggerShockwave(e.clientX, e.clientY);
                          }}
                          className={`group relative flex items-center space-x-2 px-3.5 py-2 rounded-lg border font-mono text-xs tracking-wide transition-all duration-300 cursor-pointer select-none ${
                            isActive
                              ? "border-signal-lime bg-signal-lime/15 text-white shadow-glowLime scale-105"
                              : "border-signal-border/80 bg-signal-subtle/50 text-signal-mist hover:border-signal-teal hover:text-white"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              isActive ? "bg-signal-lime animate-ping" : "bg-signal-teal/70"
                            }`}
                          />
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-signal-border/20 flex items-center justify-between font-mono text-[11px] text-signal-dim">
                  <span>Cluster 0{idx + 1}</span>
                  <span>{cluster.skills.length} Interconnected Nodes</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden [TODO] placeholder as instructed in prompt */}
        {content.show_todo_placeholder && content._todo_placeholder && (
          <div className="mt-8 p-4 rounded border border-signal-border bg-signal-card text-xs font-mono text-signal-dim">
            {content._todo_placeholder}
          </div>
        )}
      </div>
    </section>
  );
};
