# Resume Builder v1.0 Template Specification

## Overview
**Name:** Resume Builder v1.0 (Professional Layout)
**Format:** A4 (210mm x 297mm)
**Layout:** Single Column / Centered Header
**Style:** Classic Minimalist

## 1. Global Typography
*   **Font Family:** Adjustable (Inter, Roboto, Open Sans, Merriweather, Playfair Display)
*   **Base Font Size:** Adjustable (8px - 14px) | *Default:* `11px`
*   **Line Height:** Fixed at `1.4`

## 2. Header
*   **Alignment:** Center
*   **Components:**
    *   **Name:** Uppercase, letter-spacing `2px`, adjustable size (`--header-font-size`).
    *   **Contact Info:** Horizontal list with separators (`·`).

## 3. Sections
*   **Section Titles:** Uppercase, letter-spacing `1px`, border-bottom `1px solid #eee`.
*   **Job Entries:**
    *   `job-header`: Flex-row with Company Name and Dates.
    *   `job-title`: Italic.
    *   `job-list`: Bullets with `1.4` line-height.
*   **Skills:** Simple boxed spans with "Highlight" (`hl`) class support.

## 4. Customization
*   **Color Presets:** Coastal Morning, Soft Spring, Winter Chill, Slate & Cream, Ocean Professional, Noir & Taupe, Elegant Teal, Sand & Gold, Industrial Blue.
*   **Spacing:** Adjustable page padding (increments of 2px).
*   **Controls:** Floating sidebar (300px width) with interactive customizer.

## 5. Features
*   **Reordering:** Section-level "Up/Down" move buttons and "Add Item" capability.
*   **Persistence:** `localStorage` (Key: `resume_builder_v1_settings`).
*   **Page Break:** Toggleable marker for A4 height.
