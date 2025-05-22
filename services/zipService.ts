import JSZip from 'jszip';
import { AnalyzedProjectContext } from '../types';

const COMMON_CONFIG_FILES_PATTERNS = [
    /package\.json$/i, /composer\.json$/i, // JS, PHP
    /requirements\.txt$/i, /Pipfile$/i, /pyproject\.toml$/i, // Python
    /Gemfile$/i, // Ruby
    /pom\.xml$/i, /build\.gradle(\.kts)?$/i, // Java/Kotlin
    /go\.mod$/i, // Go
    /Cargo\.toml$/i, // Rust
    /README(\.(md|rst|txt))?$/i // Existing README
];

const MAX_FILE_CONTENT_PREVIEW = 1024 * 2; // Max 2KB preview for key files to avoid huge prompts

export async function analyzeZipFile(file: File): Promise<AnalyzedProjectContext> {
  const zip = new JSZip();
  const context: AnalyzedProjectContext = {
    projectName: file.name.replace(/\.zip$/, ''), // Default project name from file name
    keyFileContents: []
  };

  try {
    const content = await zip.loadAsync(file);
    let fileSummaryLines: string[] = ['Project files (partial list):'];
    let detectedTech: Set<string> = new Set();
    let primaryDir = '';
    let fileCount = 0;

    // Heuristic to find primary directory (if files are nested inside one)
    const rootEntries = Object.keys(content.files).filter(name => !name.includes('/') || name.split('/').length === (content.files[name].dir ? 1 : 2) && content.files[name].dir);
    if (rootEntries.length === 1 && content.files[rootEntries[0]].dir) {
        primaryDir = rootEntries[0];
    }
    
    const filesToProcess = Object.values(content.files).filter(f => !f.dir);

    for (const zipFile of filesToProcess) {
      let relativePath = zipFile.name;
      if (primaryDir && relativePath.startsWith(primaryDir)) {
        relativePath = relativePath.substring(primaryDir.length);
      }
      
      fileCount++;
      if (fileCount <= 15) { // Limit summary lines
          fileSummaryLines.push(relativePath);
      }

      const isKeyFile = COMMON_CONFIG_FILES_PATTERNS.some(pattern => pattern.test(relativePath));
      if (isKeyFile && context.keyFileContents!.length < 10) { // Limit number of key files to process
        try {
          const fileContent = await zipFile.async('string');
           context.keyFileContents!.push({ 
            fileName: relativePath, 
            content: fileContent.substring(0, MAX_FILE_CONTENT_PREVIEW) + (fileContent.length > MAX_FILE_CONTENT_PREVIEW ? "\n... (content truncated)" : "")
          });

          // Basic dependency/tech detection (similar to GitHub service, simplified)
          if (/package\.json$/i.test(relativePath)) {
            detectedTech.add('Node.js');
            try {
                const pkg = JSON.parse(fileContent);
                if(pkg.name && !context.projectName) context.projectName = pkg.name;
                if(pkg.description && !context.projectDescription) context.projectDescription = pkg.description;
                if(pkg.license && !context.license) context.license = typeof pkg.license === 'string' ? pkg.license : pkg.license.type;
                if (pkg.dependencies) Object.keys(pkg.dependencies).forEach(dep => detectedTech.add(dep));
                if (pkg.devDependencies) Object.keys(pkg.devDependencies).forEach(dep => detectedTech.add(dep));
            } catch (e) { console.warn(`Could not parse ${relativePath}`); }
          } else if (/requirements\.txt$/i.test(relativePath)) {
            detectedTech.add('Python');
            fileContent.split('\n').forEach(line => {
                const dep = line.split(/[==<>~]+/)[0].trim();
                if (dep && !dep.startsWith('#')) detectedTech.add(dep);
            });
          } else if (/pom\.xml$/i.test(relativePath)) {
             detectedTech.add('Java/Maven');
          } else if (/build\.gradle(\.kts)?$/i.test(relativePath)) {
             detectedTech.add('Java/Gradle');
          } else if (/README(\.(md|rst|txt))?$/i.test(relativePath) && !context.projectDescription) {
             // Try to extract a short description from an existing README
             const firstFewLines = fileContent.split('\n').slice(0,5).join(' ').trim();
             if(firstFewLines.length > 20 && firstFewLines.length < 200) {
                context.projectDescription = firstFewLines + "...";
             }
          }
        } catch (e) {
          console.warn(`Could not read content of ${relativePath} from ZIP: ${e}`);
        }
      }
    }
    context.projectStructureSummary = fileSummaryLines.join('\n') + (fileCount > 15 ? `\n... and ${fileCount - 15} more files.` : '');

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
     const MAX_TECH = 10;
    context.detectedTechnologies = Array.from(detectedTech).slice(0, MAX_TECH).join(', ') + (detectedTech.size > MAX_TECH ? `, +${detectedTech.size - MAX_TECH} more` : '');


  } catch (error) {
    console.error('Error analyzing ZIP file:', error);
     if (error instanceof Error) throw new Error(`Failed to process ZIP file: ${error.message}`);
    throw new Error('An unexpected error occurred while analyzing the ZIP file.');
  }
  return context;
}
