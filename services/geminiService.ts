import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProjectDetails } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

export async function generateReadmeWithGemini(
  details: ProjectDetails,
  badgeMarkdowns: string[],
  activeLicenseType: string | 'Not Detected'
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const badgesString = badgeMarkdowns.length > 0 
    ? `Please incorporate the following Markdown badges naturally at the top of the README, below the title and a brief intro:
    ${badgeMarkdowns.join('\n    ')}`
    : "No specific badges were selected, but you can suggest common ones if appropriate for the project type (e.g., based on main language).";

  let projectContext = `
Project Name: "${details.projectName}"
Project Description: "${details.projectDescription}"
Main Language/Framework (auto-detected): "${details.mainLanguage || 'Not explicitly detected'}"
License (auto-detected): "${activeLicenseType === 'Not Detected' ? 'Not detected or not specified' : activeLicenseType}"
`;

  projectContext += "\n**Analyzed Project Context (use this heavily for generation):**\n";
  if (details.detectedTechnologies) {
    projectContext += `Detected Technologies/Dependencies: "${details.detectedTechnologies}"\n`;
  } else {
    projectContext += `Detected Technologies/Dependencies: "None explicitly detected beyond the main language."\n`;
  }
  if (details.projectStructureSummary) {
    projectContext += `Project Structure Summary: "${details.projectStructureSummary}"\n`;
  } else {
    projectContext += `Project Structure Summary: "No detailed structure summary available."\n`;
  }
  
  if (details.codeSnippets && details.codeSnippets.includes("Project Overview:")) {
      projectContext += `Detailed Overview / Key File Contents from Analysis:
\`\`\`text
${details.codeSnippets}
\`\`\`
`;
  } else {
    projectContext += `Additional Context: No detailed file contents or specific overview was extracted from analysis. Please generate generic sections based on project name, description, and language.`;
  }

  const prompt = `
You are an expert AI assistant specialized in generating professional GitHub README.md files.
Your goal is to create a comprehensive, well-structured, and engaging README based *solely* on the provided auto-analyzed project details and context. Do not ask the user for manual input.

**Auto-Analyzed Project Information:**
${projectContext}

Please generate the README.md content with the following structure and considerations:

1.  **Project Title**: Use the "Project Name" provided, formatted as a main heading (e.g., \`# ${details.projectName}\`).
2.  **Introduction**: A concise and engaging paragraph expanding slightly on the "Project Description".
3.  **Badges**: ${badgesString}
4.  **Table of Contents (Optional but Recommended)**: If the README becomes lengthy (more than 4-5 main sections), include a Markdown table of contents.
5.  **Features (Highly Recommended)**: Based on the "Project Description" and "Analyzed Project Context", list key features as bullet points. If context is sparse, suggest common features for the type of project if inferable from name, description, or language.
6.  **Technologies Used**: List technologies from "Detected Technologies/Dependencies". If sparse, use "Main Language/Framework".
7.  **Installation**: Provide clear, step-by-step installation instructions.
    *   **Prioritize Analyzed Context**: Use "Detected Technologies/Dependencies" (e.g., from package.json, requirements.txt) or "Project Structure Summary" (e.g., presence of npm, pip, Maven, Gradle files) to infer commands. For example, if 'React' and 'npm' are detected, suggest \`npm install\`. If 'Python' and 'pip' are detected with a requirements.txt, suggest \`pip install -r requirements.txt\`.
    *   If only "Main Language/Framework" is detected, suggest standard package manager commands.
    *   If information is minimal, provide a generic template like:
        \`\`\`markdown
        ## Installation
        1. Clone the repository:
           \`\`\`bash
           git clone https://github.com/your-username/${details.projectName.toLowerCase().replace(/\s+/g, '-')}.git
           \`\`\`
        2. Navigate to the project directory:
           \`\`\`bash
           cd ${details.projectName.toLowerCase().replace(/\s+/g, '-')}
           \`\`\`
        3. Install dependencies (verify based on your project's package manager and files, e.g., \`package.json\` -> \`npm install\`, \`requirements.txt\` -> \`pip install -r requirements.txt\`):
           \`\`\`bash
           # npm install 
           # pip install -r requirements.txt
           # ./gradlew build
           # Add specific command here
           \`\`\`
        \`\`\`
8.  **Usage**: Explain how to use/run the project.
    *   **Prioritize Analyzed Context**: Use "Detailed Overview / Key File Contents" (e.g., scripts from package.json) or "Project Structure Summary" for clues.
    *   If details are sparse, provide a template for common commands based on detected language/framework (e.g., \`npm start\`, \`python main.py\`) or a placeholder.
9.  **Contributing**: Include a standard placeholder for contribution guidelines. Example:
    \`\`\`markdown
    ## Contributing
    Contributions are welcome! Please feel free to open an issue to discuss a new feature or bug, or submit a pull request.
    1. Fork the Project
    2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
    3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
    4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
    5. Open a Pull Request
    \`\`\`
10. **License**: State the project's license.
    *   If "License (auto-detected)" is not 'Not detected or not specified', state: "This project is licensed under the ${activeLicenseType} license."
    *   For common licenses (MIT, Apache-2.0, GPL-3.0), you can add a link to the full license text on opensource.org. Example for MIT: \`[MIT License](https://opensource.org/licenses/MIT)\`.
    *   If no license was detected, you can state: "License information was not automatically detected. Please add license details."
11. **Acknowledgements (Optional)**: If relevant (e.g., based on context if any libraries were credited in analyzed files), add a section.

**Output Format**: The entire output MUST be in valid Markdown format. Do not include any explanations outside of the Markdown content itself.

**Tone**: Professional, clear, and welcoming.

Ensure the generated README is well-organized. If some information is missing from analysis, make reasonable assumptions or provide clear placeholders for the user to fill *in the generated Markdown themselves later*, but do not ask for input during generation.
Focus entirely on leveraging the auto-analyzed context.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("Received an empty response from the API.");
    }
    // Clean up potential markdown code fences around the entire response
    let cleanedText = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanedText.match(fenceRegex);
    if (match && match[2]) {
      cleanedText = match[2].trim();
    }
    return cleanedText;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        const cause = (error as any).cause;
        if (error.message.includes("API_KEY_INVALID") || cause?.message?.includes("API_KEY_INVALID")) {
            throw new Error("The provided API key is invalid or not configured correctly. Please check your API_KEY environment variable.");
        }
         if (cause?.status === 400 || cause?.type?.includes("INVALID_ARGUMENT")) {
           throw new Error("The request to the AI model was invalid. This might be due to an issue with the prompt or input data. Please check the console for more details from the AI service.");
        }
    }
    throw new Error(`Gemini API request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}