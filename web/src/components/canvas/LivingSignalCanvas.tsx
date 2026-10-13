"use client";

import React, { useEffect, useRef } from "react";
import { useSignalEngine, RenderStyleMode } from "@/context/SignalEngineContext";
import { audioEngine } from "@/lib/audioEngine";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  isProjectNode: boolean;
  projectIndex?: number;
  label?: string;
  glowIntensity: number;
  color: string;
}

interface Pulse {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface DiamondShard {
  x: number;
  y: number;
  size: number;
  vy: number;
  alpha: number;
  rot: number;
  rotSpeed: number;
  color: string;
}

interface ShockwaveWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

interface TrailBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface LivingSignalCanvasProps {
  isMoveMeMode?: boolean;
  activeProjectNode?: number | null;
  className?: string;
}

export const LivingSignalCanvas: React.FC<LivingSignalCanvasProps> = ({
  isMoveMeMode: propMoveMe,
  activeProjectNode = null,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    styleMode,
    creatureSpeed,
    creatureFluidity,
    particleDensity,
    lastShockwave,
    setFps,
    isMoveMeMode: contextMoveMe,
  } = useSignalEngine();

  const isMoveMeMode = propMoveMe !== undefined ? propMoveMe : contextMoveMe;

  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  const lastShockwaveRef = useRef(lastShockwave);
  lastShockwaveRef.current = lastShockwave;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize Network Nodes
    const NODE_COUNT = Math.min(Math.floor((width * height) / 22000), 45);
    const nodes: Node[] = [];

    const projectTitles = [
      "API Monitor",
      "Ticket Router",
      "Price Aggregator",
      "Time Announcer",
    ];

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const dist = Math.min(width, height) * 0.28;
      nodes.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 5,
        baseRadius: 5,
        isProjectNode: true,
        projectIndex: i,
        label: projectTitles[i],
        glowIntensity: 0.8,
        color: i % 2 === 0 ? "#4FFFD0" : "#B8FF6B",
      });
    }

    for (let i = 4; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1.5,
        baseRadius: Math.random() * 2 + 1.5,
        isProjectNode: false,
        glowIntensity: 0.4,
        color: Math.random() > 0.3 ? "#4FFFD0" : "#B8FF6B",
      });
    }

    // Floating diamond shards
    const shards: DiamondShard[] = [];
    const SHARD_COUNT = 24;
    for (let i = 0; i < SHARD_COUNT; i++) {
      shards.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 6 + 4,
        vy: -0.3 - Math.random() * 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: ["#4FFFD0", "#FF6BF3", "#FFD700", "#B8FF6B"][Math.floor(Math.random() * 4)],
      });
    }

    const pulses: Pulse[] = [];
    const shockwaves: ShockwaveWave[] = [];
    const trailBubbles: TrailBubble[] = [];
    const maxConnectionDistance = 150;

    // The Procedural Living Signal Organism
    const creature = {
      x: width * 0.5,
      y: height * 0.45,
      vx: 0,
      vy: 0,
      targetX: width * 0.5,
      targetY: height * 0.45,
      angle: 0,
      scale: 1.0,
      blinkTimer: 0,
      isBlinking: false,
      tentaclePhases: [0, Math.PI * 0.4],
      tailKicks: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const createShockwave = (cx: number, cy: number) => {
      shockwaves.push({
        x: cx,
        y: cy,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.5,
        speed: 12,
        alpha: 1.0,
      });

      nodes.forEach((node) => {
        const dx = node.x - cx;
        const dy = node.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < 240 && d > 1) {
          node.vx += (dx / d) * 2.5;
          node.vy += (dy / d) * 2.5;
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      createShockwave(e.clientX, e.clientY);
      audioEngine.playShockwave();

      creature.targetX = e.clientX;
      creature.targetY = e.clientY;
    };

    // Scroll physics & cascading audio chimes across the whole page!
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollVelocity = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Math.abs(delta) > 2) {
        scrollVelocity += Math.sign(delta) * Math.min(Math.abs(delta) * 0.2, 14);
        scrollVelocity = Math.max(-28, Math.min(28, scrollVelocity));

        // Musical cascading chimes on scroll (zero buzz, pure bells)
        audioEngine.playScrollChime(delta > 0 ? "down" : "up", Math.abs(delta) / 10);

        // Spawn luminous trailing bubbles
        const count = Math.min(4, Math.ceil(Math.abs(delta) / 6));
        for (let b = 0; b < count; b++) {
          trailBubbles.push({
            x: creature.x - Math.cos(creature.angle) * 35 + (Math.random() - 0.5) * 20,
            y: creature.y - Math.sin(creature.angle) * 35 + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2.0,
            vy: -Math.sign(delta) * (Math.random() * 2.5 + 1.2),
            radius: Math.random() * 4.5 + 2,
            alpha: 0.95,
            color: Math.random() > 0.5 ? "#4FFFD0" : "#B8FF6B",
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    canvas.addEventListener("click", handleClick);

    let lastPulseTime = 0;
    let lastProcessedShockTime = 0;
    let frameCount = 0;
    let lastFpsCalc = performance.now();

    // -------------------------------------------------------------
    // RENDER FUNCTIONS FOR PROCEDURAL CREATURE & SHADER MODES
    // -------------------------------------------------------------

    const drawCrosshatchPoly = (
      points: { x: number; y: number }[],
      density: number = 5,
      color: string = "rgba(40, 80, 180, 0.7)"
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
      ctx.clip();

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.0;

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });

      for (let x = minX - (maxY - minY); x < maxX; x += density) {
        ctx.beginPath();
        ctx.moveTo(x, minY);
        ctx.lineTo(x + (maxY - minY), maxY);
        ctx.stroke();
      }

      for (let x = minX; x < maxX + (maxY - minY); x += density * 1.5) {
        ctx.beginPath();
        ctx.moveTo(x, minY);
        ctx.lineTo(x - (maxY - minY), maxY);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCreature = (time: number, mode: RenderStyleMode) => {
      ctx.save();
      ctx.translate(creature.x, creature.y);
      ctx.rotate(creature.angle);
      ctx.scale(creature.scale, creature.scale);

      const breathing = Math.sin(time * 0.003 * creatureFluidity) * 2;
      const bodyRadius = 38 + breathing;

      // 1. TENTACLES / ANTENNAE
      const tentacleSegments = 14;
      const tentacleLength = 65;
      const tentacleOffsets = [-12, 12];

      tentacleOffsets.forEach((offsetY, tIdx) => {
        ctx.save();
        ctx.beginPath();
        const startX = -bodyRadius * 0.5;
        const startY = offsetY;
        ctx.moveTo(startX, startY);

        for (let s = 1; s <= tentacleSegments; s++) {
          const u = s / tentacleSegments;
          const wave =
            Math.sin(time * 0.005 * creatureFluidity + s * 0.4 + creature.tentaclePhases[tIdx]) *
            (14 * u * creatureFluidity);
          const px = startX - u * tentacleLength;
          const py = startY + wave;
          ctx.lineTo(px, py);
        }

        if (mode === "prism") {
          const grad = ctx.createLinearGradient(startX, startY, startX - tentacleLength, startY);
          grad.addColorStop(0, tIdx === 0 ? "#4FFFD0" : "#B8FF6B");
          grad.addColorStop(0.5, "#FF6BF3");
          grad.addColorStop(1, "rgba(79, 255, 208, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 4.5;
          ctx.lineCap = "round";
          ctx.shadowColor = "#4FFFD0";
          ctx.shadowBlur = 12;
          ctx.stroke();
        } else if (mode === "blueprint") {
          ctx.strokeStyle = tIdx === 0 ? "rgba(220, 60, 60, 0.9)" : "rgba(30, 80, 190, 0.85)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else {
          ctx.strokeStyle = tIdx === 0 ? "rgba(215, 100, 30, 0.9)" : "rgba(180, 70, 20, 0.85)";
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }
        ctx.restore();
      });

      // 2. CREATURE BODY FACETS
      const hull = [
        { x: bodyRadius * 0.9, y: 0 },
        { x: bodyRadius * 0.4, y: -bodyRadius * 0.7 },
        { x: -bodyRadius * 0.3, y: -bodyRadius * 0.85 },
        { x: -bodyRadius * 0.85, y: -bodyRadius * 0.3 },
        { x: -bodyRadius * 0.9, y: bodyRadius * 0.2 },
        { x: -bodyRadius * 0.3, y: bodyRadius * 0.8 },
        { x: bodyRadius * 0.4, y: bodyRadius * 0.65 },
      ];

      const centerVertex = { x: -bodyRadius * 0.05, y: 0 };

      if (mode === "prism") {
        const facetHues = [
          "rgba(79, 255, 208, 0.85)",
          "rgba(184, 255, 107, 0.85)",
          "rgba(255, 107, 243, 0.8)",
          "rgba(79, 180, 255, 0.85)",
          "rgba(255, 215, 0, 0.8)",
          "rgba(240, 90, 140, 0.85)",
          "rgba(120, 255, 210, 0.85)",
        ];

        for (let i = 0; i < hull.length; i++) {
          const next = hull[(i + 1) % hull.length];
          ctx.beginPath();
          ctx.moveTo(hull[i].x, hull[i].y);
          ctx.lineTo(next.x, next.y);
          ctx.lineTo(centerVertex.x, centerVertex.y);
          ctx.closePath();

          const grad = ctx.createLinearGradient(hull[i].x, hull[i].y, next.x, next.y);
          grad.addColorStop(0, facetHues[i % facetHues.length]);
          grad.addColorStop(1, facetHues[(i + 2) % facetHues.length]);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y);
        ctx.closePath();
        ctx.strokeStyle = "#4FFFD0";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#4FFFD0";
        ctx.shadowBlur = 18;
        ctx.stroke();
      } else if (mode === "blueprint") {
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(30, 60, 140, 0.15)";
        ctx.fill();

        drawCrosshatchPoly(hull, 4.5, "rgba(30, 80, 190, 0.75)");

        ctx.strokeStyle = "rgba(20, 50, 150, 0.95)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(20, 50, 150, 0.8)";
        ctx.fillText("SIG-NODE: 0x4F", bodyRadius * 0.95, -10);
      } else {
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y);
        ctx.closePath();
        ctx.fillStyle = "#2D4A58";
        ctx.fill();
        ctx.strokeStyle = "#1A2E38";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 3. EYE
      const eyeX = bodyRadius * 0.45;
      const eyeY = -bodyRadius * 0.15;
      const eyeRadius = 11;

      const globalEyeX = creature.x + Math.cos(creature.angle) * eyeX - Math.sin(creature.angle) * eyeY;
      const globalEyeY = creature.y + Math.sin(creature.angle) * eyeX + Math.cos(creature.angle) * eyeY;
      const targetAimX = mouseRef.current.active ? mouseRef.current.x : width / 2;
      const targetAimY = mouseRef.current.active ? mouseRef.current.y : height / 2;
      const eyeAngle = Math.atan2(targetAimY - globalEyeY, targetAimX - globalEyeX) - creature.angle;
      const pupilDist = 3.5;

      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fillStyle = mode === "parchment" ? "#FFFFFF" : "#05100F";
      ctx.fill();
      ctx.strokeStyle = mode === "prism" ? "#4FFFD0" : mode === "blueprint" ? "rgba(30,80,190,0.9)" : "#1A2E38";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (!creature.isBlinking) {
        const pupilX = eyeX + Math.cos(eyeAngle) * pupilDist;
        const pupilY = eyeY + Math.sin(eyeAngle) * pupilDist;

        ctx.beginPath();
        ctx.arc(pupilX, pupilY, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = mode === "prism" ? "#B8FF6B" : mode === "parchment" ? "#1A2E38" : "#2040B0";
        if (mode === "prism") {
          ctx.shadowColor = "#B8FF6B";
          ctx.shadowBlur = 10;
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pupilX - 2, pupilY - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // 4. FIN KICK
      const finKick = Math.sin(time * 0.008 * creatureFluidity) * 0.35;
      ctx.save();
      ctx.translate(-bodyRadius * 0.8, bodyRadius * 0.35);
      ctx.rotate(finKick);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-24, 6);
      ctx.strokeStyle = mode === "prism" ? "#4FFFD0" : mode === "blueprint" ? "rgba(30,80,190,0.85)" : "#2D4A58";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    if (prefersReducedMotion) {
      ctx.fillStyle = "#05100F";
      ctx.fillRect(0, 0, width, height);
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }
      return;
    }

    // -------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // -------------------------------------------------------------
    const animate = (timestamp: number) => {
      frameCount++;
      if (timestamp - lastFpsCalc >= 1000) {
        setFps(Math.round((frameCount * 1000) / (timestamp - lastFpsCalc)));
        frameCount = 0;
        lastFpsCalc = timestamp;
      }

      // 1. Clear background
      if (styleMode === "prism") {
        ctx.fillStyle = "#05100F";
        ctx.fillRect(0, 0, width, height);

        const grad = ctx.createRadialGradient(
          creature.x, creature.y, 10,
          creature.x, creature.y, 350
        );
        grad.addColorStop(0, "rgba(79, 255, 208, 0.08)");
        grad.addColorStop(0.5, "rgba(184, 255, 107, 0.03)");
        grad.addColorStop(1, "rgba(5, 16, 15, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (styleMode === "blueprint") {
        ctx.fillStyle = "#F5F8FC";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(65, 115, 215, 0.12)";
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = "#F2ECD9";
        ctx.fillRect(0, 0, width, height);
      }

      const currShock = lastShockwaveRef.current;
      if (currShock && currShock.time > lastProcessedShockTime) {
        createShockwave(currShock.x, currShock.y);
        lastProcessedShockTime = currShock.time;
      }

      // 2. Animate shards
      if (styleMode === "prism") {
        shards.forEach((shard) => {
          shard.y += shard.vy * particleDensity;
          shard.rot += shard.rotSpeed;
          if (shard.y < -20) {
            shard.y = height + 20;
            shard.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(shard.x, shard.y);
          ctx.rotate(shard.rot);
          ctx.beginPath();
          ctx.moveTo(0, -shard.size);
          ctx.lineTo(shard.size * 0.6, 0);
          ctx.lineTo(0, shard.size);
          ctx.lineTo(-shard.size * 0.6, 0);
          ctx.closePath();
          ctx.fillStyle = shard.color;
          ctx.globalAlpha = shard.alpha;
          ctx.shadowColor = shard.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        });
      }

      // Smoothly decay scroll velocity each frame
      scrollVelocity *= 0.92;

      // 3. Update nodes drift (with gentle scroll parallax)
      const mouse = mouseRef.current;
      nodes.forEach((node) => {
        node.x += node.vx * (isMoveMeMode ? 1.3 : 0.8);
        node.y += node.vy * (isMoveMeMode ? 1.3 : 0.8) - scrollVelocity * 0.08;

        if (node.x < 15) { node.x = 15; node.vx *= -1; }
        if (node.x > width - 15) { node.x = width - 15; node.vx *= -1; }
        if (node.y < 10) { node.y = height - 15; }
        if (node.y > height - 10) { node.y = 15; }

        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          const maxInfluence = isMoveMeMode ? 220 : 130;

          if (dist < maxInfluence && dist > 1) {
            const force = (1 - dist / maxInfluence) * 0.25;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
            node.radius = node.baseRadius * 1.35;
          } else {
            node.radius += (node.baseRadius - node.radius) * 0.05;
          }
        }
      });

      // 4. Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDistance) {
            const baseAlpha = (1 - dist / maxConnectionDistance) * 0.25;
            const isHighlight =
              activeProjectNode !== null &&
              ((nodeA.isProjectNode && nodeA.projectIndex === activeProjectNode) ||
                (nodeB.isProjectNode && nodeB.projectIndex === activeProjectNode));

            const alpha = isHighlight ? Math.min(baseAlpha * 3.2, 0.85) : baseAlpha;

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            if (styleMode === "prism") {
              ctx.strokeStyle = isHighlight
                ? `rgba(184, 255, 107, ${alpha})`
                : `rgba(79, 255, 208, ${alpha})`;
              ctx.lineWidth = isHighlight ? 2.0 : 0.9;
            } else if (styleMode === "blueprint") {
              ctx.strokeStyle = `rgba(30, 80, 190, ${alpha * 1.5})`;
              ctx.lineWidth = isHighlight ? 1.8 : 0.8;
            } else {
              ctx.strokeStyle = `rgba(60, 80, 90, ${alpha * 1.3})`;
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }
        }
      }

      // 5. Draw pulses
      if (timestamp - lastPulseTime > (isMoveMeMode ? 180 : 380)) {
        if (nodes.length >= 2) {
          const srcIdx = Math.floor(Math.random() * nodes.length);
          for (let j = 0; j < nodes.length; j++) {
            if (j === srcIdx) continue;
            const d = Math.hypot(nodes[j].x - nodes[srcIdx].x, nodes[j].y - nodes[srcIdx].y);
            if (d < maxConnectionDistance) {
              pulses.push({
                sourceIndex: srcIdx,
                targetIndex: j,
                progress: 0,
                speed: 0.01 + Math.random() * 0.012,
                color: nodes[srcIdx].isProjectNode ? "#B8FF6B" : "#4FFFD0",
              });
              break;
            }
          }
        }
        lastPulseTime = timestamp;
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        const src = nodes[pulse.sourceIndex];
        const tgt = nodes[pulse.targetIndex];

        if (!src || !tgt || pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const currX = src.x + (tgt.x - src.x) * pulse.progress;
        const currY = src.y + (tgt.y - src.y) * pulse.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = styleMode === "prism" ? pulse.color : styleMode === "blueprint" ? "#2050B0" : "#D05020";
        if (styleMode === "prism") {
          ctx.shadowColor = pulse.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        sw.alpha = 1 - sw.radius / sw.maxRadius;

        if (sw.alpha <= 0) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle =
          styleMode === "prism"
            ? `rgba(79, 255, 208, ${sw.alpha * 0.7})`
            : styleMode === "blueprint"
            ? `rgba(30, 80, 200, ${sw.alpha * 0.6})`
            : `rgba(200, 80, 30, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // 7. Draw trailing bubbles from swimming motion
      for (let b = trailBubbles.length - 1; b >= 0; b--) {
        const bubble = trailBubbles[b];
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        bubble.alpha -= 0.02;
        bubble.radius *= 0.98;

        if (bubble.alpha <= 0 || bubble.radius <= 0.5) {
          trailBubbles.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = styleMode === "prism" ? bubble.color : styleMode === "blueprint" ? "#2050B0" : "#D05020";
        ctx.globalAlpha = bubble.alpha;
        if (styleMode === "prism") {
          ctx.shadowColor = bubble.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      }

      // 8. Draw Nodes
      nodes.forEach((node) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          styleMode === "prism"
            ? node.color
            : styleMode === "blueprint"
            ? (node.isProjectNode ? "#DC3030" : "#2050B0")
            : (node.isProjectNode ? "#D05020" : "#304855");

        if (styleMode === "prism") {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = node.isProjectNode ? 14 : 6;
        }
        ctx.fill();

        if (node.isProjectNode) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = styleMode === "prism" ? "rgba(79, 255, 208, 0.4)" : "rgba(30, 80, 190, 0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();

          if (isMoveMeMode && node.label) {
            ctx.font = "10px monospace";
            ctx.fillStyle = styleMode === "prism" ? "rgba(201, 218, 214, 0.85)" : "#204080";
            ctx.fillText(node.label, node.x + 10, node.y + 3);
          }
        }
        ctx.restore();
      });

      // 9. Update & Draw Procedural Living Signal Organism
      if (mouse.active && (isMoveMeMode || Math.hypot(mouse.x - creature.x, mouse.y - creature.y) < 350)) {
        creature.targetX = mouse.x;
        creature.targetY = mouse.y + scrollVelocity * 1.5;
      } else {
        const orbitAngle = timestamp * 0.0006 * creatureSpeed;
        const scrollPhase = (typeof window !== "undefined" ? window.scrollY : 0) * 0.0012;
        creature.targetX = width * 0.5 + Math.cos(orbitAngle + scrollPhase) * (Math.min(width, height) * 0.26);
        creature.targetY =
          height * 0.45 +
          Math.sin(orbitAngle * 1.5 + scrollPhase * 1.6) * (Math.min(width, height) * 0.18) +
          scrollVelocity * 2.4;
      }

      const cdx = creature.targetX - creature.x;
      const cdy = creature.targetY - creature.y;
      const cDist = Math.hypot(cdx, cdy);

      if (cDist > 1) {
        creature.vx += (cdx / cDist) * 0.55 * creatureSpeed;
        creature.vy += (cdy / cDist) * 0.55 * creatureSpeed;
      }

      creature.vx *= 0.92;
      creature.vy *= 0.92;
      creature.x += creature.vx;
      creature.y += creature.vy;

      const desiredAngle = Math.atan2(creature.vy, creature.vx);
      if (cDist > 5) {
        let diff = desiredAngle - creature.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        creature.angle += diff * 0.08;
      }

      creature.blinkTimer++;
      if (creature.blinkTimer > 240) {
        creature.isBlinking = true;
        if (creature.blinkTimer > 255) {
          creature.isBlinking = false;
          creature.blinkTimer = 0;
        }
      }

      drawCreature(timestamp, styleMode);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("click", handleClick);
    };
  }, [isMoveMeMode, activeProjectNode, styleMode, creatureSpeed, creatureFluidity, particleDensity, setFps]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 block transition-opacity duration-700 z-0 pointer-events-none ${className}`}
      style={{
        pointerEvents: isMoveMeMode ? "auto" : "none",
        cursor: isMoveMeMode ? "crosshair" : "default",
      }}
      aria-hidden="true"
    />
  );
};
