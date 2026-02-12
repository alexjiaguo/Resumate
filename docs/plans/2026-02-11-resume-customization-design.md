# Resume Customization Design Document

## 1. Overview
The goal is to enhance the Resume Builder with advanced customization features: Typography selection, Section Reordering, and detailed Spacing controls. We will refactor the existing shared logic into a modular `Customizer` class to support these features maintainably across all templates.

## 2. Architecture: `Customizer` Class
We will refactor `shared.js` to export a `Customizer` class (or global object if modules aren't used) that handles:
-   **State Management**: Stores current settings (fonts, spacing, order) in `localStorage`.
-   **UI Generation**: Dynamically generates control panels (sliders, dropdowns) to reduce HTML duplication.
-   **Event Listeners**: Centralizes input handling and updates CSS variables live.
-   **DOM Manipulation**: Handles section reordering (moving DOM nodes).

### Key Methods
-   `init(config)`: Sets up the customizer with template-specific config (e.g., which sections are reorderable).
-   `loadSettings()`: Hydrates state from storage.
-   `updateStyle(key, value)`: Updates CSS variables.
-   `moveSection(sectionId, direction)`: Swaps section with sibling.

## 3. Features

### 3.1 Typography
-   **UI**: A `<select>` dropdown in the "Typography" section.
-   **Options**:
    -   Roboto (Sans-serif, default)
    -   Open Sans (Sans-serif, neutral)
    -   Merriweather (Serif, formal)
    -   Playfair Display (Serif, elegant headers)
    -   Inconsolata (Monospace, tech/code)
-   **Implementation**:
    -   Load Google Fonts URL dynamically or include all in CSS import.
    -   Update `--font-family` CSS variable.

### 3.2 Spacing Controls
-   **UI**: Three new sliders in "Layout" section.
    -   **Section Spacing**: Controls `margin-bottom` of `.section`.
    -   **Item Spacing**: Controls spacing between jobs/items.
    -   **Content Padding**: Controls internal padding of the page/container.
-   **Implementation**: Map sliders to new CSS variables (`--section-spacing`, `--item-spacing`, `--page-padding`).

### 3.3 Section Reordering
-   **UI**: Hovering over a `.section` or `.section-title` reveals "▲" and "▼" buttons (subtle, non-printing).
-   **Implementation**:
    -   `Customizer` attaches click listeners to these buttons.
    -   `moveSection(el, -1)`: `parentNode.insertBefore(el, el.previousElementSibling)`
    -   `moveSection(el, 1)`: `parentNode.insertBefore(el.nextElementSibling, el)` (effectively)

## 4. Implementation Plan
1.  **Refactor**: Create `Customizer` in `shared.js`.
2.  **Migrate**: Update `Resume_Builder_v1.0.html` to use `Customizer`. Verify parity.
3.  **Enhance**: Add Typography, Spacing, and Reordering to `Customizer` and v1.0.
4.  **Propagate**: Update v2.0 and v3.0 to use the new system.

## 5. CSS Variables Schema
```css
:root {
    --font-family: 'Roboto', sans-serif;
    --section-spacing: 20px;
    --item-spacing: 10px;
    --page-padding: 40px;
    /* ... existing vars ... */
}
```
