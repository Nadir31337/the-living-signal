"use client";

import React from "react";
import { ProfileContent } from "@/types/content";
import { ArrowUp } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface FooterProps {
  profile: ProfileContent;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    audioEngine.playTactileTick();
    audioEngine.playChime(8, 0.4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-signal-border/40 bg-signal-bg/85 backdrop-blur-[2px] py-12 text-signal-dim font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Tagline */}
          <div className="flex items-center space-x-2">
            <span>&ldquo;{profile.footer.tagline}&rdquo;</span>
            <span className="text-signal-teal">•</span>
            <span>{currentYear}</span>
          </div>

          {/* Identity & Rights */}
          <div className="flex items-center space-x-4">
            <span className="text-signal-mist">
              {profile.name} {"//"} @{profile.handle}
            </span>
            <span>•</span>
            <span className="text-signal-dim">{profile.location}</span>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-signal-mist hover:text-signal-teal transition-colors p-2 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-teal"
            aria-label="Back to top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
