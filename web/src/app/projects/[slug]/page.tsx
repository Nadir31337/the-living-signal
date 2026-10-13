import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsContent, getProjectBySlug } from "@/lib/content";
import { TimeAnnouncerAudioTest } from "@/components/projects/TimeAnnouncerAudioTest";
import { ArrowLeft, Radio, Terminal, Cpu, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const content = getProjectsContent();
  return content.projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Nadir Saidi`,
    description: project.tagline,
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const isDeveloped = project.status === "DEVELOPED";
  const isTimeAnnouncer = project.slug === "time-announcer";

  return (
    <main className="min-h-screen bg-signal-bg text-signal-mist py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center font-mono text-xs tracking-wider uppercase text-signal-teal hover:text-signal-lime transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio Grid</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="border-b border-signal-border/40 pb-8 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-xs font-semibold tracking-wider uppercase ${
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

            <span className="font-mono text-xs text-signal-dim tracking-widest uppercase flex items-center">
              <Radio className="w-3.5 h-3.5 mr-1 text-signal-teal/60" />
              NODE 0{project.nodeIndex + 1}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            {project.title}
          </h1>
          <p className="font-body text-xl text-signal-lime font-medium">
            &ldquo;{project.tagline}&rdquo;
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Overview */}
          <section aria-labelledby="overview-heading" className="space-y-4">
            <h2
              id="overview-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase flex items-center"
            >
              <Terminal className="w-4 h-4 mr-2 text-signal-teal" />
              <span>{"// 01. SYSTEM OVERVIEW"}</span>
            </h2>
            <p className="font-body text-lg text-signal-mist/90 leading-relaxed">
              {project.details.overview}
            </p>
          </section>

          {/* Problem Statement */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase flex items-center"
            >
              <Cpu className="w-4 h-4 mr-2 text-signal-teal" />
              <span>{"// 02. PROBLEM & CORE CHALLENGE"}</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-signal-mist/90 leading-relaxed">
              {project.details.problem}
            </p>
          </section>

          {/* Architecture Diagram */}
          <section aria-labelledby="arch-heading" className="space-y-4">
            <h2
              id="arch-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase flex items-center"
            >
              <Radio className="w-4 h-4 mr-2 text-signal-teal" />
              <span>{"// 03. ARCHITECTURE PIPELINE"}</span>
            </h2>
            <div className="rounded-lg border border-signal-border bg-signal-card p-6 overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-signal-teal tracking-wide whitespace-pre-wrap leading-relaxed">
                {project.details.architectureDiagram}
              </pre>
            </div>
          </section>

          {/* Technologies Used */}
          <section aria-labelledby="tech-heading" className="space-y-4">
            <h2
              id="tech-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase flex items-center"
            >
              <Cpu className="w-4 h-4 mr-2 text-signal-teal" />
              <span>{"// 04. TECHNOLOGIES"}</span>
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {project.details.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-md border border-signal-border/80 bg-signal-card/80 font-mono text-xs text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section aria-labelledby="highlights-heading" className="space-y-4">
            <h2
              id="highlights-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2 text-signal-teal" />
              <span>{"// 05. CORE HIGHLIGHTS"}</span>
            </h2>
            <ul className="space-y-3">
              {project.details.highlights.map((h, i) => (
                <li key={i} className="flex items-start space-x-3 text-signal-mist/90 font-body text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-lime mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Status & Owner Note / Subtle TODO state */}
          <section aria-labelledby="status-heading" className="space-y-4 pt-4 border-t border-signal-border/30">
            <h2
              id="status-heading"
              className="font-mono text-xs tracking-widest text-signal-teal uppercase"
            >
              <span>{"// 06. CURRENT REPOSITORY STATUS"}</span>
            </h2>
            <div
              className={`rounded-lg border p-6 ${
                isTimeAnnouncer
                  ? "border-amber-500/40 bg-amber-950/10"
                  : "border-signal-border/50 bg-signal-card/50"
              }`}
            >
              {/* [TODO: Owner details placeholder when applicable] */}
              <p className="font-mono text-xs sm:text-sm text-signal-mist leading-relaxed">
                {project.details.ownerNote}
              </p>
              {isTimeAnnouncer && (
                <>
                  <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
                    Subtle state: Extended documentation and audio platform details coming soon.
                  </div>
                  <TimeAnnouncerAudioTest />
                </>
              )}
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-signal-border/40 flex items-center justify-between">
          <Link
            href="/#projects"
            className="font-mono text-xs uppercase tracking-wider text-signal-teal hover:text-signal-lime"
          >
            &larr; Back to all projects
          </Link>
          <a
            href="/#contact"
            className="px-4 py-2 rounded bg-signal-teal text-signal-bg font-mono text-xs uppercase font-semibold hover:bg-signal-lime transition-colors"
          >
            Discuss this project
          </a>
        </div>
      </div>
    </main>
  );
}
