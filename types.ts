export type LicenseType = 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'Unlicense' | 'Other' | 'Not Detected';

export type InputSourceType = 'github' | 'zip';

export interface ProjectDetails {
  projectName: string;
  projectDescription: string;
  mainLanguage: string;
  licenseType: LicenseType;
  customLicenseType: string;
  codeSnippets: string; // Will hold analyzed content from GitHub/ZIP
  githubUrl?: string;
  zipFile?: File | null;
  detectedTechnologies?: string;
  projectStructureSummary?: string;
}

export interface Badge {
  id: string;
  name: string;
  getMarkdown: (param?: string) => string; 
  selectorDisplay: React.ReactNode;
  category: string;
}

export interface CommonLicense {
  value: LicenseType;
  label: string;
}

export interface AnalyzedProjectContext {
  projectName?: string;
  projectDescription?: string;
  mainLanguage?: string;
  license?: string;
  detectedTechnologies?: string;
  projectStructureSummary?: string;
  keyFileContents?: { fileName: string; content: string }[];
}