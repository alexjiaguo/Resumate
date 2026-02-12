# Unified Resume Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Consolidate 3 resume builders into a cohesive suite with shared settings and "Apply to All" functionality via LocalStorage.

**Architecture:**
- **Central Hub:** `index.html` acts as a dashboard to launch individual templates.
- **Shared State:** `localStorage` is used to persist user preferences (colors, fonts, spacing) across all templates.
- **Standardized Features:** All templates will support the superset of features: body size, line spacing, header size, page break indicators, and selected text resizing.
- **Enhanced Template 3:** Adds headshot support and editable sidebar.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, LocalStorage API.

---

## Phase 1: Foundation & Shared Logic

### Task 1: Create Shared Script & Index
Create a shared JavaScript file to handle `localStorage` synchronization and the "Apply to All" logic. Create the landing page.

**Files:**
- Create: `shared.js`
- Create: `index.html`

**Step 1: Create `shared.js`**
- Implement `saveSettings()`: Reads all input values and saves to `localStorage`.
- Implement `loadSettings()`: Reads from `localStorage` and updates inputs/CSS variables.
- Add event listener for `storage` event to sync across open tabs in real-time.

```javascript
const STORAGE_KEY = 'resume_builder_settings';

// Map of input IDs to CSS variables
const SETTINGS_MAP = {
    'inp-font': '--base-font-size',
    'inp-lh': '--line-height',
    'inp-hsize': '--header-font-size', // New standard
    'inp-header-color': '--header-color',
    'inp-accent-color': '--accent-color',
    'inp-bg-color': '--bg-color',
    'inp-text-color': '--text-color',
    'inp-sidebar-bg': '--sidebar-bg'
};

function saveToLocalStorage() {
    const settings = {};
    Object.keys(SETTINGS_MAP).forEach(id => {
        const el = document.getElementById(id);
        if (el) settings[id] = el.value;
    });
    // Add any template-specific but shared settings here
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert('Settings saved! Open other templates to see changes.');
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const settings = JSON.parse(saved);
    Object.keys(settings).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = settings[id];
            // Trigger input event to update CSS
            el.dispatchEvent(new Event('input'));
        }
    });
}
```

**Step 2: Create `index.html`**
- Simple dashboard linking to `Resume_Builder_v1.0.html`, `v2.0.html`, `v3.0.html`.
- Styled nicely with cards for each template.

---

## Phase 2: Feature Standardization (Iterative per Template)

### Task 2: Standardize Template 1 (v1.0)
Update Template 1 to support all features and shared logic.

**Files:**
- Modify: `Resume_Builder_v1.0.html`

**Step 1: Add Missing Controls**
- Add "Header Size" slider (`#inp-hsize`).
- Add "Apply to All" button calling `saveToLocalStorage()`.
- Add "Load Settings" button calling `loadFromLocalStorage()` (or auto-load).
- Add "Selected Text Size" control.

**Step 2: Implement Logic**
- Link shared `shared.js` (inline or external).
- Update CSS variables to match standard naming (`--header-font-size`, etc.).
- Add "Page Break Indicator" logic (visual marker).

**Step 3: Add Selected Text Resizing**
- Implement `changeSelectedFontSize(delta)` function.

### Task 3: Standardize Template 2 (v2.0)
Update Template 2 to support all features and shared logic.

**Files:**
- Modify: `Resume_Builder_v2.0.html`

**Step 1: Add Missing Controls**
- Add "Header Size" slider.
- Add "Apply to All" button.

**Step 2: Implement Logic**
- Link `shared.js`.
- Ensure variable names match.
- Verify Page Break Indicator exists/works.

### Task 4: Upgrade Template 3 (v3.0)
Major upgrade for Template 3 (Sidebar Layout).

**Files:**
- Modify: `Resume_Builder_v3.0.html`

**Step 1: Enable Editable Sidebar**
- Ensure `#sidebar-container` has `contenteditable="true"`.
- Verify individual sections are editable.

**Step 2: Add Headshot**
- Add `<img class="headshot">` to sidebar.
- Add file input control to upload/change headshot.
- Add CSS for headshot styling (circle/square toggle?).

**Step 3: Standardize Controls**
- Add "Header Size", "Body Size", "Line Height", "Page Break".
- Add "Apply to All".
- Link `shared.js`.

---

## Phase 3: Verification & Polish

### Task 5: Integration Testing
Verify synchronization and feature parity.

**Step 1: Test "Apply to All"**
- Open Index -> Template 1.
- Change Body Size to 14px. Click "Apply to All".
- Open Template 2. Verify Body Size is 14px.

**Step 2: Verify New Features**
- Check Header Size control on all 3.
- Check Page Break indicator on all 3.
- Check Text Size adjustment on selection.
- Check Headshot on Template 3.

**Step 3: Final Cleanup**
- Ensure all CSS variables use a consistent naming convention across files (e.g., `--base-font-size`, `--header-color`).
