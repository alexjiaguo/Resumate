# Unified Resume Builder - Test Report

## Overview
This document outlines the manual validation steps for the Unified Resume Builder suite. The goal is to ensure all 3 templates share settings correctly and individual features work as expected.

## 1. Setup Verification
- [ ] **Files Present**: Ensure `index.html`, `shared.js`, and all 3 `Resume_Builder_vX.0.html` files are in the same directory.
- [ ] **Launch**: Open `index.html` in a web browser (Chrome/Edge/Safari).

## 2. Shared Settings ("Apply to All")
**Goal**: Verify changes in one template persist to others.

1.  **Header Color Sync**
    *   Open **Template 1**. Change **Header Color** to Red.
    *   Click **"Apply to All & Save"**.
    *   Go back to `index.html` and open **Template 2**.
    *   **Pass**: Template 2 Header should be Red.
2.  **Typography Sync**
    *   In **Template 2**, change **Base Font Size** to `12px` (or `1.2` depending on range).
    *   Click **"Apply to All & Save"**.
    *   Open **Template 3**.
    *   **Pass**: Template 3 body text should be `12px`.
3.  **Complex Mapping (V3)**
    *   In **Template 3**, change **Paper Background** to Light Yellow.
    *   Click **"Apply to All"**.
    *   Open **Template 1**.
    *   **Pass**: Template 1 **Background** (Wall) should be Light Yellow.
    *   *Note: v3 maps this input to Paper, while v1/v2 map it to Wall. This is expected behavior for shared controls.*

## 3. Feature Parity Check

| Feature | Template 1 (v1.0) | Template 2 (v2.0) | Template 3 (v3.0) |
| :--- | :--- | :--- | :--- |
| **Header Size Slider** | [ ] Works | [ ] Works | [ ] Works |
| **Body Size Slider** | [ ] Works | [ ] Works | [ ] Works |
| **Line Height Slider** | [ ] Works | [ ] Works | [ ] Works |
| **Page Break Marker** | [ ] Visible (dashed line) | [ ] Toggleable | [ ] Toggleable |
| **Selected Text Resize** | [ ] A+/A- Buttons work | [ ] A+/A- Buttons work | [ ] A+/A- Buttons work |

## 4. Template 3 Specifics (Sidebar)
- [ ] **Headshot**: Upload an image. Verify it appears in the circle.
- [ ] **Sidebar Edit**: Click text in the sidebar (Contact, Skills). Verify it is editable.
- [ ] **Sidebar Color**: Change Sidebar Background. Verify it updates locally.

## 5. Known Issues / Limitations
- **Printing**: Background colors might not print unless "Background graphics" is enabled in the Print dialog.
- **Selection**: "Selected Text Size" requires a clean selection (don't select across multiple blocks).
