# Resume Builder v2.0 Template Specification

## Overview
**Name:** Resume Builder v2.0 (Clean Layout)
**Format:** A4 (210mm x 297mm)
**Layout:** Linear Header -> Summary -> Stacked Sections -> 3-Column Bottom Grid
**Style:** Modern Clean / Corporate

## 1. Global Typography
*   **Font Family:** Adjustable (Inter, Roboto, Open Sans, Merriweather)
*   **Base Font Size:** Adjustable | *Default:* `11px`
*   **Line Height:** Fixed at `1.35`

## 2. Header & Summary
*   **Alignment:** Centered
*   **Header:** Two-tier (Name then Role/Title). Contact info layout is stacked/responsive.
*   **Summary Box:** Full-width light background (`--summary-bg`) with left accent border (`2.5px`).

## 3. Experience Section
*   **Section Titles:** Uppercase, letter-spacing `1.8px`, thick border-bottom (`1.5px` solid header color).
*   **Job Blocks:** 
    *   Flex-row header (Company & Dates).
    *   Subtitle line for Role/Location.
    *   Bulleted achievements.
*   **Tags:** Inline skill tags (`.tag.c`) with accent background.

## 4. Bottom Grid (3-Column)
*   **Layout:** Education, Skills, and "Details" in a responsive three-column grid.
*   **Skill Pills:** Light background with secondary highlight (`hl`) support.

## 5. Customization
*   **Color Presets:** Professional and muted sets (Coastal, Spring, Winter, Slate, etc.).
*   **Spacing Tools:** 
    *   `Page Padding`: Adjustable (4px increments).
    *   `Section Spacing`: Adjustable (2px increments).
*   **Controls:** Integrated white-themed control panel (300px fixed).

## 6. Features
*   **Reordering:** Section-level reordering and "Add Job/Section" logic.
*   **Persistence:** `localStorage` (Key: `resume_builder_v2_settings`).
*   **Drafting Tools:** Bold/Italic/Underline and individual selection sizing.
