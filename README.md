# Professional Resume Builder Ecosystem 📝

A high-performance, browser-based resume customization suite designed for modern professionals. The ecosystem was successfully rewritten from raw HTML to a **React-based architecture (Vite + TS + Zustand)** while maintaining 100% pixel-perfect visual fidelity with the original HTML templates.

## 🚀 Key Features

### 🏢 Multi-Layout Support (9 Templates)
- **v1.0 Classic Minimal**: Minimalist, clean-slate design for high-impact single-page resumes.
- **v2.0 Clean Layout**: Classic professional layout focusing on readability and bottom grid structure.
- **v3.0 Premium Headshot**: Modern sidebar layout with headshot and advanced column management.
- **v4.0 ATS Executive**: Optimized for Application Tracking Systems with metrics alignment.
- **v5.0 Photo Header**: Photo in header with two-column body grid.
- **v6.0 Clean Professional**: Centered header with horizontal dividers.
- **v7.0 Elegant TwoColumn**: Two-column grid with classic serif aesthetics.
- **v8.0 Bold Engineer**: Bold black headers + photo optimized for technical roles.
- **v9.0 Academic**: Serif, education-first design featuring custom GPA & Coursework rendering.

### 🎨 Visual Customization
- **16+ Professional Presets**: Instant color schemes including *California Beaches*, *Cobalt Sky*, *Stone Path*, *Urban Loft*, and *Emerald Odyssey*.
- **Precision Typography**: Per-element font-sizing and family selection (Inter, Roboto, Open Sans, etc.).
- **Dynamic Spacing**: Granular control over page padding (Top/Bottom/Left/Right), item spacing, and section line-height (0.1 increments).

### ✍️ Intelligent Editing
- **Advanced Text Formatting**: Optimized formatting engine using Tiptap for rich-text inline editing without styling conflicts.
- **Interactive Reordering**: Instantly move entire sections or individual job/education blocks up or down.
- **Global State Management**: Powered by Zustand to persist all changes instantly across templates.

### 💾 Persistence & Output
- **Local Auto-Save**: All changes, content, and layout settings are automatically persisted to `localStorage`.
- **Print Optimized**: Clean CSS media queries strictly ensure the output is pixel-perfect for PDF generation and standard A4 printing.

## 🛠 Usage Instructions

1.  **Start Dev Server**: Run `npm run dev` to start the React application.
2.  **Select Template**: Switch between the 9 templates in the Design tab to find your preferred layout.
3.  **Edit Content**: Use the **Content** tab to input your work experience, education, and skills. Use the **AI** tab to refine bullet points.
4.  **Format**: Make granular typography and color adjustments in the **Design** tab.
5.  **Export**: Click the **Print PDF** button to generate your final A4 document.

## 📂 Project Structure

- `src/`: Core React components, templates (`Academic.tsx`, `CleanLayout.tsx`, etc.), and state management.
- `docs/`: Technical specifications and requirement documentation.
- `templates/`: The original raw HTML templates used as architectural design references.

## ⚖️ License
Personal use for job hunting and career management.

---

*Built with ❤️ for the 2026 Job Hunt.*
