import React from 'react';
import { ProjectDetails, CommonLicense } from '../types';

interface ProjectDetailsFormProps {
  details: ProjectDetails;
  licenses: CommonLicense[];
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({ details, licenses }) => {
  const DisplayField: React.FC<{label: string, value: string | undefined | null, placeholder?: string, rows?: number, isMonospace?: boolean}> = 
    ({label, value, placeholder = "Awaiting analysis...", rows, isMonospace = false}) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {rows ? (
        <textarea
          readOnly
          rows={rows}
          value={value || ''}
          placeholder={value ? undefined : placeholder}
          className={`w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-100 placeholder-slate-500 ${isMonospace ? 'font-mono text-xs' : ''} resize-none`}
        />
      ) : (
        <input
          type="text"
          readOnly
          value={value || ''}
          placeholder={value ? undefined : placeholder}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-100 placeholder-slate-500"
        />
      )}
    </div>
  );

  return (
    <form className="space-y-6">
      <DisplayField label="Project Name" value={details.projectName} />
      <DisplayField label="Project Description" value={details.projectDescription} rows={3} />
      <DisplayField label="Main Language / Framework" value={details.mainLanguage} placeholder="Undetected or N/A"/>
      
      {details.detectedTechnologies && (
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
            Detected Technologies
            </label>
            <p className="text-sm text-slate-300 bg-slate-700 p-3 rounded-md border border-slate-600">{details.detectedTechnologies || "N/A"}</p>
         </div>
      )}

      <div>
        <label htmlFor="licenseTypeDisplay" className="block text-sm font-medium text-slate-300 mb-1">
          License Type
        </label>
        <select
          id="licenseTypeDisplay"
          name="licenseTypeDisplay"
          value={details.licenseType}
          disabled // This makes the select read-only effectively
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-100 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {/* Ensure 'Not Detected' is an option if it can be a value */}
          {!licenses.find(l => l.value === 'Not Detected') && details.licenseType === 'Not Detected' && (
            <option value="Not Detected">Not Detected</option>
          )}
          {licenses.map(license => (
            <option key={license.value} value={license.value}>{license.label}</option>
          ))}
        </select>
      </div>

      {details.licenseType === 'Other' && details.customLicenseType && (
        <DisplayField label="Custom License Name" value={details.customLicenseType} />
      )}

      <DisplayField 
        label="Analyzed Project Context (Read-Only)" 
        value={details.codeSnippets} 
        rows={8} 
        isMonospace 
        placeholder="Project analysis results will appear here after clicking 'Analyze Project Files'."
      />
    </form>
  );
};