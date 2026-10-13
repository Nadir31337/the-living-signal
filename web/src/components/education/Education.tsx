"use client";

import React, { useState } from "react";
import { EducationContent } from "@/types/content";
import { GraduationCap, Award, Copy, Check } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface EducationProps {
  content: EducationContent;
}

export const Education: React.FC<EducationProps> = ({ content }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    audioEngine.playTactileTick();
    audioEngine.playChime(6, 0.35);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="education"
      className="py-24 md:py-32 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/20"
      aria-label="Education & Certifications Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 font-mono text-xs tracking-widest text-signal-teal uppercase mb-3">
            <span>[ 06 // ACADEMIC & CREDENTIALS ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            EDUCATION & CERTIFICATIONS
          </h2>
          <p className="mt-3 font-body text-base sm:text-lg text-signal-mist/80 max-w-xl">
            Software engineering fundamentals, rigorous requirements elicitation, and stakeholder analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: University Degree (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-signal-teal/40 bg-signal-card/90 p-8 relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-lg bg-signal-teal/10 border border-signal-teal/30 text-signal-teal">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-signal-dim tracking-wider uppercase">
                      University Degree
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {content.institution}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-body">
                  <p className="text-lg font-medium text-signal-mist">
                    {content.degree}
                  </p>
                  <p className="font-mono text-xs text-signal-dim tracking-wide">
                    {content.location}
                  </p>

                  {/* Graduation date is hidden unless showGraduationDate is true */}
                  {content.showGraduationDate && (
                    <p className="font-mono text-xs text-signal-teal">
                      Expected Graduation: {content.expectedGraduation}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-signal-border/20 font-mono text-xs text-signal-dim">
                <span>Core Track: Backend Architecture, Algorithms, Software Testing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Certifications (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 font-mono text-xs tracking-wider uppercase text-signal-dim mb-2">
                <Award className="w-4 h-4 text-signal-lime" />
                <span>Specialized Certifications // University of Colorado System</span>
              </div>

              {content.certifications.map((cert, cIdx) => (
                <div
                  key={cert.credentialId}
                  onMouseEnter={() => audioEngine.playChime(cIdx + 2, 0.25)}
                  className="rounded-lg border border-signal-border/60 bg-signal-card/85 backdrop-blur-md p-5 md:p-6 hover:border-signal-teal/50 hover:bg-signal-card hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                      {cert.title}
                    </h4>
                    <p className="font-mono text-xs text-signal-dim">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>

                  {/* Credential ID Badge */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-mono text-xs bg-signal-subtle/80 px-2.5 py-1 rounded border border-signal-border text-signal-teal tracking-wider">
                      ID: {cert.credentialId}
                    </span>
                    <button
                      onClick={() => handleCopy(cert.credentialId)}
                      title="Copy Credential ID"
                      className="p-1.5 rounded hover:bg-signal-subtle text-signal-dim hover:text-signal-teal transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-teal"
                      aria-label={`Copy credential ID ${cert.credentialId}`}
                    >
                      {copiedId === cert.credentialId ? (
                        <Check className="w-4 h-4 text-signal-lime" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
