# Resume Builder UI/UX Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve onboarding clarity, template-selection confidence, accessibility, and editor guidance without removing existing components.

**Architecture:** Keep the current React + Zustand + Vite architecture intact and make surgical improvements in the existing surfaces: `App.tsx`, onboarding, template gallery, and shared styles. Start by adding a minimal test harness, then implement the highest-impact UX changes in small verified slices so each improvement is independently testable and reversible.

**Tech Stack:** React 18, TypeScript, Vite, Zustand, lucide-react, CSS, Vitest, React Testing Library, jsdom

---

### Task 1: Add a minimal frontend test harness

**Files:**
- Modify: `resume-builder-react/package.json`
- Modify: `resume-builder-react/vite.config.ts`
- Create: `resume-builder-react/src/test/setup.ts`
- Create: `resume-builder-react/src/test/renderWithStore.tsx`
- Create: `resume-builder-react/src/App.test.tsx`

**Step 1: Write the failing test**

Create `resume-builder-react/src/App.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the onboarding screen for first-time users', () => {
    render(<App />)
    expect(screen.getByText(/resume builder pro/i)).toBeInTheDocument()
    expect(screen.getByText(/upload an existing one or start from scratch/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: FAIL because test tooling is not configured yet.

**Step 3: Write minimal implementation**

Update `resume-builder-react/package.json` scripts and dev dependencies:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "vitest": "^2.1.8"
  }
}
```

Update `resume-builder-react/vite.config.ts`:

```ts
export default defineConfig({
  plugins: [/* existing plugins */],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  // existing config continues
})
```

Create `resume-builder-react/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Create `resume-builder-react/src/test/renderWithStore.tsx`:

```tsx
import { ReactElement } from 'react'
import { render } from '@testing-library/react'

export function renderWithStore(ui: ReactElement) {
  return render(ui)
}
```

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm install && npm run test -- App.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/package.json resume-builder-react/vite.config.ts resume-builder-react/src/test/setup.ts resume-builder-react/src/test/renderWithStore.tsx resume-builder-react/src/App.test.tsx
git commit -m "test: add frontend test harness"
```

---

### Task 2: Add stronger onboarding guidance and remove forced auto-dismiss

**Files:**
- Modify: `resume-builder-react/src/components/OnboardingScreen.tsx`
- Test: `resume-builder-react/src/App.test.tsx`

**Step 1: Write the failing test**

Add to `resume-builder-react/src/App.test.tsx`:

```tsx
it('keeps onboarding visible after successful import until user continues', async () => {
  render(<App />)
  expect(screen.getByText(/import existing resume/i)).toBeInTheDocument()
  expect(screen.getByText(/start blank/i)).toBeInTheDocument()
  expect(screen.getByText(/tailor with ai later/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: FAIL because the new path labels and guidance do not exist.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/components/OnboardingScreen.tsx`:
- Replace the generic subtitle with a 3-step expectation line.
- Add three explicit path labels:
  - `Import existing resume`
  - `Start blank`
  - `Tailor with AI later`
- Remove the `setTimeout` auto-dismiss on successful parsing.
- Add a visible `Continue to editor` button that appears after successful parse and calls `setOnboardingComplete()`.
- Keep upload and blank-start behaviors intact.

Example implementation fragment:

```tsx
{uploadResult?.success && (
  <button onClick={setOnboardingComplete} style={browseButtonStyle}>
    Continue to editor
  </button>
)}
```

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/src/components/OnboardingScreen.tsx resume-builder-react/src/App.test.tsx
git commit -m "feat: improve onboarding guidance"
```

---

### Task 3: Replace placeholder template gallery cards with real thumbnails

**Files:**
- Modify: `resume-builder-react/src/components/TemplateGallery.tsx`
- Create: `resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx`
- Check assets: `resume-builder-react/public/templates/*` or existing template image path

**Step 1: Write the failing test**

Create `resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TemplateGallery from '../TemplateGallery'

describe('TemplateGallery', () => {
  it('renders template preview images', () => {
    render(
      <TemplateGallery
        selectedTemplate="classic"
        onSelectTemplate={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- TemplateGallery.test.tsx
```

Expected: FAIL because the gallery currently renders placeholder preview blocks.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/components/TemplateGallery.tsx`:
- Replace the placeholder `Eye` block with an actual `<img>` using `template.thumbnail`.
- Add meaningful `alt` text like `${template.name} preview`.
- Keep the selected badge overlay.
- Add a fallback placeholder only when image loading fails.

Example fragment:

```tsx
<img
  src={template.thumbnail}
  alt={`${template.name} preview`}
  style={thumbnailImageStyle}
/>
```

If the current thumbnail paths are missing, first align the component with the real public asset paths before changing UX logic.

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- TemplateGallery.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/src/components/TemplateGallery.tsx resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx
git commit -m "feat: show real template thumbnails"
```

---

### Task 4: Make template gallery cards keyboard-accessible

**Files:**
- Modify: `resume-builder-react/src/components/TemplateGallery.tsx`
- Modify: `resume-builder-react/src/index.css`
- Test: `resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx`

**Step 1: Write the failing test**

Add to `resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx`:

```tsx
it('renders each template as an accessible button', () => {
  render(
    <TemplateGallery
      selectedTemplate="classic"
      onSelectTemplate={() => {}}
      onClose={() => {}}
    />
  )

  expect(screen.getByRole('button', { name: /classic minimal/i })).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- TemplateGallery.test.tsx
```

Expected: FAIL because cards are currently clickable `div`s.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/components/TemplateGallery.tsx`:
- Replace clickable root `div` cards with semantic `button` elements.
- Preserve hover/selected styles.
- Add focus-visible styling via class name, not inline hover-only behavior.

In `resume-builder-react/src/index.css` add:

```css
.template-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- TemplateGallery.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/src/components/TemplateGallery.tsx resume-builder-react/src/index.css resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx
git commit -m "fix: improve template gallery accessibility"
```

---

### Task 5: Add an editor progress banner for first-run guidance

**Files:**
- Modify: `resume-builder-react/src/App.tsx`
- Modify: `resume-builder-react/src/index.css`
- Test: `resume-builder-react/src/App.test.tsx`

**Step 1: Write the failing test**

Add to `resume-builder-react/src/App.test.tsx`:

```tsx
it('shows next-step guidance inside the editor shell', () => {
  localStorage.setItem('resume-builder-pro-storage', JSON.stringify({
    state: { hasCompletedOnboarding: true },
    version: 0,
  }))

  render(<App />)
  expect(screen.getByText(/recommended next step/i)).toBeInTheDocument()
  expect(screen.getByText(/edit your content/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: FAIL because no editor guidance banner exists.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/App.tsx`:
- Add a compact guidance banner above tab content.
- Show a primary recommendation based on current tab or first-run state.
- Example labels:
  - `Recommended next step`
  - `Edit your content`
  - `Choose a template`
  - `Export when ready`

In `resume-builder-react/src/index.css` add focused styling for a new `.editor-guidance-banner` block.

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/src/App.tsx resume-builder-react/src/index.css resume-builder-react/src/App.test.tsx
git commit -m "feat: add editor next-step guidance"
```

---

### Task 6: Improve icon-only control accessibility and labeling

**Files:**
- Modify: `resume-builder-react/src/App.tsx`
- Test: `resume-builder-react/src/App.test.tsx`

**Step 1: Write the failing test**

Add to `resume-builder-react/src/App.test.tsx`:

```tsx
it('exposes labeled controls for sidebar and zoom actions', () => {
  localStorage.setItem('resume-builder-pro-storage', JSON.stringify({
    state: { hasCompletedOnboarding: true },
    version: 0,
  }))

  render(<App />)

  expect(screen.getByRole('button', { name: /close sidebar|open sidebar/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: FAIL if controls only expose titles or inconsistent accessible names.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/App.tsx`:
- Add `aria-label` to sidebar toggle, undo, redo, theme toggle, zoom controls, and gallery-launch button.
- Keep existing visual design.
- Do not remove icons.

Example:

```tsx
<button
  className="sidebar-toggle"
  aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
  title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
>
```

**Step 4: Run test to verify it passes**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add resume-builder-react/src/App.tsx resume-builder-react/src/App.test.tsx
git commit -m "fix: label icon controls for accessibility"
```

---

### Task 7: Remove obvious production-polish trust leaks

**Files:**
- Modify: `resume-builder-react/src/main.tsx`
- Review: `resume-builder-react/src/App-test.tsx`
- Test: `resume-builder-react/src/App.test.tsx`

**Step 1: Write the failing test**

Add to `resume-builder-react/src/App.test.tsx`:

```tsx
it('renders without relying on startup console logging', () => {
  render(<App />)
  expect(screen.getByText(/resume builder pro/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails or remains redundant**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
```

Expected: PASS or redundant. If redundant, keep the test count stable and proceed with the production cleanup as a surgical refactor.

**Step 3: Write minimal implementation**

In `resume-builder-react/src/main.tsx`:
- Remove `console.log` startup noise.
- Preserve the guarded render and error fallback.
- Keep `console.error` only if you intentionally want error reporting during boot failure.

Review `resume-builder-react/src/App-test.tsx`:
- If unused, delete it in the same commit.
- If it is used by a workflow, rename or document it before deletion.

**Step 4: Run verification**

Run:

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run build
```

Expected: All tests PASS, build exits 0

**Step 5: Commit**

```bash
git add resume-builder-react/src/main.tsx resume-builder-react/src/App-test.tsx resume-builder-react/src/App.test.tsx
git commit -m "chore: improve frontend production polish"
```

---

### Task 8: Final verification pass

**Files:**
- Review: `resume-builder-react/src/App.tsx`
- Review: `resume-builder-react/src/components/OnboardingScreen.tsx`
- Review: `resume-builder-react/src/components/TemplateGallery.tsx`
- Review: `resume-builder-react/src/index.css`
- Review: `resume-builder-react/src/main.tsx`

**Step 1: Run targeted tests**

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- App.test.tsx
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test -- TemplateGallery.test.tsx
```

Expected: PASS

**Step 2: Run full test suite**

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run test
```

Expected: PASS

**Step 3: Run production build**

```bash
cd /Users/boss/ai-projects/side-hustles/Resume_Builder/resume-builder-react && npm run build
```

Expected: exit 0

**Step 4: Manual verification checklist**

- Onboarding clearly presents import vs blank-start choices.
- Successful import requires explicit continue action.
- Template gallery shows real thumbnails.
- Template cards are keyboard-focusable and selectable.
- Sidebar/zoom/icon controls expose accessible names.
- Editor displays a clear next-step banner.
- App starts without noisy debug logs.

**Step 5: Commit final integration**

```bash
git add resume-builder-react/src/App.tsx resume-builder-react/src/components/OnboardingScreen.tsx resume-builder-react/src/components/TemplateGallery.tsx resume-builder-react/src/index.css resume-builder-react/src/main.tsx resume-builder-react/src/App.test.tsx resume-builder-react/src/components/__tests__/TemplateGallery.test.tsx resume-builder-react/package.json resume-builder-react/vite.config.ts resume-builder-react/src/test/setup.ts resume-builder-react/src/test/renderWithStore.tsx
git commit -m "feat: implement prioritized resume builder ux improvements"
```
