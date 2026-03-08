# Resume Tailoring & LLM Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable users to generate tailored resumes using LLMs by uploading existing materials or plain text, with full review and export capabilities.

**Architecture:** A service-oriented frontend architecture. `FileParserService` handles browser-side document parsing, `LLMService` provides a unified interface for multiple LLM providers, and a "Tailoring Hub" UI manages the workflow from upload to population.

**Tech Stack:** React, TypeScript, Zustand, `pdfjs-dist` (PDF parsing), `mammoth` (DOCX parsing), Lucide icons, `file-saver` (Exports).

---

### Task 1: Environment & Dependencies

**Files:**
- Modify: `resume-builder-react/package.json`

**Step 1: Install dependencies**

Run: `cd resume-builder-react && npm install pdfjs-dist mammoth file-saver --silent`

**Step 2: Commit**

```bash
git add resume-builder-react/package.json
git commit -m "chore: add tailoring dependencies (pdfjs, mammoth, file-saver)"
```

---

### Task 2: File Parser Service

**Files:**
- Create: `resume-builder-react/src/services/FileParserService.ts`

**Step 1: Implement the service**

```typescript
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export class FileParserService {
  static async parseFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return this.parsePdf(file);
    } else if (extension === 'docx' || extension === 'doc') {
      return this.parseDocx(file);
    } else if (extension === 'txt' || extension === 'md') {
      return file.text();
    }
    
    throw new Error(`Unsupported file type: ${extension}`);
  }

  private static async parsePdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '
';
    }
    
    return fullText;
  }

  private static async parseDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
}
```

**Step 2: Commit**

```bash
git add resume-builder-react/src/services/FileParserService.ts
git commit -m "feat: implement FileParserService for PDF and DOCX"
```

---

### Task 3: LLM Service & Adapters

**Files:**
- Create: `resume-builder-react/src/services/LLMService.ts`

**Step 1: Implement the service**

```typescript
export interface LLMProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export class LLMService {
  static async tailorResume(
    provider: LLMProvider,
    sourceResume: string,
    workHistory: string,
    jobDescription: string
  ): Promise<string> {
    const prompt = `
      You are a professional resume writer. Tailor the following resume and work history to match the provided job description.
      Output the result in valid JSON format matching this structure:
      {
        "personalInfo": { "fullName": "", "title": "", "email": "", "phone": "", "linkedin": "", "location": "" },
        "summary": "",
        "experience": [{ "id": "1", "company": "", "location": "", "title": "", "dates": "", "achievements": [""] }],
        "education": [{ "id": "1", "school": "", "degree": "", "dates": "", "location": "" }],
        "skills": [{ "id": "1", "name": "", "isHighlighted": false }],
        "languages": [""],
        "certifications": [""]
      }

      SOURCE RESUME:
      ${sourceResume}

      WORK HISTORY:
      ${workHistory}

      JOB DESCRIPTION:
      ${jobDescription}
    `;

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'LLM Call Failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

**Step 2: Commit**

```bash
git add resume-builder-react/src/services/LLMService.ts
git commit -m "feat: implement LLMService with JSON output support"
```

---

### Task 4: Store Enhancement

**Files:**
- Modify: `resume-builder-react/src/store.ts`
- Modify: `resume-builder-react/src/types.ts`

**Step 1: Update types**

```typescript
// Add to types.ts
export interface ApiSettings {
  openaiKey: string;
  geminiKey: string;
  deepseekKey: string;
  customBaseUrl: string;
  selectedProvider: 'openai' | 'gemini' | 'custom';
}
```

**Step 2: Update store defaults and actions**

```typescript
// In store.ts
// Add apiSettings to state and update methods to persist them.
```

**Step 3: Commit**

```bash
git add resume-builder-react/src/store.ts resume-builder-react/src/types.ts
git commit -m "feat: enhance store with API settings and source materials"
```

---

### Task 5: Tailoring Hub UI

**Files:**
- Create: `resume-builder-react/src/components/TailoringHub.tsx`
- Modify: `resume-builder-react/src/App.tsx`

**Step 1: Build the UI component**
- Implement upload zones for Resume, Work History, and JD.
- Add "Tailor with LLM" and "Load Tailored File" buttons.
- Show parsing status and character counts.

**Step 2: Implement "Review & Confirm"**
- Display the LLM output in a structured way.
- Add a "Populate Template" button that calls `updateData`.

**Step 3: Commit**

```bash
git add resume-builder-react/src/components/TailoringHub.tsx resume-builder-react/src/App.tsx
git commit -m "feat: add Tailoring Hub UI and Review/Confirm workflow"
```

---

### Task 6: Export System

**Files:**
- Create: `resume-builder-react/src/utils/ExportUtils.ts`
- Modify: `resume-builder-react/src/App.tsx`

**Step 1: Implement Markdown Export**
- Write a function to serialize `ResumeData` to Markdown.

**Step 2: Implement HTML Export**
- Create a function that bundles current HTML + inline styles into a downloadable blob.

**Step 3: Add export buttons to sidebar**

**Step 4: Commit**

```bash
git add resume-builder-react/src/utils/ExportUtils.ts resume-builder-react/src/App.tsx
git commit -m "feat: implement Markdown and HTML exports"
```
