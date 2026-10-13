"use client";

import React, { useState } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { Volume2, Clock } from "lucide-react";

export const TimeAnnouncerAudioTest: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcedTime, setAnnouncedTime] = useState<string | null>(null);

  const handleAnnounceTime = () => {
    if (typeof window === "undefined") return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setAnnouncedTime(timeStr);
    setIsSpeaking(true);

    // Play subtle audio chime
    audioEngine.playChime(5, 0.4);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`The current time is ${timeStr}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 1200);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-lg border border-signal-teal/30 bg-signal-subtle/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <Clock className="w-5 h-5 text-signal-teal" />
        <div>
          <p className="font-mono text-xs font-semibold text-white">
            Interactive Speech & Time Synthesis Test
          </p>
          <p className="font-mono text-[10px] text-signal-dim">
            100% Browser Native • Web Speech API & Web Audio Chime
          </p>
        </div>
      </div>

      <button
        onClick={handleAnnounceTime}
        disabled={isSpeaking}
        className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded bg-signal-teal text-signal-bg font-mono text-xs font-semibold uppercase tracking-wider hover:bg-signal-lime transition-all disabled:opacity-50"
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>{isSpeaking ? "Announcing..." : announcedTime ? `Re-announce (${announcedTime})` : "Test Announcement"}</span>
      </button>
    </div>
  );
};
