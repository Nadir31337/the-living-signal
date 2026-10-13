import fs from "fs";
import path from "path";
import {
  ProfileContent,
  WhatIDoContent,
  ProjectsContent,
  PrinciplesContent,
  SkillsContent,
  EducationContent,
  LanguagesContent,
  LearningContent,
  ContactContent,
  ProjectItem,
} from "../types/content";

function readContentFile<T>(filename: string): T {
  // Try finding content folder in parent or current directory
  const rootDir = process.cwd();
  const candidates = [
    path.join(rootDir, "content", filename),
    path.join(rootDir, "..", "content", filename),
    path.join(rootDir, "../..", "content", filename),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8").trim();
      if (fileData.length > 0) {
        try {
          return JSON.parse(fileData) as T;
        } catch {
          // If a candidate file is partially written or invalid, try next candidate
          continue;
        }
      }
    }
  }

  throw new Error(`Content file ${filename} could not be located or parsed in candidates: ${candidates.join(", ")}`);
}

export function getProfileContent(): ProfileContent {
  return readContentFile<ProfileContent>("profile.json");
}

export function getWhatIDoContent(): WhatIDoContent {
  return readContentFile<WhatIDoContent>("what-i-do.json");
}

export function getProjectsContent(): ProjectsContent {
  return readContentFile<ProjectsContent>("projects.json");
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  const content = getProjectsContent();
  return content.projects.find((p) => p.slug === slug);
}

export function getPrinciplesContent(): PrinciplesContent {
  return readContentFile<PrinciplesContent>("principles.json");
}

export function getSkillsContent(): SkillsContent {
  return readContentFile<SkillsContent>("skills.json");
}

export function getEducationContent(): EducationContent {
  return readContentFile<EducationContent>("education.json");
}

export function getLanguagesContent(): LanguagesContent {
  return readContentFile<LanguagesContent>("languages.json");
}

export function getLearningContent(): LearningContent {
  return readContentFile<LearningContent>("learning.json");
}

export function getContactContent(): ContactContent {
  return readContentFile<ContactContent>("contact.json");
}
