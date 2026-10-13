export interface ProfileContent {
  name: string;
  handle: string;
  email: string;
  location: string;
  github: string;
  marqueeText: string;
  hero: {
    eyebrow: string;
    headline: string;
    subline: string;
    toggleLabels: {
      readMe: string;
      moveMe: string;
    };
    ctas: Array<{
      label: string;
      href: string;
      primary: boolean;
      download?: boolean;
    }>;
  };
  about: {
    bio: string;
    interestTags: string[];
  };
  footer: {
    tagline: string;
  };
}

export interface WhatIDoPanel {
  id: string;
  number: string;
  keyword: string;
  summary: string;
  items: string[];
}

export interface WhatIDoContent {
  panels: WhatIDoPanel[];
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  status: "IN DEVELOPMENT" | "DEVELOPED";
  tagline: string;
  description: string;
  nodeIndex: number;
  color: string;
  details: {
    overview: string;
    problem: string;
    architectureDiagram: string;
    technologies: string[];
    highlights: string[];
    ownerNote: string;
  };
}

export interface ProjectsContent {
  projects: ProjectItem[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  statement: string;
}

export interface PrinciplesContent {
  principles: PrincipleItem[];
}

export interface SkillCluster {
  category: string;
  description: string;
  skills: string[];
}

export interface SkillsContent {
  clusters: SkillCluster[];
  _todo_placeholder?: string;
  show_todo_placeholder?: boolean;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface EducationContent {
  institution: string;
  degree: string;
  location: string;
  expectedGraduation: string;
  showGraduationDate: boolean;
  certifications: CertificationItem[];
}

export interface LanguageItem {
  name: string;
  level: string;
  proficiencyPercent: number;
  tag: string;
}

export interface LanguagesContent {
  languages: LanguageItem[];
}

export interface LearningCard {
  step: string;
  topic: string;
  summary: string;
  focus: string;
}

export interface LearningContent {
  heading: string;
  subheading: string;
  cards: LearningCard[];
}

export interface ContactContent {
  closingCta: string;
  ctaButton: string;
  heading: string;
  text: string;
  form: {
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
    submitLabel: string;
    submittingLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}
