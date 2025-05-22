
import React from 'react';
import { Badge, CommonLicense } from './types';
import { 
    CodeBracketIcon, CheckCircleIcon, ChatBubbleLeftEllipsisIcon, CpuChipIcon, CloudIcon, ShieldCheckIcon, CommandLineIcon, ChartBarIcon, StarIcon, EyeIcon, ShareIcon, CubeIcon, WrenchScrewdriverIcon
} from './components/icons';

export const AVAILABLE_BADGES: Badge[] = [
  // --- Existing Technology Badges ---
  {
    id: 'built-with-react',
    name: 'Built with React',
    getMarkdown: () => '[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)',
    selectorDisplay: <span className="inline-flex items-center bg-sky-600 text-white px-2 py-1 text-xs rounded">React</span>,
    category: 'Core Technology',
  },
  {
    id: 'built-with-typescript',
    name: 'Built with TypeScript',
    getMarkdown: () => '[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)',
    selectorDisplay: <span className="inline-flex items-center bg-blue-600 text-white px-2 py-1 text-xs rounded">TypeScript</span>,
    category: 'Core Technology',
  },
  {
    id: 'built-with-tailwind',
    name: 'Styled with Tailwind CSS',
    getMarkdown: () => '[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)',
    selectorDisplay: <span className="inline-flex items-center bg-teal-500 text-white px-2 py-1 text-xs rounded">Tailwind CSS</span>,
    category: 'Core Technology',
  },
  {
    id: 'built-with-python',
    name: 'Built with Python',
    getMarkdown: () => '[![Built with Python](https://img.shields.io/badge/Built%20with-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)',
    selectorDisplay: <span className="inline-flex items-center bg-yellow-500 text-white px-2 py-1 text-xs rounded">Python</span>,
    category: 'Core Technology',
  },
  {
    id: 'built-with-nodejs',
    name: 'Built with Node.js',
    getMarkdown: () => '[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)',
    selectorDisplay: <span className="inline-flex items-center bg-green-600 text-white px-2 py-1 text-xs rounded">Node.js</span>,
    category: 'Core Technology',
  },

  // --- AI/ML Badges ---
  {
    id: 'ai-tensorflow',
    name: 'TensorFlow',
    getMarkdown: () => '[![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)](https://www.tensorflow.org)',
    selectorDisplay: <span className="inline-flex items-center"><CpuChipIcon className="w-4 h-4 mr-1" /> TensorFlow</span>,
    category: 'AI/ML',
  },
  {
    id: 'ai-pytorch',
    name: 'PyTorch',
    getMarkdown: () => '[![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)](https://pytorch.org/)',
    selectorDisplay: <span className="inline-flex items-center"><CpuChipIcon className="w-4 h-4 mr-1" /> PyTorch</span>,
    category: 'AI/ML',
  },
  {
    id: 'ai-scikitlearn',
    name: 'Scikit-learn',
    getMarkdown: () => '[![Scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)',
    selectorDisplay: <span className="inline-flex items-center"><CpuChipIcon className="w-4 h-4 mr-1" /> Scikit-learn</span>,
    category: 'AI/ML',
  },
  {
    id: 'ai-gemini',
    name: 'Powered by Gemini',
    getMarkdown: () => '[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blueviolet?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)',
    selectorDisplay: <span className="inline-flex items-center"><CpuChipIcon className="w-4 h-4 mr-1" /> Gemini API</span>,
    category: 'AI/ML',
  },

  // --- Cloud Platform Badges ---
  {
    id: 'cloud-aws',
    name: 'AWS',
    getMarkdown: () => '[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)',
    selectorDisplay: <span className="inline-flex items-center"><CloudIcon className="w-4 h-4 mr-1" /> AWS</span>,
    category: 'Cloud Platforms',
  },
  {
    id: 'cloud-gcp',
    name: 'Google Cloud',
    getMarkdown: () => '[![GCP](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com)',
    selectorDisplay: <span className="inline-flex items-center"><CloudIcon className="w-4 h-4 mr-1" /> Google Cloud</span>,
    category: 'Cloud Platforms',
  },
  {
    id: 'cloud-azure',
    name: 'Azure',
    getMarkdown: () => '[![Azure](https://img.shields.io/badge/azure-%230078D4.svg?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)',
    selectorDisplay: <span className="inline-flex items-center"><CloudIcon className="w-4 h-4 mr-1" /> Azure</span>,
    category: 'Cloud Platforms',
  },
  {
    id: 'cloud-hosted',
    name: 'Cloud Hosted',
    getMarkdown: () => '[![Cloud Hosted](https://img.shields.io/badge/Cloud%20Hosted-blue?style=for-the-badge&logo=cloud&logoColor=white)]()', // User needs to add link
    selectorDisplay: <span className="inline-flex items-center"><CloudIcon className="w-4 h-4 mr-1" /> Cloud Hosted</span>,
    category: 'Cloud Platforms',
  },

  // --- DevOps & Tools ---
  {
    id: 'docker',
    name: 'Docker',
    getMarkdown: () => '[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)',
    selectorDisplay: <span className="inline-flex items-center"><CubeIcon className="w-4 h-4 mr-1" /> Docker</span>,
    category: 'DevOps & Tools',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    getMarkdown: () => '[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)',
    selectorDisplay: <span className="inline-flex items-center"><CubeIcon className="w-4 h-4 mr-1" /> Kubernetes</span>,
    category: 'DevOps & Tools',
  },
   {
    id: 'platform-vercel',
    name: 'Vercel',
    getMarkdown: () => '[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)',
    selectorDisplay: <span className="inline-flex items-center">Vercel</span>,
    category: 'DevOps & Tools',
  },
   {
    id: 'platform-netlify',
    name: 'Netlify',
    getMarkdown: () => '[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com)',
    selectorDisplay: <span className="inline-flex items-center">Netlify</span>,
    category: 'DevOps & Tools',
  },
  
  // --- Quality Assurance ---
  {
    id: 'code-style-prettier',
    name: 'Code Style: Prettier',
    getMarkdown: () => '[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://prettier.io)',
    selectorDisplay: <span className="inline-flex items-center"><WrenchScrewdriverIcon className="w-4 h-4 mr-1" /> Prettier</span>,
    category: 'Quality Assurance',
  },
  {
    id: 'code-style-black',
    name: 'Code Style: Black',
    getMarkdown: () => '[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg?style=for-the-badge)](https://github.com/psf/black)',
    selectorDisplay: <span className="inline-flex items-center"><WrenchScrewdriverIcon className="w-4 h-4 mr-1" /> Black</span>,
    category: 'Quality Assurance',
  },
  {
    id: 'tests-jest',
    name: 'Tests: Jest',
    getMarkdown: () => '[![Tests: Jest](https://img.shields.io/badge/tested_with-Jest-99424f.svg?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)',
    selectorDisplay: <span className="inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Jest</span>,
    category: 'Quality Assurance',
  },
  {
    id: 'tests-pytest',
    name: 'Tests: Pytest',
    getMarkdown: () => '[![Tests: Pytest](https://img.shields.io/badge/tested_with-Pytest-0a9396.svg?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org)',
    selectorDisplay: <span className="inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Pytest</span>,
    category: 'Quality Assurance',
  },
  {
    id: 'tests-passing',
    name: 'Tests Passing',
    getMarkdown: () => '[![Tests Passing](https://img.shields.io/badge/tests-passing-brightgreen?style=for-the-badge)]()', // User needs to link to CI
    selectorDisplay: <span className="inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" /> Tests Passing</span>,
    category: 'Quality Assurance',
  },
  {
    id: 'coverage',
    name: 'Code Coverage',
    getMarkdown: (percentage = '0') => `[![Coverage Status](https://img.shields.io/badge/coverage-${percentage}${encodeURIComponent('%')}-brightgreen.svg?style=for-the-badge)]()`, // User needs to link
    selectorDisplay: <span className="inline-flex items-center"><ChartBarIcon className="w-4 h-4 mr-1" /> Coverage</span>,
    category: 'Quality Assurance',
  },

  // --- Security ---
  {
    id: 'security-audit',
    name: 'Security Audit Passed',
    getMarkdown: () => '[![Security Audit](https://img.shields.io/badge/Security-Audit%20Passed-brightgreen.svg?style=for-the-badge)]()', // User needs to add link/details
    selectorDisplay: <span className="inline-flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-1" /> Security Audit</span>,
    category: 'Security',
  },
  {
    id: 'vulnerability-scan',
    name: 'Vulnerability Scan',
    getMarkdown: () => '[![Vulnerability Scan](https://img.shields.io/badge/Vulnerability-Scan%20Active-blue.svg?style=for-the-badge)]()', // User needs to add link/details
    selectorDisplay: <span className="inline-flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-1" /> Vulnerability Scan</span>,
    category: 'Security',
  },

  // --- Project Info & Status ---
  {
    id: 'language-dynamic',
    name: 'Main Language',
    getMarkdown: (language = 'JavaScript') => `[![Language](https://img.shields.io/badge/Language-${encodeURIComponent(language)}-yellow.svg?style=for-the-badge)](https://en.wikipedia.org/wiki/Programming_language)`,
    selectorDisplay: <span className="inline-flex items-center"><CodeBracketIcon className="w-4 h-4 mr-1" /> Language</span>,
    category: 'Project Info',
  },
  {
    id: 'version',
    name: 'Version',
    getMarkdown: (version = '0.1.0') => `[![Version](https://img.shields.io/badge/version-${version}-blue.svg?style=for-the-badge)]()`, // User to update link to release page
    selectorDisplay: <span className="inline-flex items-center">Version</span>,
    category: 'Project Info',
  },
  {
    id: 'maintenance-yes',
    name: 'Maintained: Yes',
    getMarkdown: () => '[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/USER/REPO/graphs/commit-activity)', // User needs to update link
    selectorDisplay: <span className="inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" /> Maintained</span>,
    category: 'Project Status',
  },
  {
    id: 'maintenance-no',
    name: 'Maintained: No',
    getMarkdown: () => '[![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg?style=for-the-badge)]()',
    selectorDisplay: <span className="inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1 text-red-400" /> Not Maintained</span>,
    category: 'Project Status',
  },

  // --- Community & Engagement (GitHub specific - user needs to fill links) ---
  {
    id: 'github-stars',
    name: 'GitHub Stars',
    getMarkdown: () => '[![GitHub Stars](https://img.shields.io/github/stars/USER/REPO?style=for-the-badge&logo=github)](https://github.com/USER/REPO/stargazers)',
    selectorDisplay: <span className="inline-flex items-center"><StarIcon className="w-4 h-4 mr-1" /> Stars</span>,
    category: 'Community',
  },
  {
    id: 'github-forks',
    name: 'GitHub Forks',
    getMarkdown: () => '[![GitHub Forks](https://img.shields.io/github/forks/USER/REPO?style=for-the-badge&logo=github)](https://github.com/USER/REPO/network/members)',
    selectorDisplay: <span className="inline-flex items-center"><ShareIcon className="w-4 h-4 mr-1" /> Forks</span>,
    category: 'Community',
  },
  {
    id: 'github-watchers',
    name: 'GitHub Watchers',
    getMarkdown: () => '[![GitHub Watchers](https://img.shields.io/github/watchers/USER/REPO?style=for-the-badge&logo=github)](https://github.com/USER/REPO/watchers)',
    selectorDisplay: <span className="inline-flex items-center"><EyeIcon className="w-4 h-4 mr-1" /> Watchers</span>,
    category: 'Community',
  },
  {
    id: 'ask-me-anything',
    name: 'Ask Me Anything',
    getMarkdown: () => '[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg?style=for-the-badge)](https://github.com/USER/REPO/issues)', // User needs to update link
    selectorDisplay: <span className="inline-flex items-center"><ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-1" /> AMA</span>,
    category: 'Community',
  },
  {
    id: 'contributions-welcome',
    name: 'Contributions Welcome',
    getMarkdown: () => '[![Contributions Welcome](https://img.shields.io/badge/Contributions-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/USER/REPO/pulls)', // User needs to update link
    selectorDisplay: <span className="inline-flex items-center">Contributions Welcome</span>,
    category: 'Community',
  },
];

export const COMMON_LICENSES: CommonLicense[] = [
  { value: 'Not Detected', label: 'Not Detected' },
  { value: 'MIT', label: 'MIT License' },
  { value: 'Apache-2.0', label: 'Apache License 2.0' },
  { value: 'GPL-3.0', label: 'GNU GPL v3' },
  { value: 'BSD-3-Clause', label: 'BSD 3-Clause License' },
  { value: 'Unlicense', label: 'The Unlicense' },
  { value: 'Other', label: 'Other (Specify)' },
];

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
