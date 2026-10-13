"use client";

import React, { useEffect, useRef } from "react";

interface ProjectNodeGraphPreviewProps {
  projectId: string;
  color?: string;
  isActive?: boolean;
}

export const ProjectNodeGraphPreview: React.FC<ProjectNodeGraphPreviewProps> = ({
  projectId,
  color = "#4FFFD0",
  isActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = 320;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    // Seed nodes based on projectId
    const nodeCount = 9;
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: 40 + (i % 3) * 110 + (Math.random() - 0.5) * 30,
        y: 35 + Math.floor(i / 3) * 55 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: i === 4 ? 5 : 3,
      });
    }

    if (prefersReducedMotion) {
      ctx.fillStyle = "#091716";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = "rgba(79, 255, 208, 0.15)";
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      return;
    }

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.02;

      // Update
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 15 || n.x > width - 15) n.vx *= -1;
        if (n.y < 15 || n.y > height - 15) n.vy *= -1;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(79, 255, 208, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Moving pulse on edges
            const progress = (Math.sin(t * 1.5 + i + j) + 1) / 2;
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;

            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }
        }
      }

      // Nodes
      nodes.forEach((n, idx) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = idx === 4 || isActive ? 12 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [projectId, color, isActive]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded bg-signal-card/80 border border-signal-border/50">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-3 font-mono text-[10px] tracking-widest text-signal-mist/60 uppercase">
        Live Node Graph // {projectId}
      </div>
    </div>
  );
};
