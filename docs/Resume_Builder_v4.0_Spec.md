# Resume Builder v4.0 — "Executive PM" Specification

## Overview
ATS-first single-column layout optimized for **Software Product Managers**. Prioritizes machine readability, keyword density, and clean print-to-PDF output. Full feature parity with v3.0 engine.

## Design Philosophy
- **ATS-First**: No tables, no graphics, no columns — pure semantic HTML
- **Left-aligned header**: Better for ATS parsing than centered
- **Impact quantification**: Built-in Key Metrics row per job entry
- **Skills readability**: 2-column grid with category labels

## Layout Structure (top → bottom)
1. **Header** — Name, subtitle role, contact line (left-aligned, border-bottom)
2. **Professional Summary** — Concise paragraph
3. **Professional Experience** — Jobs with metrics row + tech stack pills
4. **Key Projects** — Optional project highlights
5. **Skills** — 2-column grid: Product, Technical, Tools, Leadership
6. **Education** — Degree + University + Year
7. **Certifications** — Single-line list

## Unique v4 Features
| Feature | Detail |
|---------|--------|
| **Key Metrics Row** | `.metrics-row` — accent-bordered highlight with bold numbers |
| **Tech Stack Pills** | `.tech-pill` — compact skill pills per job entry |
| **Divider Color Control** | 4th color field for section dividers |
| **Skills Grid** | 2-column categorized layout |

## CSS Variables
| Variable | Default | Control ID |
|----------|---------|-----------|
| `--header-color` | `#1a1a2e` | `inp-header-color` |
| `--accent-color` | `#0066cc` | `inp-accent-color` |
| `--resume-bg` | `#ffffff` | `inp-bg-color` |
| `--divider-color` | `#d0d5dd` | `inp-divider-color` |
| `--base-font-size` | `11px` | `inp-font` |
| `--header-font-size` | `22px` | `inp-hsize` |
| `--section-title-size` | `11px` | `inp-section-title-size` |
| `--company-font-size` | `11px` | `inp-company-size` |
| `--line-height` | `1.4` | `inp-line-height` |
| `--page-padding` | `36px` | `inp-page-padding` |
| `--section-spacing` | `12px` | `inp-section-spacing` |
| `--item-spacing` | `6px` | `inp-item-spacing` |
| `--font-family` | `'Inter'` | `inp-font-family` |

## JavaScript Engine
Shares full v3-quality engine:
- Precision `stepper()` with `toFixed()`
- `flattenSpans()` anti-nesting cleanup
- `mousedown`/`mouseup` text-sizing guards
- `fmt()` auto-save + `restoreAndFmt()` range re-capture
- 21 color schemes (grouped: Professional, Classic, Vibrant) with 4-field adaptation
- Tag insertion, section reorder (up+down), add item
- localStorage persistence with content snapshot

## Color Schemes
21 presets across 3 groups, each setting 4 fields (header, accent, bg, divider).

## Storage Key
`resume_builder_v4_settings`
