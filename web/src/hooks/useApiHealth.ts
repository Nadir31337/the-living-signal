"use client";

import { useState, useEffect, useCallback } from "react";

export interface ApiHealthState {
  status: "online" | "offline" | "checking";
  latencyMs: number | null;
  uptime: number | null;
  timestamp: string | null;
  lastChecked: Date | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function useApiHealth() {
  const [health, setHealth] = useState<ApiHealthState>({
    status: "checking",
    latencyMs: null,
    uptime: null,
    timestamp: null,
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      const roundTrip = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        setHealth({
          status: "online",
          latencyMs: roundTrip,
          uptime: data.uptime,
          timestamp: data.timestamp,
          lastChecked: new Date(),
        });
      } else {
        setHealth((prev) => ({
          ...prev,
          status: "offline",
          lastChecked: new Date(),
        }));
      }
    } catch {
      // Offline fallback
      setHealth((prev) => ({
        ...prev,
        status: "offline",
        latencyMs: null,
        lastChecked: new Date(),
      }));
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { health, checkHealth };
}
