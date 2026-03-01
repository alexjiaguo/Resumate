# Resume Builder — Complete System Documentation & Rebuild Blueprint

> **Purpose**: This document is the definitive reference for rebuilding the entire Resume Builder system from scratch. It covers every architectural decision, pattern, and implementation detail across all 9 templates.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Architecture Pattern](#3-architecture-pattern)
4. [CSS Design System](#4-css-design-system)
5. [HTML Structure](#5-html-structure)
6. [JavaScript Customizer Class](#6-javascript-customizer-class)
7. [Control Panel](#7-control-panel)
8. [Section Tools (Reorder/Add/Delete)](#8-section-tools)
9. [Save / Load / Reset System](#9-save--load--reset-system)
10. [Color Scheme Presets](#10-color-scheme-presets)
11. [Skill Tags System](#11-skill-tags-system)
12. [Text Formatting Toolbar](#12-text-formatting-toolbar)
13. [Typography & Sizing Controls](#13-typography--sizing-controls)
14. [Photo Upload System](#14-photo-upload-system)
15. [Print / PDF Output](#15-print--pdf-output)
16. [Template Catalog](#16-template-catalog)
17. [Known Gotchas & Critical Fixes](#17-known-gotchas--critical-fixes)
18. [Rebuild Checklist](#18-rebuild-checklist)

---

## 1. Project Overview

A **browser-based**, zero-dependency resume customization suite. Each template is a **single self-contained HTML file** with inline CSS and JavaScript — no build tools, no frameworks, no external JS libraries. Opens directly in any modern browser via `file://` protocol.

**Key Principles**:
- **Single-file templates** — each `.html` is fully self-contained (CSS + HTML + JS)
- **contenteditable** — the resume is directly editable in-browser
- **localStorage persistence** — all changes auto-saved per template
- **CSS variables** — all visual properties controlled via `--custom-properties`
- **Print-optimized** — `@media print` hides controls, outputs clean A4 PDF
- **No server required** — works entirely client-side

---

## 2. File Structure

```
Resume_Builder/
├── index.html                    # Hub page — links to all templates
├── Classic_Minimal.html          # v1.0 — Single column, minimal
├── Clean_Layout.html             # v2.0 — Centered header, bottom grid
├── Premium_Headshot.html         # v3.0 — Two-column sidebar + headshot
├── ATS_Executive.html            # v4.0 — ATS-optimized, metrics row
├── Photo_Header.html             # v5.0 — Photo in header, two-column body
├── Clean_Professional.html       # v6.0 — Centered header, horizontal dividers
├── Elegant_TwoColumn.html        # v7.0 — Two-column grid, classic serif
├── Bold_Engineer.html            # v8.0 — Bold black headers + photo
├── Academic.html                 # v9.0 — Serif, education-first
├── headshot.png                  # Shared headshot image
├── docs/                         # Design specs (v1-v4)
│   ├── Resume_Builder_v1.0_Spec.md
│   ├── Resume_Builder_v2.0_Spec.md
│   ├── Resume_Builder_v3.0_Spec.md
│   └── Resume_Builder_v4.0_Spec.md
├── backups/                      # Template backups before modifications
└── *.py                          # Utility scripts (populate_core, fix_css, etc.)
```

---

## 3. Architecture Pattern

Every template follows the same three-zone architecture:

```
┌──────────────────────────────────────────────────┐
│  <aside class="controls">  │  <div class="resume"  │
│  ┌─────────────────────┐   │   id="resume"          │
│  │ Save / Load / Reset │   │   contenteditable>     │
│  ├─────────────────────┤   │  ┌──────────────────┐  │
│  │ Color Schemes       │   │  │ Header           │  │
│  ├─────────────────────┤   │  ├──────────────────┤  │
│  │ Text Formatting     │   │  │ Summary          │  │
│  ├─────────────────────┤   │  ├──────────────────┤  │
│  │ Layout & Sizes      │   │  │ Section (×N)     │  │
│  ├─────────────────────┤   │  │  ├── section-title│  │
│  │ Typography Sizes    │   │  │  ├── job (×N)    │  │
│  ├─────────────────────┤   │  │  └── reorder-btns│  │
│  │ Spacing             │   │  ├──────────────────┤  │
│  ├─────────────────────┤   │  │ Skills / Bottom  │  │
│  │ Add Content         │   │  └──────────────────┘  │
│  ├─────────────────────┤   │                         │
│  │ Print PDF           │   │                         │
│  └─────────────────────┘   │                         │
│  width: 300px, fixed left  │  width: 210mm (A4)      │
└──────────────────────────────────────────────────┘
```

**Data flow**:
```
User edits resume (contenteditable)
  → input event on #resume
    → saveSettings() called
      → serializes control values + resume innerHTML to localStorage

Page load
  → new Customizer() constructor
    → loadSettings() restores from localStorage
      → attachReorderButtons() injects section tools
```

---

## 4. CSS Design System

### 4.1 CSS Variables (`:root`)

Every template defines these CSS custom properties (values vary per template):

```css
:root {
  /* Colors */
  --header-color: #2c3e50;      /* Section titles, name, company names */
  --accent-color: #2980b9;      /* Dates, links, highlighted elements */
  --text-color: #2c3e50;        /* Body text */
  --bg-color: #f5f5f5;          /* Page background (behind resume) */
  --resume-bg: #ffffff;         /* Resume paper background */

  /* Typography */
  --base-font-size: 11px;       /* Default body text size */
  --header-font-size: 26px;     /* Name (h1) size */
  --section-title-size: 12px;   /* Section heading size */
  --company-font-size: 11px;    /* Company/school name size */
  --line-height: 1.4;           /* Global line height */
  --font-family: "Inter", sans-serif;
  --tag-size: 7px;              /* Inline tag font size */

  /* Layout */
  --page-padding: 40px;         /* Resume inner padding */

  /* Template-specific (some templates only) */
  --summary-bg: #f5f6fa;        /* v2.0 summary background */
  --section-spacing: 12px;      /* v2.0+ section gap */
  --item-spacing: 6px;          /* v2.0+ item gap within sections */
  --sidebar-width: 200px;       /* v3.0 sidebar */
  --headshot-size: 100px;       /* v3.0/v5.0/v8.0 photo size */
  --headshot-radius: 50%;       /* v8.0 photo border-radius */
}
```

### 4.2 Google Fonts Import

All templates use the same font import:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Merriweather:wght@300;400;700&display=swap');
```

Available font families: **Inter**, **Roboto**, **Open Sans**, **Merriweather** (serif).

### 4.3 Controls Panel Styles

Two visual themes exist:

| Theme | Templates | Background | Text Color |
|-------|-----------|-----------|-----------|
| **Dark** | v1.0 | `#2c3e50` | `#ecf0f1` |
| **Light** | v2.0–v9.0 | `#fff` | `#333` |

Common control panel CSS:
```css
.controls {
  position: fixed; left: 0; top: 0;
  width: 300px; height: 100vh;
  padding: 15px-20px;
  overflow-y: auto; z-index: 1000;
  font-size: 12px-13px;
}
```

### 4.4 Resume Page Styles

```css
.resume {
  width: 210mm;            /* A4 width */
  min-height: 297mm;       /* A4 height */
  background: var(--resume-bg);
  padding: var(--page-padding);
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  font-size: var(--base-font-size);
  line-height: var(--line-height);
  color: var(--text-color);
  position: relative;      /* For page-break-marker */
}
body {
  padding-left: 320px;     /* Space for fixed control panel */
}
```

### 4.5 Stepper Component

Custom number input with +/- buttons:
```css
.stepper {
  display: flex; align-items: center;
  border: 1px solid #d9d9d9; border-radius: 4px;
  overflow: hidden; background: #fff;
}
.stepper button {
  width: 28-32px; height: 28-32px;
  background: #f5f5f5; border: none; cursor: pointer;
}
.stepper input {
  flex: 1; text-align: center; border: none;
  -moz-appearance: textfield; /* Hide spin buttons */
}
```

### 4.6 Print Styles

```css
@media print {
  body { padding: 0; background: white; }
  .controls { display: none; }
  .resume { box-shadow: none; margin: 0; width: 100%; padding: var(--page-padding); }
  .reorder-btns, .fmt-bar, .page-break-marker { display: none !important; }
  @page { margin: 0; }
}
```

---

## 5. HTML Structure

### 5.1 Resume Content Structure

```html
<div class="resume" contenteditable="true" id="resume">
  <!-- Page Break Marker (hidden by default) -->
  <div class="page-break-marker" id="page-break-line" style="top:1122px; display:none"></div>

  <!-- Header -->
  <div class="header" id="header">
    <h1>Full Name</h1>
    <div class="info">Phone · <a href="mailto:...">email</a> · <a href="...">linkedin</a></div>
  </div>

  <!-- Summary Section -->
  <div class="section">
    <div class="summary">Summary text...</div>
  </div>

  <!-- Professional Experience -->
  <div class="section">
    <div class="section-title">Professional Experience</div>
    <div class="job">
      <div class="job-header">
        <span>Company, Location</span>
        <span class="dates">Date – Present</span>
      </div>
      <div class="job-title">Job Title</div>
      <ul>
        <li>Achievement bullet point</li>
      </ul>
    </div>
    <!-- More .job blocks... -->
  </div>

  <!-- Education -->
  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-item">
      <div class="edu-left">
        <span class="edu-school">University</span>
        <span class="edu-degree">Degree</span>
      </div>
      <span class="edu-dates">Dates</span>
    </div>
  </div>

  <!-- Skills -->
  <div class="section">
    <div class="section-title">Key Skills</div>
    <div class="skills-wrap">
      <span class="sk hl">Highlighted Skill<span class="sk-del" contenteditable="false" onclick="resumeCustomizer.removeSkill(this)">×</span></span>
      <span class="sk">Regular Skill<span class="sk-del" contenteditable="false" onclick="resumeCustomizer.removeSkill(this)">×</span></span>
    </div>
  </div>

  <!-- Languages -->
  <div class="section">
    <div class="section-title">Languages</div>
    <div class="lang-item">English (Fluent)</div>
  </div>

  <!-- Training & Certifications -->
  <div class="section">
    <div class="section-title">Training & Certifications</div>
    <div class="cert-item">Certification Name (Year)</div>
  </div>
</div>
```

### 5.2 Section Classes by Template

| Element | v1.0 | v2.0 | v3.0 | v4.0 | v5.0–v9.0 |
|---------|------|------|------|------|-----------|
| Section wrapper | `.section` | `.section` | `.sb-section` (sidebar), `.section` (main) | `.section` | `.section` |
| Section title | `.section-title` | `.section-title` | `.sb-heading` / `.section-title` | `.section-title` | `.section-title` or `.sec-header` |
| Job block | `.job` | `.job` | `.job` | `.job` | `.job` or `.exp-item` |
| Education | `.edu-item` | in `.bottom` grid | `.edu-block` | `.edu-item` | `.edu-entry` |
| Skills container | `.skills-wrap` | `.skills-wrap` | `.sk-wrap` | `.skills-wrap` | `.skills-wrap` |

### 5.3 Template Layout Variants

**Single Column** (v1.0, v2.0, v4.0, v6.0):
```
┌─────────────────────┐
│       Header        │
├─────────────────────┤
│      Summary        │
├─────────────────────┤
│ Professional Exp    │
├─────────────────────┤
│ Education / Skills  │
└─────────────────────┘
```

**Two-Column Sidebar** (v3.0 Premium Headshot):
```
┌────────┬────────────┐
│Sidebar │  Main      │
│ Photo  │ Prof Exp   │
│ Skills │ Education  │
│ Langs  │ Certs      │
│ Certs  │            │
└────────┴────────────┘
```
- Sidebar: `<div id="sidebar">` with `.sb-section` blocks
- Main: `<div id="main-container">` with `.section` blocks
- CSS: `display:flex` on `.resume`

**Two-Column Grid** (v7.0 Elegant TwoColumn):
```
┌─────────────────────┐
│       Header        │
├──────────┬──────────┤
│ Col 1    │ Col 2    │
│ Prof Exp │ Edu      │
│          │ Skills   │
└──────────┴──────────┘
```
- CSS: `display:grid; grid-template-columns: 1.6fr 1fr;`

**Photo Header** (v5.0, v8.0):
```
┌─────────────────────┐
│  [Photo] Name       │
│  Contact Info       │
├──────────┬──────────┤
│ Col 1    │ Col 2    │
│ Prof Exp │ Skills   │
└──────────┴──────────┘
```

**Bottom Grid** (v2.0 Clean Layout):
```
┌─────────────────────┐
│  Single column...   │
├───────┬──────┬──────┤
│ Edu   │Skills│Langs │ ← .bottom grid (3 columns)
└───────┴──────┴──────┘
```

---

## 6. JavaScript Customizer Class

Each template contains an inline `Customizer` class (or `ResumeCustomizer`). The class name varies but the pattern is identical.

### 6.1 Constructor

```javascript
class Customizer {
  constructor() {
    this.STORAGE_KEY = "resume_builder_v1_settings"; // unique per template
    this.settingsMap = {
      "inp-font-family":      "--font-family",
      "inp-font":             "--base-font-size",
      "inp-hsize":            "--header-font-size",
      "inp-section-title-size": "--section-title-size",
      "inp-company-size":     "--company-font-size",
      "inp-header-color":     "--header-color",
      "inp-accent-color":     "--accent-color",
      "inp-bg-color":         "--resume-bg",
      "inp-page-padding":     "--page-padding",
      "inp-line-height":      "--line-height",
      "inp-section-spacing":  null, // handled specially
      "inp-selection-size":   null, // handled specially
    };
    this.pxFields = [
      "inp-font", "inp-hsize", "inp-section-title-size",
      "inp-company-size", "inp-page-padding",
    ];
    this.init();
  }
}
```

### 6.2 Storage Keys per Template

| Template | STORAGE_KEY |
|----------|-------------|
| v1.0 Classic Minimal | `resume_builder_v1_settings` |
| v2.0 Clean Layout | `resume_builder_v2_settings` |
| v3.0 Premium Headshot | `resume_builder_v3_settings` |
| v4.0 ATS Executive | `resume_builder_v4_settings` |
| v5.0 Photo Header | `resume_builder_v5_settings` |
| v6.0 Clean Professional | `clean_prof_resume_settings` |
| v7.0 Elegant TwoColumn | `elegant_two_resume_settings` |
| v8.0 Bold Engineer | `bold_engineer_resume_settings` |
| v9.0 Academic | `resume_builder_academic_settings` |

### 6.3 Init Flow

```javascript
init() {
  this.currentSelectionRange = null;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      this.loadSettings();
      this.initTextSizing();
    });
  } else {
    this.loadSettings();
    this.initTextSizing();
  }
  this.initListeners();
  this.attachReorderButtons();
}
```

### 6.4 Core Methods

| Method | Purpose |
|--------|---------|
| `init()` | Bootstraps everything on construction |
| `initListeners()` | Binds input events to CSS variable updates + auto-save |
| `initTextSizing()` | Tracks selection, enables per-selection font size control |
| `loadSettings()` | Restores all settings + resume HTML from localStorage |
| `saveSettings()` | Serializes control values + resume HTML to localStorage |
| `resetSettings()` | Clears localStorage, reloads page |
| `applyScheme(name)` | Applies a color preset by setting control values |
| `attachReorderButtons()` | Injects hover-visible section tools |
| `addItem(section)` | Adds a job/list-item/paragraph to a section |
| `move(el, dir)` | Moves section up (-1) or down (+1) |
| `addTag()` | Inserts an inline `<span class="tag c">` at cursor |
| `addSkill(highlighted)` | Adds skill tag to skills-wrap (v5.0+) |
| `removeSkill(btn)` | Removes a skill tag (via delete button) |
| `applyStyleToSelection()` | Applies font-size to selected text |
| `flattenSpans(root)` | Prevents nested `<span>` nesting from execCommand |

---

## 7. Control Panel

### 7.1 Layout

```html
<aside class="controls">
  <h2>Template Name vX.0</h2>

  <!-- Save/Load/Reset -->
  <div class="control-row">
    <button class="btn" onclick="resumeCustomizer.saveSettings()">💾 Save</button>
    <button class="btn btn-sec" onclick="resumeCustomizer.loadSettings()">📂 Load</button>
    <button class="btn btn-danger" onclick="resumeCustomizer.resetSettings()">↺ Reset</button>
  </div>

  <!-- Color Schemes -->
  <h3>Color Schemes</h3>
  <select id="inp-color-scheme" onchange="resumeCustomizer.applyScheme(this.value)">
    <option value="none">Custom Colors</option>
    <optgroup label="Professional">...</optgroup>
    <optgroup label="Classic">...</optgroup>
    <optgroup label="Vibrant">...</optgroup>
  </select>

  <!-- Colors -->
  <h3>Colors</h3>
  <input id="inp-header-color" type="color" />
  <input id="inp-accent-color" type="color" />
  <input id="inp-bg-color" type="color" />

  <!-- Text Formatting Toolbar -->
  <h3>Text Formatting</h3>
  <div class="fmt-bar">
    <button class="fmt-btn" onmousedown="event.preventDefault(); fmt('bold')">B</button>
    <button class="fmt-btn" onmousedown="event.preventDefault(); fmt('italic')">I</button>
    <button class="fmt-btn" onmousedown="event.preventDefault(); fmt('underline')">U</button>
    <button class="fmt-btn" onmousedown="event.preventDefault(); fmt('removeFormat')">✕</button>
    <div class="fmt-color-wrap"><input type="color" onchange="restoreAndFmt('foreColor', this.value)" /></div>
    <div class="fmt-color-wrap"><input type="color" onchange="restoreAndFmt('hiliteColor', this.value)" /></div>
  </div>
  <div class="stepper"> <!-- Selected Text Size --> </div>

  <!-- Layout & Sizes -->
  <h3>Layout & Sizes</h3>
  <!-- Steppers for: Page Padding, Font Family select -->

  <!-- Typography Sizes -->
  <h3>Typography Sizes</h3>
  <!-- Steppers for: Base Font, Name Size, Section Title, Company/Edu -->

  <!-- Spacing -->
  <h3>Spacing</h3>
  <!-- Steppers for: Line Height, Section Gap -->

  <!-- Page Break -->
  <input type="checkbox" id="chk-page-break" onchange="togglePageBreak(this)" />

  <!-- Add Content -->
  <h3>Add Content</h3>
  <input id="new-sec-title" placeholder="Section Name" type="text" />
  <button onclick="addSection()">+ Section</button>
  <button onclick="resumeCustomizer.addSkill(false)">+ Skill</button>
  <button onclick="resumeCustomizer.addSkill(true)">+ Highlighted</button>
  <button onclick="resumeCustomizer.addTag()">+ Tag</button>

  <!-- Photo controls (v3.0, v5.0, v8.0 only) -->
  <h3>Headshot</h3>
  <input type="file" id="photo-upload" accept="image/*" />
  <!-- Stepper for headshot size -->

  <!-- Print -->
  <button class="btn btn-print" onclick="window.print()">Print PDF</button>
</aside>
```

### 7.2 Stepper Component (JS)

```javascript
function stepper(btn, amount) {
  const input = btn.parentNode.querySelector("input");
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 1000;
  const step = parseFloat(input.step) || 1;
  let val = (parseFloat(input.value) || 0) + amount;
  const precision = Math.max(
    (amount.toString().split(".")[1] || "").length,
    (step.toString().split(".")[1] || "").length,
  );
  val = parseFloat(val.toFixed(precision));
  if (val < min) val = min;
  if (val > max) val = max;
  input.value = val;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
```

---

## 8. Section Tools

Section tools are floating buttons (Add, Move Up, Move Down, Delete) that appear when hovering over any `.section`.

### 8.1 CSS

```css
.reorder-btns {
  position: absolute; right: 2px; top: 2px;
  display: none; flex-direction: column; gap: 2px;
  z-index: 10;
  background: rgba(255,255,255,0.95);
  padding: 2px; border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.section:hover .reorder-btns { display: flex; }
.reorder-btn {
  background: #eee; border: 1px solid #ddd;
  padding: 2px 4px; font-size: 10px;
  cursor: pointer; border-radius: 3px;
}
.reorder-btn.del { background: #fdd; color: #c00; }
```

> **Critical**: `.section` MUST have `position: relative` for the absolute positioning to work.

### 8.2 JS Injection

```javascript
attachReorderButtons() {
  // CRITICAL FIX: Auto-wrap orphaned summaries (handles localStorage restoring old HTML)
  // Case 1: A .section contains both .summary and .section-title (merged sections)
  document.querySelectorAll('.section').forEach(sec => {
    const summary = sec.querySelector('.summary, .summary-text');
    const title = sec.querySelector('.section-title');
    if (summary && title) {
      const wrapper = document.createElement('div');
      wrapper.className = 'section';
      sec.parentNode.insertBefore(wrapper, sec);
      wrapper.appendChild(summary);
    }
  });
  // Case 2: Orphaned .summary directly under #resume
  document.querySelectorAll('#resume > .summary, #resume > .summary-text').forEach(sum => {
    if (!sum.closest('.section')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'section';
      sum.parentNode.insertBefore(wrapper, sum);
      wrapper.appendChild(sum);
    }
  });

  // Inject buttons into all sections
  document.querySelectorAll(".section").forEach((sec) => {
    const existing = sec.querySelector(".reorder-btns");
    if (existing) existing.remove();
    const cnt = document.createElement("div");
    cnt.className = "reorder-btns";
    cnt.contentEditable = "false";
    cnt.innerHTML = `
      <button class="reorder-btn" title="Add Item"
        onclick="resumeCustomizer.addItem(this.closest('.section'))">+</button>
      <button class="reorder-btn"
        onclick="resumeCustomizer.move(this.closest('.section'),-1)">▲</button>
      <button class="reorder-btn"
        onclick="resumeCustomizer.move(this.closest('.section'),1)">▼</button>
      <button class="reorder-btn del"
        onclick="this.closest('.section').remove(); resumeCustomizer.saveSettings()">×</button>`;
    sec.appendChild(cnt);
  });
}
```

### 8.3 v3.0 Variant (Premium Headshot)

v3.0 uses a different selector and a separate `addButtonsToSection()` helper:
```javascript
attachReorderButtons() {
  // Auto-wrap fix for #main-container instead of #resume
  document.querySelectorAll('#main-container > .summary, ...').forEach(...)
  // Different selector chain
  document.querySelectorAll('.sb-section, #main-container > .section, .job, .edu-block')
    .forEach(sec => this.addButtonsToSection(sec));
}
```

---

## 9. Save / Load / Reset System

### 9.1 Save

```javascript
saveSettings() {
  const s = {};
  // Save all control input values
  Object.keys(this.settingsMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) s[id] = el.value;
  });
  // Save checkbox state
  const pbChk = document.getElementById("chk-page-break");
  if (pbChk) s["chk-page-break"] = pbChk.checked;
  // Save resume HTML (strip reorder buttons first!)
  const clone = document.getElementById("resume").cloneNode(true);
  clone.querySelectorAll(".reorder-btns").forEach(el => el.remove());
  s.content = clone.innerHTML;
  // Version tag for migration
  s._version = "2026-02-27e";
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(s));
}
```

### 9.2 Load

```javascript
loadSettings() {
  const raw = localStorage.getItem(this.STORAGE_KEY);
  if (!raw) { this.attachReorderButtons(); return; }
  try {
    const s = JSON.parse(raw);
    // Version check — discard incompatible saves
    if (s._version !== "2026-02-27e") {
      localStorage.removeItem(this.STORAGE_KEY);
      return;
    }
    // Restore CSS variable values
    const root = document.documentElement;
    Object.keys(this.settingsMap).forEach(id => {
      if (s[id] !== undefined) {
        const el = document.getElementById(id);
        if (el) el.value = s[id];
        const varName = this.settingsMap[id];
        if (varName) {
          if (this.pxFields.includes(id))
            root.style.setProperty(varName, s[id] + "px");
          else root.style.setProperty(varName, s[id]);
        }
      }
    });
    // Restore resume content (REPLACES entire innerHTML!)
    if (s.content)
      document.getElementById("resume").innerHTML = s.content;
    // Re-inject section tools after content restoration
    this.attachReorderButtons();
  } catch (e) { console.error(e); }
}
```

> **CRITICAL**: `loadSettings()` replaces `#resume.innerHTML` with saved content. Any HTML structure fixes made to the template file will be overridden by saved data. The `attachReorderButtons()` auto-wrap fix addresses this.

### 9.3 Reset

```javascript
resetSettings() {
  localStorage.removeItem(this.STORAGE_KEY);
  location.reload(); // reloads fresh HTML from file
}
```

### 9.4 Version Migration

The `_version` field enables breaking changes. When `_version` doesn't match, saved data is discarded:
```javascript
if (s._version !== "2026-02-27e") {
  localStorage.removeItem(this.STORAGE_KEY);
  return;
}
```

---

## 10. Color Scheme Presets

All templates share the same 20 color presets organized in 3 groups:

### Professional
| Name | Header Color | Accent Color | BG Color |
|------|-------------|-------------|----------|
| California Beaches | `#7D99AA` | `#FFC067` | `#ffffff` |
| Cobalt Sky | `#000080` | `#6D8196` | `#ffffff` |
| Salt & Pepper | `#2B2B2B` | `#B3B3B3` | `#ffffff` |
| Gothic | `#000000` | `#988686` | `#ffffff` |
| Harbor Haze | `#5C8DC5` | `#AD9E90` | `#ffffff` |

### Classic
| Name | Header Color | Accent Color | BG Color |
|------|-------------|-------------|----------|
| Winter Chill | `#0B2E33` | `#4F7C82` | `#ffffff` |
| Slate & Cream | `#4A4A4A` | `#6D8196` | `#FFFFE3` |
| Noir & Taupe | `#000000` | `#5C4E4E` | `#ffffff` |
| Elegant Teal | `#245F73` | `#733E24` | `#F2F0EF` |
| Sand & Gold | `#AD9C8E` | `#E8D59E` | `#ffffff` |
| Industrial Blue | `#736F60` | `#5C8DC5` | `#ffffff` |

### Vibrant
| Name | Header Color | Accent Color | BG Color |
|------|-------------|-------------|----------|
| Stone Path | `#968F83` | `#A49A87` | `#E8E5DF` |
| Urban Loft | `#464646` | `#A35E47` | `#ffffff` |
| Calm Blue | `#517891` | `#57B9FF` | `#ffffff` |
| Under the Moonlight | `#292966` | `#5C5C99` | `#ffffff` |
| Emerald Odyssey | `#00674F` | `#3EBB9E` | `#ffffff` |
| Ocean Tide | `#4052D6` | `#005C5C` | `#ffffff` |
| Peach Skyline | `#496580` | `#BADDFF` | `#ffffff` |
| Tropical Rainforest | `#4F7942` | `#71AA34` | `#ffffff` |
| Wildflower Meadow | `#82C8E5` | `#7CFC00` | `#ffffff` |
| Summer Breeze | `#82C8E5` | `#E6D8C4` | `#ffffff` |

---

## 11. Skill Tags System

### 11.1 HTML Structure

```html
<span class="sk">Skill Name<span class="sk-del" contenteditable="false" onclick="resumeCustomizer.removeSkill(this)">×</span></span>
<span class="sk hl">Highlighted<span class="sk-del" contenteditable="false" onclick="resumeCustomizer.removeSkill(this)">×</span></span>
```

### 11.2 CSS

```css
.skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
.sk {
  padding: 2px 8px; border-radius: 3px;
  background: #f0f3f6; color: #2c3e50;
  font-size: 11px; position: relative; /* CRITICAL for delete icon */
  cursor: pointer; transition: opacity 0.15s;
}
.sk.hl {
  background: var(--header-color);
  color: #fff; font-weight: 600;
}
.sk .sk-del {
  display: none; position: absolute;
  top: -6px; right: -6px;
  width: 14px; height: 14px;
  background: #dc2626; color: #fff;
  border: none; border-radius: 50%;
  font-size: 9px; line-height: 1;
  cursor: pointer;
  align-items: center; justify-content: center; padding: 0;
}
.sk:hover .sk-del { display: flex; }
```

> **Key**: `.sk` MUST have `position: relative` so `.sk-del` (absolute) anchors to the tag, not a parent container.

### 11.3 JS — Add/Remove Skills

```javascript
addSkill(highlighted) {
  const wrap = document.querySelector('.skills-wrap');
  if (!wrap) return;
  const sk = document.createElement('span');
  sk.className = highlighted ? 'sk hl' : 'sk';
  sk.innerHTML = `New Skill<span class="sk-del" contenteditable="false" onclick="resumeCustomizer.removeSkill(this)">×</span>`;
  wrap.appendChild(sk);
  this.saveSettings();
}
removeSkill(btn) { btn.closest('.sk').remove(); this.saveSettings(); }
```

### 11.4 Double-Click Toggle Highlight

```javascript
// Some templates support double-click to toggle .hl class
document.addEventListener('dblclick', (e) => {
  const sk = e.target.closest('.sk');
  if (sk) { sk.classList.toggle('hl'); resumeCustomizer.saveSettings(); }
});
```

---

## 12. Text Formatting Toolbar

### 12.1 Format Commands

```javascript
function fmt(command, value = null) {
  document.execCommand("styleWithCSS", false, true);
  document.execCommand(command, false, value);
  resumeCustomizer.saveSettings();
}
```

Commands: `bold`, `italic`, `underline`, `removeFormat`, `foreColor`, `hiliteColor`.

### 12.2 Selection Restore for Color Pickers

```javascript
function restoreAndFmt(command, value) {
  if (resumeCustomizer.currentSelectionRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(resumeCustomizer.currentSelectionRange);
    fmt(command, value);
    if (sel.rangeCount > 0)
      resumeCustomizer.currentSelectionRange = sel.getRangeAt(0).cloneRange();
  }
}
```

> Color picker clicks steal focus, so the selection must be saved and restored before applying the color.

### 12.3 Font Size via Magic Color Hack

The `applyStyleToSelection` method uses a clever trick to set font-size on selections:

1. Execute `hiliteColor` with a magic hex (`#ABCDEF`)
2. Find all spans with that background color
3. Clear the background, set `fontSize` instead
4. Flatten nested spans to prevent DOM bloat

This workaround is needed because `document.execCommand('fontSize')` only supports 1-7 values, not arbitrary px.

---

## 13. Typography & Sizing Controls

### 13.1 settingsMap Pattern

Every control input has an ID and a corresponding CSS variable:

```javascript
this.settingsMap = {
  "inp-font-family":       "--font-family",
  "inp-font":              "--base-font-size",
  "inp-hsize":             "--header-font-size",
  "inp-section-title-size": "--section-title-size",
  "inp-company-size":      "--company-font-size",
  "inp-header-color":      "--header-color",
  "inp-accent-color":      "--accent-color",
  "inp-bg-color":          "--resume-bg",
  "inp-page-padding":      "--page-padding",
  "inp-line-height":       "--line-height",
  "inp-section-spacing":   null,  // special handling
  "inp-selection-size":    null,  // special handling
};
```

### 13.2 pxFields

Controls whose values need `px` suffix when setting CSS variables:
```javascript
this.pxFields = [
  "inp-font", "inp-hsize", "inp-section-title-size",
  "inp-company-size", "inp-page-padding",
];
```

### 13.3 Special Handling: Section Spacing

```javascript
if (id === "inp-section-spacing") {
  document.querySelectorAll("#resume .section").forEach(s => {
    s.style.marginBottom = val + "px";
  });
}
```

---

## 14. Photo Upload System

Used in: **v3.0** (Premium Headshot), **v5.0** (Photo Header), **v8.0** (Bold Engineer).

### 14.1 HTML

```html
<input type="file" id="photo-upload" accept="image/*" style="display:none" />
<button onclick="document.getElementById('photo-upload').click()">📷 Upload Photo</button>
```

### 14.2 JS

```javascript
initPhotoUpload() {
  const input = document.getElementById('photo-upload');
  if (!input) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.querySelector('.headshot-img, #headshot-img');
      if (img) {
        img.src = ev.target.result; // base64 data URL
        this.saveSettings(); // photo is saved as part of innerHTML
      }
    };
    reader.readAsDataURL(file);
  });
}
```

> The photo is stored as a base64 `data:` URL within the resume HTML. This means the photo is persisted in localStorage as part of `s.content`.

---

## 15. Print / PDF Output

### 15.1 Print Button

```html
<button class="btn btn-print" onclick="window.print()">Print PDF</button>
```

### 15.2 Print CSS Rules

```css
@media print {
  body { padding: 0; background: white; }
  .controls { display: none; }
  .resume {
    box-shadow: none; margin: 0;
    width: 100%; padding: var(--page-padding);
  }
  .reorder-btns, .fmt-bar, .page-break-marker {
    display: none !important;
  }
  @page { margin: 0; }
}
```

### 15.3 Page Break Marker

Visual overlay showing where the A4 page boundary falls:

```css
.page-break-marker {
  position: absolute; left: 0; right: 0;
  border-top: 2px dashed #e74c3c;
  pointer-events: none; opacity: 0.5;
  z-index: 100; display: none;
}
```

Toggle: `togglePageBreak(chk)` sets `display: block/none` on `#page-break-line`.

Default top position: ~1122px (A4 height at 96 DPI minus padding).

---

## 16. Template Catalog

| Version | File | Layout | Unique Features |
|---------|------|--------|----------------|
| **v1.0** | `Classic_Minimal.html` | Single column | Most minimal, dark control panel |
| **v2.0** | `Clean_Layout.html` | Single + bottom grid | 3-column bottom grid for edu/skills/langs, light panel |
| **v3.0** | `Premium_Headshot.html` | Two-column sidebar | Left sidebar with headshot, main content area, sidebar section management |
| **v4.0** | `ATS_Executive.html` | Single column | ATS-optimized, metrics row in job blocks, item spacing control |
| **v5.0** | `Photo_Header.html` | Photo header + 2-col body | Circular photo in header, two-column body grid |
| **v6.0** | `Clean_Professional.html` | Single column | Centered header, horizontal dividers between sections |
| **v7.0** | `Elegant_TwoColumn.html` | Two-column grid | Grid layout (1.6fr 1fr), serif option emphasis |
| **v8.0** | `Bold_Engineer.html` | Photo + single column | Bold black section headers, photo integration, no section-title border |
| **v9.0** | `Academic.html` | Single column (education-first) | Serif typography, education before experience, categorized skills |

---

## 17. Known Gotchas & Critical Fixes

### 17.1 localStorage Overrides HTML Fixes

> **Problem**: `loadSettings()` replaces `#resume.innerHTML` with saved content. HTML structure changes to template files are invisible if the user has saved data.

**Solution**: The `attachReorderButtons()` method runs auto-wrapping logic BEFORE injecting buttons. It handles two cases:
1. **Merged sections** (`.section` containing both `.summary` and `.section-title`) → splits into two
2. **Orphaned summaries** (`.summary` directly under `#resume`, not in `.section`) → wraps in new `.section`

### 17.2 `.sk` Must Have `position: relative`

Without this, the `.sk-del` delete button will anchor to a parent container instead of the individual skill tag.

### 17.3 `.section` Must Have `position: relative`

Required for `.reorder-btns` (position: absolute) to be anchored correctly within each section.

### 17.4 Paste Handler

All templates strip formatting on paste:
```javascript
document.addEventListener("paste", (e) => {
  if (e.target.isContentEditable) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }
});
```

### 17.5 `contentEditable` on Buttons

All injected buttons (reorder-btns, sk-del) must have `contentEditable="false"` to prevent them from becoming editable when clicking inside the resume.

### 17.6 Version Mismatch Auto-Clear

If `_version` in saved data doesn't match the current code version, the saved data is automatically discarded. Update the version string when making breaking changes.

---

## 18. Rebuild Checklist

When rebuilding from scratch, follow this order:

### Phase 1: Foundation
- [ ] Create `index.html` hub page with card grid linking to all templates
- [ ] Define the shared CSS variable system (`:root` block)
- [ ] Implement the control panel layout (`.controls` aside)
- [ ] Build the stepper component (HTML + JS `stepper()` function)
- [ ] Build the format toolbar (`.fmt-bar` with `fmt()` / `restoreAndFmt()`)

### Phase 2: Core Engine
- [ ] Implement the `Customizer` class with:
  - [ ] `settingsMap` + `pxFields` configuration
  - [ ] `initListeners()` — bind inputs to CSS variables
  - [ ] `saveSettings()` — serialize controls + `#resume.innerHTML`
  - [ ] `loadSettings()` — restore from localStorage with version check
  - [ ] `resetSettings()` — clear + reload
  - [ ] `attachReorderButtons()` — with auto-wrap fix
  - [ ] `move()` / `addItem()` / `addSection()`
  - [ ] `applyScheme()` with all 20 presets
  - [ ] `initTextSizing()` + `applyStyleToSelection()` (magic color hack)
  - [ ] `addTag()` / `addSkill()` / `removeSkill()`
  - [ ] `flattenSpans()` — prevent span nesting

### Phase 3: Templates
- [ ] Build v1.0 (single column, minimal) as the reference template
- [ ] Build v2.0 (centered header + bottom grid)
- [ ] Build v3.0 (sidebar layout — most complex, needs `addSidebarSection()`)
- [ ] Build v4.0 (ATS single column with metrics row)
- [ ] Build v5.0 (photo header + two-column body, needs `initPhotoUpload()`)
- [ ] Build v6.0 (centered + horizontal dividers)
- [ ] Build v7.0 (CSS grid two-column)
- [ ] Build v8.0 (bold headers + photo, needs `initPhotoUpload()`)
- [ ] Build v9.0 (academic/serif, education-first order)

### Phase 4: Content
- [ ] Populate each template with actual resume content
- [ ] Ensure each template has: Summary, Professional Experience, Education, Skills, Languages, Training & Certifications
- [ ] Add skill tags with `.sk` / `.sk.hl` classes and delete buttons

### Phase 5: Polish
- [ ] Verify `@media print` hides all controls
- [ ] Test page break marker positioning
- [ ] Verify localStorage save/load/reset cycle
- [ ] Test color scheme presets
- [ ] Test section reorder (move up/down/add/delete)
- [ ] Test skill add/remove/highlight toggle
- [ ] Test text formatting (bold/italic/underline/size/color)
- [ ] Test paste handler (plain text only)
- [ ] Verify photo upload (v3.0, v5.0, v8.0)

---

> **Document Version**: 2026-02-27  
> **System Version**: `2026-02-27e`  
> **Templates**: 9 (v1.0 through v9.0)
