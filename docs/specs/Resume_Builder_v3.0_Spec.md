# Resume Builder v3.0 Template Specification

## Overview
**Name:** Resume Builder v3.0 (Sidebar Layout)
**Format:** A4 (210mm x 297mm)
**Layout:** CSS Grid (Adjustable sidebar width + flexible main content)
**Style:** Modern Professional (Dynamic Themes, High Contrast Sidebar)

## 1. Global Typography
*   **Font Family:** Adjustable
    *   *Default:* `'Inter', sans-serif`
    *   *Options:* Roboto, Open Sans, Merriweather (Serif), Playfair Display, Inconsolata (Mono)
*   **Base Font Size:** Adjustable (8px - 14px) | *Default:* `11px`
*   **Line Height:** 
    *   **Sidebar Detail:** Adjustable (0.1 increments) | *Default:* `1.4`
    *   **Body Text:** Adjustable (0.1 increments) | *Default:* `1.4`

## 2. Sidebar (Left Column)
*   **Width:** Adjustable (180px - 300px) | *Default:* `218px`
*   **Background:** Adjustable | *Presets available*
*   **Text Color:** Adjustable | *Default:* `#d0d0dc`
*   **Accent Color:** Adjustable | *Presets available*
    *   *Usage:* Subtitles, icons, dates, skill highlights

### Components
*   **Headshot:**
    *   *Shape:* Circular
    *   *Size:* Adjustable (40px - 150px) | *Default:* `80px`
    *   *Border:* 2px solid `rgba(255,255,255,0.2)`
*   **Name:**
    *   *Size:* Adjustable (14px - 48px) | *Default:* `24px`
    *   *Weight:* Bold (700)
    *   *Alignment:* Center
*   **Subtitle (Role):**
    *   *Size:* Adjustable | *Default:* `11px`
    *   *Weight:* Semi-bold (600)
    *   *Color:* Sidebar Accent
    *   *Alignment:* Center
*   **Section Headers:**
    *   *Size:* Adjustable | *Default:* `11px`
    *   *Style:* Uppercase, Letter-spacing `1.8px`
    *   *Border:* Bottom (`1px solid rgba(126,200,227,0.2)`)
*   **Contact Info:**
    *   *Layout:* Flex with icon icons
*   **Education Block:**
    *   *Fields:* Dates, Degree, School
*   **Skills:**
    *   *Style:* Tag/Pill with highlight support

## 3. Main Content (Right Column)
*   **Width:** Flexible (Remaining space)
*   **Padding:** Independently Adjustable (Top/Bottom/Left/Right)
*   **Sidebar Gap:** Adjustable Gutter (`--content-gap`)
*   **Background:** Adjustable | *Default:* `#ffffff` (White)

### Components
*   **Summary Box:**
    *   *Style:* Professional box with left accent border
*   **Section Titles:**
    *   *Size:* Adjustable | *Default:* `12px`
    *   *Weight:* Bold (700)
    *   *Style:* Uppercase, Letter-spacing `1.8px`
    *   *Border:* Bottom `1.5px` solid Header Color
*   **Job Entries:**
    *   **Header:** Flex-row with Company Name (Bold) and Dates (Accent color)
    *   **Details:** Role/Title (Italic) + Location
    *   **Achievements:** Bulleted list
*   **Tags:**
    *   *Feature:* `+ Add Tag` button inserts editable tags at cursor.

## 4. Color Presets (16+ Themes)
Includes professional and vibrant palettes:
- **Professional:** Stone Path, Urban Loft, Harbor Haze, Gothic Noir, etc.
- **Vibrant:** Ocean Tide, Peach Skyline, Tropical Rainforest, Summer Breeze, etc.

## 5. Spacing & Structure
*   **Section Spacing:** Adjustable (Main & Sidebar)
*   **Item Spacing:** Adjustable (Between individual entries)
*   **Reordering:** Drag-less interactive "Up/Down" controls on every block.
*   **Page Control:** Toggleable red dashed line for A4 Page Break visibility.

## 6. Text Formatting & Selection
*   **Rich Text:** Optimized Bold/Italic/Underline tool.
*   **Color Tools:** Fore Color and Highlight (Back Color).
*   **Precision Sizing:** Adjust font size of *only selected text* via stepper.
*   **Span Management:** Automatic flattening of nested styles to maintain clean HTML.
