"use client";

import React from "react";
import { ProfileContent } from "@/types/content";
import { Terminal, MapPin, GraduationCap } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface AboutProps {
  profile: ProfileContent;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section
      id="about"
      className="py-20 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="About Nadir Saidi"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-signal-border/60 bg-signal-card/75 backdrop-blur-md p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-signal-teal/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-signal-border/30 pb-5">
              <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase">
                <Terminal className="w-4 h-4 text-signal-teal" />
                <span>{"ABOUT // ARCHITECTURE & MINDSET"}</span>
              </div>
              <div className="flex items-center space-x-4 font-mono text-xs text-signal-dim">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-signal-lime" />
                  {profile.location}
                </span>
                <span className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-signal-teal" />
                  BAU Software Engineering
                </span>
              </div>
            </div>

            {/* Core Bio Statement */}
            <p className="font-body text-lg sm:text-xl text-signal-mist/95 leading-relaxed font-normal">
              {profile.about.bio}
            </p>

            {/* Interest Tags (Mono) */}
            <div className="pt-4">
              <p className="font-mono text-xs tracking-widest text-signal-dim uppercase mb-3">
                {"// Focus & Interests"}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {profile.about.interestTags.map((tag) => (
                  <span
                    key={tag}
                    onMouseEnter={() => audioEngine.playTactileTick()}
                    className="inline-flex items-center px-3 py-1.5 rounded-full border border-signal-teal/30 bg-signal-subtle/50 font-mono text-xs text-signal-teal tracking-wide hover:border-signal-teal hover:bg-signal-subtle transition-all cursor-default hover:scale-105"
                  >
                    #{tag.toLowerCase().replace(/\s+/g, "-")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
