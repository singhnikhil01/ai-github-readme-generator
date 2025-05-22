import { AnalyzedProjectContext } from '../types';

const GITHUB_API_BASE_URL = 'https://api.github.com/repos';

async function fetchJson(url: string, token?: string): Promise<any> {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  // if (token) headers['Authorization'] = `token ${token}`; // Future: Add token support
  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 404) throw new Error(`Repository or file not found at ${url}. Please check the URL.`);
    if (response.status === 403) { // Rate limit or private repo
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        let message = `GitHub API request failed (403 Forbidden). This could be due to rate limits or the repository being private.`;
        if (rateLimitReset) {
            message += ` Rate limit resets at ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.`;
        }
         throw new Error(message);
    }
    throw new Error(`GitHub API request failed with status ${response.status}: ${response.statusText} for URL ${url}`);
  }
  return response.json();
}

async function fetchContent(url: string, token?: string): Promise<string> {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3.raw' };
  // if (token) headers['Authorization'] = `token ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
     if (response.status === 404) return ""; // File not found, return empty string
    throw new Error(`GitHub API request failed with status ${response.status} for content at ${url}`);
  }
  return response.text();
}


const COMMON_CONFIG_FILES = [
    'package.json', 'composer.json', // JS, PHP
    'requirements.txt', 'Pipfile', 'pyproject.toml', // Python
    'Gemfile', // Ruby
    'pom.xml', 'build.gradle', 'build.gradle.kts', // Java/Kotlin
    'go.mod', // Go
    'Cargo.toml', // Rust
    'README.md', 'readme.md', 'README.rst', 'README.txt' // Existing README
];

export async function analyzeGithubRepo(repoUrl: string): Promise<AnalyzedProjectContext> {
  const urlParts = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!urlParts) throw new Error('Invalid GitHub repository URL format. Expected format: https://github.com/owner/repo');
  
  const owner = urlParts[1];
  const repoName = urlParts[2].replace(/\.git$/, ''); // Remove .git if present

  const context: AnalyzedProjectContext = {
    projectName: repoName,
    keyFileContents: []
  };

  try {
    // 1. Fetch basic repo details
    const repoData = await fetchJson(`${GITHUB_API_BASE_URL}/${owner}/${repoName}`);
    context.projectDescription = repoData.description || '';
    context.mainLanguage = repoData.language || '';
    if (repoData.license && repoData.license.name) {
      context.license = repoData.license.name.replace(' License', ''); // Simplify common license names
    }
    context.projectName = repoData.name || repoName;


    // 2. Fetch root directory listing to identify key files and structure
    const rootContent = await fetchJson(`${GITHUB_API_BASE_URL}/${owner}/${repoName}/contents/`);
    let fileSummaryLines: string[] = ['Root directory contents:'];
    let detectedTech: Set<string> = new Set();
    if(context.mainLanguage) detectedTech.add(context.mainLanguage);

    for (const item of rootContent) {
        fileSummaryLines.push(`${item.name} (${item.type})`);
        if (item.type === 'file' && COMMON_CONFIG_FILES.includes(item.name.toLowerCase())) {
            const fileContent = await fetchContent(item.download_url);
            if(fileContent) {
                 context.keyFileContents!.push({ fileName: item.name, content: fileContent });

                // Basic dependency/tech detection
                if (item.name === 'package.json') {
                    try {
                        const pkg = JSON.parse(fileContent);
                        detectedTech.add('Node.js');
                        if (pkg.dependencies) Object.keys(pkg.dependencies).forEach(dep => detectedTech.add(dep));
                        if (pkg.devDependencies) Object.keys(pkg.devDependencies).forEach(dep => detectedTech.add(dep));
                        if (pkg.scripts) context.projectStructureSummary = (context.projectStructureSummary || '') + `\nAvailable scripts (from package.json): ${Object.keys(pkg.scripts).join(', ')}`;
                    } catch (e) { console.warn(`Could not parse ${item.name}`); }
                } else if (item.name === 'requirements.txt') {
                    detectedTech.add('Python');
                    fileContent.split('\n').forEach(line => {
                        const dep = line.split(/[==<>~]+/)[0].trim();
                        if (dep && !dep.startsWith('#')) detectedTech.add(dep);
                    });
                } else if (item.name.toLowerCase().includes('readme')) {
                    // Could summarize existing README if too long
                }
            }
        }
    }
    context.projectStructureSummary = (context.projectStructureSummary || '') + "\n" + fileSummaryLines.slice(0, 15).join('\n') + (fileSummaryLines.length > 15 ? "\n..." : "");
    
    // Filter out common generic terms from detected tech if more specific ones exist
    const commonLibs = ['react', 'vue', 'angular', 'django', 'flask', 'express', 'spring', 'laravel'];
    const hasSpecificFramework = Array.from(detectedTech).some(tech => commonLibs.includes(tech.toLowerCase()));

    if (hasSpecificFramework) {
        if (detectedTech.has('javascript') && (detectedTech.has('react') || detectedTech.has('vue') || detectedTech.has('angular') || detectedTech.has('express'))) {
            detectedTech.delete('javascript');
        }
        if (detectedTech.has('python') && (detectedTech.has('django') || detectedTech.has('flask'))) {
            detectedTech.delete('python');
        }
    }
    // Limit number of displayed technologies
    const MAX_TECH = 10;
    context.detectedTechnologies = Array.from(detectedTech).slice(0, MAX_TECH).join(', ') + (detectedTech.size > MAX_TECH ? `, +${detectedTech.size - MAX_TECH} more` : '');


  } catch (error) {
    console.error('Error analyzing GitHub repo:', error);
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred while analyzing the GitHub repository.');
  }

  return context;
}
