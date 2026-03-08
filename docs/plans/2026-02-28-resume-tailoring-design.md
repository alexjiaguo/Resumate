# Resume Tailoring & LLM Integration Design

## 1. Overview
The goal is to enable users to generate tailored resumes using LLMs (OpenAI, Gemini, DeepSeek, etc.) by uploading existing materials (resume, work history, JD). The system will also support manual tailoring via text/markdown uploads and provide comprehensive export options (PDF, HTML, Markdown).

## 2. Architecture

### 2.1 Service Layer
- **FileParserService**: Browser-side parsing of PDF (`pdfjs-dist`) and Word (`mammoth`) files into plain text.
- **LLMService**: Universal adapter interface for LLM providers.
    - **OpenAI Adapter**: Direct API calls to OpenAI.
    - **Gemini Adapter**: Direct API calls to Google Gemini.
    - **OpenAI-Compatible Adapter**: Reusable adapter for providers like DeepSeek, Kimi, Qianwen, and GLM using custom base URLs.

### 2.2 State Management (Zustand)
- **API Settings**: Storage for API keys and preferred models.
- **Source Materials**: Raw text of uploaded resume, work experience, and job description.
- **Draft State**: Holding area for LLM-generated content before applying to the main resume state.

## 3. Features

### 3.1 Tailoring Hub (UI)
- **Input Modes**:
    - **Automated**: Upload fields for Resume, Work History, and JD. "Draft with LLM" button.
    - **Fast-Track**: Upload/Paste tailored text/markdown. "Review & Populate" button.
- **Review & Confirm UI**: 
    - Side-by-side view showing the generated content (Markdown/JSON).
    - Field mapping logic to extract structured data from LLM text.
    - "Populate to [Selected Template]" button.

### 3.2 Export System
- **PDF**: Shortcut to browser print dialog (high quality) with optimized CSS.
- **Markdown**: Dynamic conversion of `ResumeData` to GFM Markdown.
- **HTML**: Standalone single-file HTML bundle export.

## 4. Implementation Steps
1. Add dependencies: `pdfjs-dist`, `mammoth`.
2. Implement `FileParserService`.
3. Implement `LLMService` with multi-provider support.
4. Enhance `store.ts` with API settings and draft logic.
5. Build the "Tailoring Hub" sidebar/modal component.
6. Implement the "Review & Confirm" workflow.
7. Add Export/Download utilities.
