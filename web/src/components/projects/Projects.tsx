"use client";

import React from "react";
import { ProjectsContent } from "@/types/content";
import { ProjectCard } from "./ProjectCard";

interface ProjectsProps {
  content: ProjectsContent;
  onHoverProject?: (nodeIndex: number | null) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  content,
  onHoverProject,
}) => {
  return (
    <section
      id="projects"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Projects Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
              <span>[ 03 // ACTIVE NODES ]</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              PROJECTS
            </h2>
            <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
              Systems under construction and active development. Hover cards to illuminate network connections.
            </p>
          </div>

          <div className="mt-4 md:mt-0 font-mono text-xs text-signal-dim tracking-wider uppercase">
            <span>4 NODES REGISTERED // BIO-NETWORK SYNCHRONIZED</span>
          </div>
        </div>

        {/* 2x2 Grid of Large Portrait-Style Node Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {content.projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onHoverStart={() => onHoverProject?.(project.nodeIndex)}
              onHoverEnd={() => onHoverProject?.(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
