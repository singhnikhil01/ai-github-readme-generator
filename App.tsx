import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { ProjectDetailsForm } from './components/ProjectDetailsForm';
import { BadgeSelector } from './components/BadgeSelector';
import { ReadmePreview } from './components/ReadmePreview';
import { generateReadmeWithGemini } from './services/geminiService';
import { analyzeGithubRepo } from './services/githubService';
import { analyzeZipFile } from './services/zipService';
import { ProjectDetails, Badge, LicenseType, InputSourceType, AnalyzedProjectContext } from './types';
import { AVAILABLE_BADGES, COMMON_LICENSES } from './constants';
import { Spinner } from './components/Spinner';
import { GithubIcon, DocumentTextIcon, SparklesIcon, LinkIcon, ArrowUpTrayIcon } from './components/icons';

const App: React.FC = () => {
  const [inputSource, setInputSource] = useState<InputSourceType>('github');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectName: '',
    projectDescription: '',
    mainLanguage: '',
    licenseType: 'Not Detected',
    customLicenseType: '',
    codeSnippets: '',
    githubUrl: '',
    zipFile: null,
    detectedTechnologies: '',
    projectStructureSummary: '',
  });
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
  const [generatedReadme, setGeneratedReadme] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);


  const handleBadgeToggle = useCallback((badge: Badge) => {
    setSelectedBadges(prev =>
      prev.find(b => b.id === badge.id)
        ? prev.filter(b => b.id !== badge.id)
        : [...prev, badge]
    );
  }, []);

  const getLicenseBadgeMarkdown = (license: LicenseType, customLicense?: string): string => {
    if (license === 'Not Detected') return '';
    const type = license === 'Other' ? customLicense || 'custom' : license;
    const shieldLicense = type.replace(/-/g, '--');
    const licenseUrlPart = type === 'Unlicense' ? 'unlicense' : type.toLowerCase();
    return `[![License: ${type}](https://img.shields.io/badge/License-${shieldLicense}-blue.svg)](https://opensource.org/licenses/${licenseUrlPart})`;
  };

  const handleAnalyzeData = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisDone(false);
    setGeneratedReadme(''); // Clear previous readme
     // Reset relevant project details before new analysis
    setProjectDetails(prev => ({
        ...prev, // Keep githubUrl or zipFile
        projectName: '',
        projectDescription: '',
        mainLanguage: '',
        licenseType: 'Not Detected',
        customLicenseType: '',
        codeSnippets: '',
        detectedTechnologies: '',
        projectStructureSummary: '',
    }));

    let analyzedContext: AnalyzedProjectContext | null = null;

    try {
      if (inputSource === 'github' && projectDetails.githubUrl) {
        analyzedContext = await analyzeGithubRepo(projectDetails.githubUrl);
      } else if (inputSource === 'zip' && projectDetails.zipFile) {
        analyzedContext = await analyzeZipFile(projectDetails.zipFile);
      }

      if (analyzedContext) {
        const updatedDetails: Partial<ProjectDetails> = {
            projectName: analyzedContext.projectName || 'Untitled Project',
            projectDescription: analyzedContext.projectDescription || 'No description found.',
            mainLanguage: analyzedContext.mainLanguage || '',
            detectedTechnologies: analyzedContext.detectedTechnologies || '',
            projectStructureSummary: analyzedContext.projectStructureSummary || '',
            codeSnippets: `Project Overview:\n${analyzedContext.projectDescription || 'N/A'}\n\nDetected Technologies:\n${analyzedContext.detectedTechnologies || 'N/A'}\n\nProject Structure Summary:\n${analyzedContext.projectStructureSummary || 'N/A'}\n\nKey Files:\n${(analyzedContext.keyFileContents || []).map(f => `--- ${f.fileName} ---\n${f.content.substring(0, 300)}${f.content.length > 300 ? '...' : ''}`).join('\n\n') || 'N/A'}`
        };
         if (analyzedContext.license) {
          const foundLicense = COMMON_LICENSES.find(l => l.label.toLowerCase().includes(analyzedContext!.license!.toLowerCase()) || l.value.toLowerCase() === analyzedContext!.license!.toLowerCase());
          if (foundLicense) {
            updatedDetails.licenseType = foundLicense.value;
          } else if (analyzedContext.license.trim() !== '' && analyzedContext.license.trim().toLowerCase() !== 'no license found') {
            updatedDetails.licenseType = 'Other';
            updatedDetails.customLicenseType = analyzedContext.license;
          } else {
            updatedDetails.licenseType = 'Not Detected';
          }
        } else {
            updatedDetails.licenseType = 'Not Detected';
        }
        setProjectDetails(prev => ({ ...prev, ...updatedDetails }));
        setAnalysisDone(true);
      } else {
        setError('Analysis could not be performed. Please check your input.');
        setAnalysisDone(false);
      }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
        setError(`Analysis failed: ${message}`);
        console.error(err);
        setAnalysisDone(false);
    } finally {
        setIsAnalyzing(false);
    }
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedReadme('');

    if (!process.env.API_KEY) {
        setError("API_KEY environment variable is not set. Please configure it to use the Gemini API.");
        setIsLoading(false);
        return;
    }
    if (!analysisDone || !projectDetails.projectName) {
      setError("Please analyze a project first. Project details are missing.");
      setIsLoading(false);
      return;
    }

    const activeLicenseType = projectDetails.licenseType === 'Other' ? projectDetails.customLicenseType : projectDetails.licenseType;
    const licenseBadgeMd = getLicenseBadgeMarkdown(projectDetails.licenseType, projectDetails.customLicenseType);
    
    const allBadgeMarkdowns = [];
    if(licenseBadgeMd) allBadgeMarkdowns.push(licenseBadgeMd);

    allBadgeMarkdowns.push(...selectedBadges.map(b => b.getMarkdown(projectDetails.mainLanguage || projectDetails.detectedTechnologies?.split(',')[0].trim())));

    try {
      const readme = await generateReadmeWithGemini(
        projectDetails, 
        allBadgeMarkdowns, 
        activeLicenseType
      );
      setGeneratedReadme(readme);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate README: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGitHubUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectDetails(prev => ({ ...prev, githubUrl: e.target.value }));
    setAnalysisDone(false); // Reset analysis state if URL changes
    setGeneratedReadme(''); // Clear previous readme
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectDetails(prev => ({ ...prev, zipFile: e.target.files[0] }));
    } else {
      setProjectDetails(prev => ({ ...prev, zipFile: null }));
    }
    setAnalysisDone(false); // Reset analysis state if file changes
    setGeneratedReadme(''); // Clear previous readme
  };
  
  const handleInputSourceChange = (source: InputSourceType) => {
    setInputSource(source);
    setError(null);
    setAnalysisDone(false);
    setGeneratedReadme('');
    // Reset specific inputs when source changes to avoid confusion
    setProjectDetails(prev => ({
      // Keep common details if desired, or reset them:
        projectName: '',
        projectDescription: '',
        mainLanguage: '',
        licenseType: 'Not Detected',
        customLicenseType: '',
        codeSnippets: '',
        detectedTechnologies: '',
        projectStructureSummary: '',
        // Reset source-specific fields
        githubUrl: source === 'github' ? prev.githubUrl : '',
        zipFile: source === 'zip' ? prev.zipFile : null,
    }));
  };

  const isAnalyzeDisabled = isAnalyzing || (inputSource === 'github' && !projectDetails.githubUrl) || (inputSource === 'zip' && !projectDetails.zipFile);
  const isGenerateDisabled = isLoading || isAnalyzing || !analysisDone || !projectDetails.projectName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-neutral-200 p-4 sm:p-8 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-flex items-center">
          <DocumentTextIcon className="w-10 h-10 mr-3" />
          AI GitHub README Generator
          <SparklesIcon className="w-10 h-10 ml-3" />
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Craft professional README.md files by analyzing your GitHub repository or project ZIP file.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
            <GithubIcon className="w-7 h-7 mr-2" /> Project Input
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Input Source:</label>
            <div className="flex space-x-2 sm:space-x-4 rounded-md bg-slate-700 p-1">
              {(['github', 'zip'] as InputSourceType[]).map((source) => (
                <button
                  key={source}
                  onClick={() => handleInputSourceChange(source)}
                  className={`flex-1 py-2 px-3 sm:px-4 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${inputSource === source ? 'bg-primary text-white shadow' : 'text-slate-300 hover:bg-slate-600 focus:ring-primary'}`}
                >
                  {source === 'github' && <LinkIcon className="w-5 h-5 inline mr-1 sm:mr-2" />}
                  {source === 'zip' && <ArrowUpTrayIcon className="w-5 h-5 inline mr-1 sm:mr-2" />}
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {inputSource === 'github' && (
            <div className="mb-4 space-y-2">
              <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-300">GitHub Repository URL</label>
              <input
                type="url"
                name="githubUrl"
                id="githubUrl"
                value={projectDetails.githubUrl || ''}
                onChange={handleGitHubUrlChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-slate-100 placeholder-slate-400"
                placeholder="https://github.com/username/repository"
              />
            </div>
          )}

          {inputSource === 'zip' && (
            <div className="mb-4 space-y-2">
              <label htmlFor="zipFile" className="block text-sm font-medium text-slate-300">Upload Project ZIP File</label>
              <input
                type="file"
                name="zipFile"
                id="zipFile"
                accept=".zip"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
              />
               {projectDetails.zipFile && <p className="text-xs text-slate-400 mt-1">Selected: {projectDetails.zipFile.name}</p>}
            </div>
          )}

          <button
              onClick={handleAnalyzeData}
              disabled={isAnalyzeDisabled}
              className="mb-6 w-full bg-gradient-to-r from-accent to-green-600 hover:from-accent hover:to-green-700 text-white font-bold py-2.5 px-5 rounded-lg text-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? <Spinner className="w-5 h-5 mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
              {isAnalyzing ? 'Analyzing Project...' : 'Analyze Project Files'}
            </button>

          <ProjectDetailsForm
            details={projectDetails}
            licenses={COMMON_LICENSES}
          />
          <div className="mt-8">
            <BadgeSelector
              availableBadges={AVAILABLE_BADGES}
              selectedBadges={selectedBadges}
              onToggleBadge={handleBadgeToggle}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isGenerateDisabled}
            className="mt-8 w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-accent text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Spinner className="w-6 h-6 mr-2" /> : <SparklesIcon className="w-6 h-6 mr-2" />}
            {isLoading ? 'Generating...' : 'Generate README'}
          </button>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-semibold mb-6 text-accent">Generated README Preview</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-700 border border-red-900 text-white rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          <ReadmePreview readmeContent={generatedReadme} isLoading={isLoading || (isAnalyzing && !analysisDone)} />
        </section>
      </main>

      <footer className="text-center mt-12 py-6 border-t border-slate-700">
        <p className="text-slate-500">
          Built by Nikhil❤️. Crafted with care.
        </p>
      </footer>
    </div>
  );
};

export default App;
