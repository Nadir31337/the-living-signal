"use client";

import React, { useEffect, useRef } from "react";
import { useSignalEngine } from "@/context/SignalEngineContext";
import { audioEngine } from "@/lib/audioEngine";
import { Volume2, VolumeX } from "lucide-react";

interface AudioEqualizerProps {
  showLabel?: boolean;
  className?: string;
}

export const AudioEqualizer: React.FC<AudioEqualizerProps> = ({
  showLabel = true,
  className = "",
}) => {
  const { audioActive, toggleAudio } = useSignalEngine();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const buffer = new Uint8Array(32);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (audioActive) {
        audioEngine.getWaveformData(buffer);
        const barWidth = canvas.width / 8;

        for (let i = 0; i < 8; i++) {
          const sample = buffer[i * 4] || 128;
          const normalized = Math.abs(sample - 128) / 128; // 0 to 1
          const minHeight = 3;
          const barHeight = Math.max(minHeight, normalized * canvas.height * 1.4);
          const x = i * barWidth;
          const y = (canvas.height - barHeight) / 2;

          ctx.fillStyle = i % 2 === 0 ? "#4FFFD0" : "#B8FF6B";
          ctx.shadowColor = "#4FFFD0";
          ctx.shadowBlur = 4;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
      } else {
        // Flat inactive line
        ctx.fillStyle = "rgba(201, 218, 214, 0.3)";
        ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 1.5);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [audioActive]);

  return (
    <button
      onClick={toggleAudio}
      title={audioActive ? "Mute Generative Soundscape" : "Enable Procedural Audio (100% Code)"}
      className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border border-signal-border/50 bg-signal-card/60 hover:border-signal-teal/60 hover:shadow-glowTeal transition-all text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-teal ${className}`}
      aria-label={audioActive ? "Mute Generative Sound" : "Enable Generative Sound"}
    >
      {audioActive ? (
        <Volume2 className="w-3.5 h-3.5 text-signal-teal animate-pulse" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-signal-mist/60" />
      )}

      {/* Mini Waveform Canvas */}
      <canvas
        ref={canvasRef}
        width={36}
        height={14}
        className="block rounded"
      />

      {showLabel && (
        <span className="hidden lg:inline font-mono text-[10px] uppercase tracking-wider text-signal-mist">
          {audioActive ? "SYNTH: ON" : "AUDIO: OFF"}
        </span>
      )}
    </button>
  );
};
