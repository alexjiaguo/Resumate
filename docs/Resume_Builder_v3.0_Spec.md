# Resume Builder v3.0 Template Specification

## Overview
**Name:** Resume Builder v3.0 (Sidebar Layout)
**Format:** A4 (210mm x 297mm)
**Layout:** CSS Grid (218px sidebar + flexible main content)
**Style:** Modern Professional (Dark Sidebar, Light Content)

## 1. Global Typography
*   **Font Family:** Adjustable
    *   *Default:* `'Inter', sans-serif`
    *   *Options:* Roboto, Open Sans, Merriweather (Serif), Playfair Display, Inconsolata (Mono)
*   **Base Font Size:** Adjustable (8px - 12px) | *Default:* `9px`
*   **Line Height:** Adjustable (1.0 - 2.0) | *Default:* `1.28`

## 2. Sidebar (Left Column)
*   **Width:** 218px (Fixed)
*   **Background:** Adjustable | *Default:* `#16213e` (Dark Navy)
*   **Text Color:** Adjustable | *Default:* `#d0d0dc` (Light Grey)
*   **Accent Color:** Adjustable | *Default:* `#7ec8e3` (Sky Blue)
    *   *Usage:* Subtitles, icons, dates, skill highlights

### Components
*   **Headshot:**
    *   *Shape:* Circular
    *   *Size:* Adjustable (40px - 150px) | *Default:* `80px`
    *   *Border:* 2px solid `rgba(255,255,255,0.2)`
*   **Name:**
    *   *Size:* Adjustable (14px - 32px) | *Default:* `19px`
    *   *Weight:* Bold (700)
    *   *Color:* White (`#fff`)
*   **Subtitle (Role):**
    *   *Size:* `9px`
    *   *Weight:* Semi-bold (600)
    *   *Color:* Accent (`#7ec8e3`)
    *   *Spacing:* 2px top, 16px bottom
*   **Section Headers:**
    *   *Size:* `8px`
    *   *Style:* Uppercase, Letter-spacing `1.8px`
    *   *Border:* Bottom (`1px solid rgba(126,200,227,0.2)`)
    *   *Weight:* Bold (700)
*   **Contact Info:**
    *   *Size:* `9.2px`
    *   *Layout:* Flex with icon (`10px` size)
*   **Education Block:**
    *   *Dates:* `8px` (Accent Color, Bold)
    *   *Degree:* `9.5px` (White, Bold)
    *   *School:* `8.5px` (Grey `#a0a0b4`)
*   **Skills:**
    *   *Style:* Tag/Pill
    *   *Font:* `8px`
    *   *Background:* `rgba(126,200,227,0.1)` (Light Blue tint)
    *   *Highlight:* `rgba(126,200,227,0.2)` (Stronger tint, White text)
*   **Languages:**
    *   *Size:* `9px`
    *   *Style:* `Label: Value` (Label is White, Value is Grey)

## 3. Main Content (Right Column)
*   **Width:** Flexible (Remaining space)
*   **Padding:** `20px 24px 14px 22px`
*   **Background:** Adjustable | *Default:* `#ffffff` (White)
*   **Text Color:** `#1a1a2e` (Dark Blue/Black)
*   **Header Color:** Adjustable | *Default:* `#16213e` (Matches Sidebar)
*   **Accent Color:** Adjustable | *Default:* `#0f7b6c` (Teal)
    *   *Usage:* Dates, Tags, Highlighted text

### Components
*   **Summary Box:**
    *   *Background:* `#f5f6fa` (Very Light Grey)
    *   *Border:* Left `2.5px` solid Header Color
    *   *Padding:* `6px 9px`
    *   *Font:* Base Size
*   **Section Titles:**
    *   *Size:* Adjustable (8px - 16px) | *Default:* `9px`
    *   *Weight:* Bold (700)
    *   *Style:* Uppercase, Letter-spacing `1.8px`
    *   *Border:* Bottom `1.5px` solid Header Color
    *   *Margin Bottom:* `6px`
*   **Job Entries:**
    *   **Company:**
        *   *Size:* Adjustable (9px - 18px) | *Default:* `11px`
        *   *Weight:* Bold (700)
        *   *Color:* Header Color (`#16213e`)
    *   **Dates:**
        *   *Size:* `8.5px`
        *   *Weight:* Semi-bold (600)
        *   *Color:* Accent Color (`#0f7b6c`)
    *   **Role:**
        *   *Size:* `9.2px`
        *   *Style:* Italic
        *   *Color:* `#555`
    *   **Bullets (List):**
        *   *Size:* Base Size (`9px`)
        *   *Line Height:* `1.38`
        *   *Padding Left:* `13px`
*   **Tags:**
    *   *Size:* `7px`
    *   *Style:* Uppercase pill, `0.5px 4px` padding
    *   *Colors:* Teal (`#0f7b6c`), Brown (`#8b5e3c`), Purple (`#5c3d8f`)
    *   *Text:* White (`#fff`)

## 4. Spacing & Structure
*   **Section Spacing:** Adjustable (5px - 40px) | *Default:* `11px`
*   **Item Spacing:** Adjustable (2px - 20px) | *Default:* `6px` (Between jobs)
*   **Structure:**
    *   New sections can be added to **Sidebar** or **Main**.
    *   **Main Section Types:** Job Block, Simple Text, Bullet List.
    *   **Sidebar Section Types:** Contact Item, List, Text.
*   **Printing:**
    *   *Markers:* Toggleable dashed red line for Page Break.
    *   *Media Query:* Removes controls, shadows, and margins for print/PDF.

## 5. Text Formatting (Rich Text)
*   **Toolbar:** Bold, Italic, Underline, Remove Format.
*   **Colors:** Text Color, Highlight Color (Background).
*   **Selection Size:** Adjustable (6px - 32px) for specific selected text.
