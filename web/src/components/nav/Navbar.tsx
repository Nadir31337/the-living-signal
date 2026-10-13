"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApiHealth } from "@/hooks/useApiHealth";
import { MarqueeTicker } from "./MarqueeTicker";
import { AudioEqualizer } from "./AudioEqualizer";
import { Activity, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  marqueeText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  marqueeText = "ALWAYS ON // ALWAYS RELIABLE //",
}) => {
  const { health, checkHealth } = useApiHealth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "What I Do", href: "#what-i-do" },
    { label: "Projects", href: "#projects" },
    { label: "Principles", href: "#principles" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Learning", href: "#learning" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-signal-bg/85 backdrop-blur-md border-b border-signal-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo & Handle */}
          <Link
            href="/"
            className="group flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-teal"
          >
            <div className="w-8 h-8 rounded-full border border-signal-teal/40 bg-signal-subtle flex items-center justify-center group-hover:border-signal-teal group-hover:shadow-glowTeal transition-all duration-300">
              <span className="font-mono text-xs font-bold text-signal-teal tracking-tighter">
                NS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-signal-teal transition-colors">
                Nadir Saidi
              </span>
              <span className="font-mono text-[10px] tracking-wider text-signal-dim uppercase">
                @Nadir31337
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs tracking-wider uppercase text-signal-mist/80 hover:text-signal-teal transition-colors relative py-1 focus:outline-none focus-visible:text-signal-teal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Audio Synthesizer + API Heartbeat + Contact CTA */}
          <div className="flex items-center space-x-3">
            {/* Generative Audio Engine Toggle */}
            <AudioEqualizer />

            {/* Live Heartbeat Indicator */}
            <button
              onClick={checkHealth}
              title={`API Status: ${health.status.toUpperCase()} (${health.latencyMs ?? "--"}ms). Click to re-check.`}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-full border border-signal-border/50 bg-signal-card/60 hover:border-signal-teal/60 transition-all text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-teal"
              aria-label={`API Status: ${health.status}`}
            >
              <span className="relative flex h-2 w-2">
                {health.status === "online" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-teal opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    health.status === "online"
                      ? "bg-signal-teal"
                      : health.status === "checking"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                ></span>
              </span>
              <div className="hidden sm:flex items-center space-x-1.5 font-mono text-[11px] text-signal-mist">
                <Activity className="w-3 h-3 text-signal-teal/80" />
                <span>
                  {health.status === "online"
                    ? `LIVE ${health.latencyMs ? `// ${health.latencyMs}ms` : ""}`
                    : health.status === "checking"
                    ? "PROBING"
                    : "OFFLINE"}
                </span>
              </div>
            </button>

            {/* Contact Button */}
            <a
              href="#contact"
              className="relative group hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-mono tracking-wider uppercase text-signal-bg font-semibold rounded bg-signal-teal hover:bg-signal-lime hover:shadow-glowLime transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-lime"
            >
              <span>Contact</span>
              <ArrowUpRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-signal-mist hover:text-signal-teal focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-signal-card/95 border-b border-signal-border px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm tracking-wider uppercase text-signal-mist hover:text-signal-teal py-2 border-b border-signal-border/20"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center py-2.5 mt-2 rounded bg-signal-teal text-signal-bg font-mono text-xs uppercase font-semibold"
            >
              Contact Nadir
            </a>
          </nav>
        </div>
      )}

      {/* Sub-nav Marquee Ticker */}
      <MarqueeTicker phrase={marqueeText} variant="nav" />
    </header>
  );
};
