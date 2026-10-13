import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        signal: {
          bg: "#05100F",
          card: "#091716",
          cardHover: "#0E2321",
          border: "rgba(79, 255, 208, 0.15)",
          borderBright: "rgba(79, 255, 208, 0.4)",
          teal: "#4FFFD0",
          lime: "#B8FF6B",
          mist: "#C9DAD6",
          dim: "#6B8580",
          subtle: "#122A27",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        glowTeal: "0 0 25px -5px rgba(79, 255, 208, 0.3)",
        glowLime: "0 0 25px -5px rgba(184, 255, 107, 0.3)",
        glowInner: "inset 0 0 20px rgba(79, 255, 208, 0.1)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "signal-pulse": "signalPulse 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        signalPulse: {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(79, 255, 208, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 8px rgba(79, 255, 208, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(79, 255, 208, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
