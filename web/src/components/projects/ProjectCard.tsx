"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectItem } from "@/types/content";
import { ProjectNodeGraphPreview } from "../canvas/ProjectNodeGraphPreview";
import { audioEngine } from "@/lib/audioEngine";
import { ArrowUpRight, Radio } from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  index?: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  onHoverStart,
  onHoverEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDeveloped = project.status === "DEVELOPED";

  const handleMouseEnter = () => {
    setIsHovered(true);
    audioEngine.playChime(index, 0.3);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverEnd();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-500 overflow-hidden bg-signal-card ${
        isHovered
          ? "border-signal-teal shadow-glowTeal scale-[1.01]"
          : "border-signal-border/60 hover:border-signal-border"
      }`}
    >
      {/* Top Header: Status Badge & Node Signal Indicator */}
      <div className="p-6 md:p-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-[11px] font-semibold tracking-wider uppercase ${
              isDeveloped
                ? "bg-signal-lime/10 text-signal-lime border border-signal-lime/40"
                : "bg-signal-teal/10 text-signal-teal border border-signal-teal/40"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                isDeveloped ? "bg-signal-lime" : "bg-signal-teal animate-pulse"
              }`}
            />
            {project.status}
          </span>

          {/* Node Signal Reference */}
          <span className="font-mono text-xs text-signal-dim tracking-widest uppercase flex items-center">
            <Radio className="w-3.5 h-3.5 mr-1 text-signal-teal/60" />
            NODE // 0{project.nodeIndex + 1}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-signal-teal transition-colors">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="font-body text-sm sm:text-base font-medium text-signal-lime/90 mt-1.5">
          &ldquo;{project.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="font-body text-sm text-signal-mist/80 mt-4 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Generated Animated Node-Graph Thumbnail Preview */}
      <div className="px-6 md:px-8 py-3">
        <div className="h-44 w-full relative rounded-lg overflow-hidden transition-all duration-300 group-hover:ring-1 group-hover:ring-signal-teal/50">
          <ProjectNodeGraphPreview
            projectId={project.slug}
            color={project.color}
            isActive={isHovered}
          />
        </div>
      </div>

      {/* Footer / Link to Detail Page */}
      <div className="p-6 md:p-8 pt-3 border-t border-signal-border/30 flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {project.details.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] text-signal-dim bg-signal-subtle/60 px-2 py-0.5 rounded border border-signal-border/40"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center font-mono text-xs font-semibold tracking-wider uppercase text-signal-teal hover:text-signal-lime transition-colors ml-2 shrink-0 group/link"
        >
          <span>View project</span>
          <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};
