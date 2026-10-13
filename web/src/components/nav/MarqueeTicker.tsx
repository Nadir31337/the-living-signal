"use client";

import React from "react";

interface MarqueeTickerProps {
  phrase?: string;
  repeatCount?: number;
  className?: string;
  variant?: "nav" | "divider";
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  phrase = "ALWAYS ON // ALWAYS RELIABLE //",
  repeatCount = 8,
  className = "",
  variant = "nav",
}) => {
  const repeatedText = Array.from({ length: repeatCount }, () => phrase).join(" ");

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-signal-border/40 select-none ${
        variant === "nav"
          ? "bg-signal-bg/90 py-1.5 backdrop-blur-sm"
          : "bg-signal-card/60 py-3 my-12"
      } ${className}`}
      aria-label="Status marquee"
    >
      <div className="flex w-max motion-reduce:transform-none">
        <div className="flex shrink-0 animate-marquee motion-reduce:animate-none space-x-6 items-center">
          <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-signal-teal/80 uppercase">
            {repeatedText}
          </span>
        </div>
        <div
          className="flex shrink-0 animate-marquee motion-reduce:hidden space-x-6 items-center pl-6"
          aria-hidden="true"
        >
          <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-signal-teal/80 uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
