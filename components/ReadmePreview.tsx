
import React, { useState, useEffect } from 'react';
import { ClipboardDocumentCheckIcon, ClipboardIcon, DocumentTextIcon } from './icons';
import { Spinner } from './Spinner';


interface ReadmePreviewProps {
  readmeContent: string;
  isLoading: boolean;
}

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({ readmeContent, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };
  
  useEffect(() => {
    // If content changes, reset copied state
    setCopied(false);
  }, [readmeContent]);

  return (
    <div className="relative h-full flex flex-col">
      {readmeContent && !isLoading && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-md transition-colors z-10"
          title={copied ? "Copied!" : "Copy Markdown"}
        >
          {copied ? <ClipboardDocumentCheckIcon className="w-5 h-5 text-accent" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      )}
      <div className="flex-grow bg-slate-900 p-4 rounded-md border border-slate-700 h-[calc(100vh-20rem)] min-h-[300px] overflow-y-auto relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 bg-opacity-75 z-20">
            <Spinner className="w-12 h-12 text-primary mb-4" />
            <p className="text-slate-300 text-lg">Generating your README...</p>
          </div>
        )}
        {!isLoading && !readmeContent && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <DocumentTextIcon className="w-24 h-24 mb-4 opacity-50" />
            <p className="text-xl">Your generated README will appear here.</p>
            <p className="text-sm">Fill in the project details and click "Generate README".</p>
          </div>
        )}
        {readmeContent && (
          <pre className="whitespace-pre-wrap break-words text-sm text-slate-200 font-mono">
            {readmeContent}
          </pre>
        )}
      </div>
    </div>
  );
};
    