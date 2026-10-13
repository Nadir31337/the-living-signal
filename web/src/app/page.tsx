import React from "react";
import {
  getProfileContent,
  getWhatIDoContent,
  getProjectsContent,
  getPrinciplesContent,
  getSkillsContent,
  getEducationContent,
  getLanguagesContent,
  getLearningContent,
  getContactContent,
} from "@/lib/content";

import { SignalEngineProvider } from "@/context/SignalEngineContext";
import { LivingSignalCanvas } from "@/components/canvas/LivingSignalCanvas";
import { SignalEngineHUD } from "@/components/canvas/SignalEngineHUD";
import { Navbar } from "@/components/nav/Navbar";
import { MarqueeTicker } from "@/components/nav/MarqueeTicker";
import { Hero } from "@/components/hero/Hero";
import { WhatIDo } from "@/components/what-i-do/WhatIDo";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Principles } from "@/components/principles/Principles";
import { Skills } from "@/components/skills/Skills";
import { Education } from "@/components/education/Education";
import { Languages } from "@/components/languages/Languages";
import { CurrentlyLearning } from "@/components/learning/CurrentlyLearning";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  const profile = getProfileContent();
  const whatIDo = getWhatIDoContent();
  const projects = getProjectsContent();
  const principles = getPrinciplesContent();
  const skills = getSkillsContent();
  const education = getEducationContent();
  const languages = getLanguagesContent();
  const learning = getLearningContent();
  const contact = getContactContent();

  return (
    <SignalEngineProvider>
      <div className="flex flex-col min-h-screen bg-signal-bg relative selection:bg-signal-teal/30 selection:text-signal-lime">
        {/* Full-Page Persistent Living Signal Organism & Canvas 2D Network */}
        <LivingSignalCanvas />

        {/* Floating Signal Engine Creative HUD (100% Code & Tool-Building) */}
        <SignalEngineHUD />

        {/* 1. Navigation + Sub-nav Marquee */}
        <Navbar marqueeText={profile.marqueeText} />

        <main id="main-content" className="flex-1">
          {/* 2. Hero with Read Me / Move Me toggle + Procedural Living Organism */}
          <Hero profile={profile} />

          {/* 3. What I Do (Three Stacked Panels: Build, Test, Integrate) */}
          <WhatIDo content={whatIDo} />

          {/* 4. About Bio & Interest Tags */}
          <About profile={profile} />

          {/* Section Divider Marquee */}
          <MarqueeTicker
            phrase="RELIABLE BY DESIGN // VERIFIED BY TESTS //"
            variant="divider"
          />

          {/* 5. Projects (4 Node Cards with Hover Previews) */}
          <Projects content={projects} />

          {/* 6. Principles (Three-Column Values Triptych) */}
          <Principles content={principles} />

          {/* 7. Skills (Constellation Clusters) */}
          <Skills content={skills} />

          {/* 8. Education & Certifications */}
          <Education content={education} />

          {/* 9. Languages (Four Glowing Nodes with Proficiency Rings) */}
          <Languages content={languages} />

          {/* Section Divider Marquee */}
          <MarqueeTicker
            phrase="ALWAYS ADAPTING // ALWAYS EVOLVING //"
            variant="divider"
          />

          {/* 10. Currently Learning (Sticky Card-Stack) */}
          <CurrentlyLearning content={learning} />

          {/* 11. Contact (Big Closing CTA + Validated Form) */}
          <ContactSection content={contact} profile={profile} />
        </main>

        {/* 12. Footer */}
        <Footer profile={profile} />
      </div>
    </SignalEngineProvider>
  );
}
