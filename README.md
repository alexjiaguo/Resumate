# 📄 ResuMate — Privacy-First AI Resume Builder

Build, tailor, and export professional resumes with premium templates, local-first editing, and your own AI provider. 

> **Why people star ResuMate:** It gives job seekers a polished, high-performance resume workflow without locking their data into a black-box SaaS.

![ResuMate editor preview](./docs/assets/editor-preview.png)

---

## 🌟 Why ResuMate

Most resume builders are some combination of:
- Generic-looking templates
- Expensive subscriptions
- Weak customization
- Poor export quality
- Unclear data/privacy practices

**ResuMate** takes a different approach:
- 🛡️ **Privacy-first** — Local-first editing and persistence.
- 🤖 **AI-powered** — Tailor resumes to job descriptions with your preferred model.
- 🔑 **BYO API key** — Use OpenAI, Gemini, DeepSeek, or a compatible provider.
- 🎨 **Premium templates** — 9 polished layouts for different use cases.
- 🖨️ **Flexible exports** — Print to PDF and support multiple output workflows (powered by Next.js & React).

---

## 📸 System Screenshots

### 🚀 SaaS Landing Page
![Landing Page](./docs/assets/landing-page.png)

### 📊 User Dashboard & Resume Management
![Dashboard](./docs/assets/dashboard.png)

### 📝 Live Editor
![Editor Preview](./docs/assets/editor-preview.png)

---

## 🚀 Core Features

### 1️⃣ Multi-Layout Support (9 Templates)
ResuMate includes **9 resume templates** covering minimalist, ATS-friendly, technical, academic, and photo-forward layouts:
- **Classic Minimal**: Minimalist, clean-slate design for high-impact single-page resumes.
- **Clean Layout**: Classic professional layout focusing on readability and bottom grid structure.
- **Premium Headshot**: Modern sidebar layout with headshot and advanced column management.
- **ATS Executive**: Optimized for Application Tracking Systems with metrics alignment.
- **Photo Header**: Photo in header with two-column body grid.
- **Clean Professional**: Centered header with horizontal dividers.
- **Elegant TwoColumn**: Two-column grid with classic serif aesthetics.
- **Bold Engineer**: Bold black headers + photo optimized for technical roles.
- **Academic**: Serif, education-first design featuring custom GPA & Coursework rendering.

### 2️⃣ AI Resume Tailoring
- Paste a job description and upload your base resume.
- Generate a tailored version using your selected LLM provider (OpenAI, Gemini, DeepSeek).
- Review and refine before exporting.

### 3️⃣ Local-First Workflow
- Auto-save in the browser using global state (`Zustand` & `localStorage`).
- No mandatory account for the core experience.
- Useful even without a backend.

### 4️⃣ Customization Controls
- **16+ Professional Presets** (e.g., *California Beaches*, *Cobalt Sky*, *Urban Loft*).
- Font family and precision typography controls.
- Interactive reordering for sections and resume blocks.
- Dynamic spacing adjustments (Top/Bottom/Left/Right).

---

## 🎯 Who it’s for

ResuMate is especially useful for:
- 🏃‍♂️ **Active job seekers** applying to many roles.
- 🔄 **Career switchers** who need help reframing their experience.
- 🎓 **Students and early-career candidates** starting from zero.
- 👨‍💻 **Technical users** who prefer BYO-API instead of paying AI subscription markups.

---

## 📂 Project Structure

This repository was recently upgraded to a full **Next.js SaaS** foundation.

```text
Resumate/
├── src/                  # Main Next.js application & React components
├── docs/                 # Product, Technical & System documentation
├── public/               # Static assets & icons
├── _archive/             # Legacy React app & standalone HTML implementations
├── .env.local            # Environment variables
└── package.json          # Project dependencies (Next.js, Tailwind, Zustand)
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn
- Optional: API keys for AI features (OpenAI, Gemini, or DeepSeek)

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexjiaguo/Resumate.git
   cd Resumate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create a local .env file
   cp .env.example .env.local
   ```
   *Edit `.env.local` to add your specific API keys for OpenAI/Gemini/DeepSeek.*

4. **Start the development server**
   ```bash
   npm run dev
   ```

Then open `http://localhost:3000` (or the port specified by Next.js) to begin building!

---

## 🚧 Roadmap

### Near-term
- Better onboarding and demo clarity
- Sharper job-description tailoring UX
- Cleaner export workflows
- Better contribution paths and starter issues

### Planned platform work (v2.0)
- 🔄 User authentication (Supabase)
- 🔄 Cloud sync & Server-side API key management
- 🔄 Resume history/versioning
- 🔄 Payment integration (Stripe)
- 🔄 Team/collaboration features

---

## 🔐 Security Note

ResuMate currently supports a **BYO-API** client-side workflow for flexibility and cost control. While convenient, client-side key storage has trade-offs. 
**IMPORTANT:** Never commit API keys to git. Use `.env.local` for all sensitive keys.

---

## 🤝 Contributing

Contributions are welcome, especially around:
- Template polish
- Editor UX & export quality
- AI prompting/tailoring quality
- Docs and onboarding

---

## ⚖️ License

Currently listed as:
> Personal use for job hunting and career management.

If broader open-source adoption is a goal, choosing a standard OSS license will materially improve contribution and star conversion.

---

⭐ **If ResuMate helps you, star the repo — it helps more job seekers discover it!**
