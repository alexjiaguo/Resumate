/**
 * Resume Builder Customizer
 * Centralizes settings management, UI generation, and event handling.
 */
class Customizer {
    constructor() {
        this.STORAGE_KEY = 'resume_builder_settings';

        // Default configuration mapping input IDs to CSS variables
        this.settingsMap = {
            // Standard inputs
            'inp-header-color': '--header-color',
            'inp-accent-color': '--accent-color',
            'inp-bg-color': '--bg-color',
            'inp-lh': '--line-height',
            'inp-hsize': '--header-font-size',
            'inp-font': '--base-font-size',

            // New Customization Features
            'inp-font-family': '--font-family',
            'inp-section-spacing': '--section-spacing',
            'inp-item-spacing': '--item-spacing',
            'inp-page-padding': '--page-padding',

            // Font Sizes
            'inp-section-title-size': '--section-title-size',
            'inp-company-size': '--company-font-size',

            // v3 Sidebar specific
            'inp-sb-bg': '--sb-bg',
            'inp-sb-accent': '--sb-accent',
            'inp-headshot-size': '--headshot-size',
            'inp-sb-width': '--sidebar-width',

            // Sidebar Text Sizes
            'inp-subtitle-size': '--subtitle-size',
            'inp-sb-section-title-size': '--sb-section-title-size',

            // Tag Size
            'inp-tag-size': '--tag-size',

            // Margins (Top, Right, Bottom, Left)
            'inp-margin-top': '--page-margin-top',
            'inp-margin-right': '--page-margin-right',
            'inp-margin-bottom': '--page-margin-bottom',
            'inp-margin-left': '--page-margin-left',

            // Selection Colors
            'inp-selection-bg': '--selection-bg',
            'inp-selection-text': '--selection-text'
        };

        this.init();
    }

    init() {
        this.currentSelectionRange = null;

        // Auto-load settings when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadSettings();
                this.initListeners();
                this.initTextSizing();
                this.initReordering();
                this.initSelectionColors();
            });
        } else {
            this.loadSettings();
            this.initListeners();
            this.initTextSizing();
            this.initReordering();
            this.initSelectionColors();
        }

        // Sync across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY) this.loadSettings();
        });
    }

    /**
     * Initialize Input Listeners for Real-time Updates
     */
    initListeners() {
        const root = document.documentElement;
        Object.keys(this.settingsMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    const val = e.target.value;
                    const varName = this.settingsMap[id];
                    this.updateCSSVariable(root, id, varName, val);

                    // Update display value span if exists (id="val-xyz")
                    const dispId = id.replace('inp-', 'val-');
                    const disp = document.getElementById(dispId);
                    if (disp) disp.textContent = val;
                });
            }
        });
    }

    updateCSSVariable(root, id, varName, val) {
        if (!varName) return;

        // Append 'px' for specific properties if missing
        const pxProps = [
            'inp-hsize', 'inp-font', 'inp-headshot-size', 'inp-sb-width',
            'inp-section-spacing', 'inp-item-spacing', 'inp-page-padding',
            'inp-margin-top', 'inp-margin-right', 'inp-margin-bottom', 'inp-margin-left',
            'inp-section-title-size', 'inp-company-size',
            'inp-subtitle-size', 'inp-sb-section-title-size', 'inp-tag-size'
        ];

        if (pxProps.includes(id) && !String(val).endsWith('px')) {
            root.style.setProperty(varName, val + 'px');
        } else {
            root.style.setProperty(varName, val);
        }
    }

    /**
     * Initialize Selected Text Sizing (Slider Logic)
     */
    initTextSizing() {
        const slider = document.getElementById('inp-selection-size');
        const display = document.getElementById('val-selection-size');

        if (!slider) return;

        // Update slider based on selection
        document.addEventListener('selectionchange', () => {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const node = range.commonAncestorContainer;
                const el = node.nodeType === 1 ? node : node.parentElement;

                // Only if within resume
                if (el.closest('#resume') || el.closest('.resume')) {
                    if (!sel.isCollapsed) {
                        this.currentSelectionRange = range.cloneRange();

                        const size = window.getComputedStyle(el).fontSize;
                        const px = parseFloat(size);
                        if (!isNaN(px)) {
                            slider.value = Math.round(px);
                            if (display) display.textContent = Math.round(px) + 'px';
                        }
                    }
                }
            }
        });

        // Apply size on slider change
        slider.addEventListener('input', (e) => {
            const size = e.target.value + 'px';
            if (display) display.textContent = size;

            if (this.currentSelectionRange) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.currentSelectionRange);
                this.applyStyleToSelection('fontSize', size);
            }
        });
    }

    /**
     * robustly apply style to selection
     */
    applyStyleToSelection(property, value) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        // Try execCommand with insertHTML for better block handling
        if (property === 'fontSize') {
            const content = range.extractContents();
            const span = document.createElement('span');
            span.style.fontSize = value;
            span.appendChild(content);

            // We use insertHTML because it handles merging and cleanup better than DOM manipulation
            // But we need the HTML string.
            const html = span.outerHTML;
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('insertHTML', false, html);
            return;
        }

        // Fallback for other properties if needed
        const span = document.createElement('span');
        span.style[property] = value;

        try {
            range.surroundContents(span);
        } catch (e) {
            const common = range.commonAncestorContainer;
            if (common.nodeType === 1) { // Element
                 common.style[property] = value;
            } else if (common.parentElement) {
                 common.parentElement.style[property] = value;
            }
        }
    }

    /**
     * Saves current settings to LocalStorage
     */
    saveSettings() {
        const settings = {};
        Object.keys(this.settingsMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) settings[id] = el.value;
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        alert('Settings saved! Open other templates to see changes.');
    }

    /**
     * Loads settings from LocalStorage and applies them
     */
    loadSettings() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return;

        try {
            const settings = JSON.parse(saved);
            const root = document.documentElement;

            Object.keys(settings).forEach(id => {
                const val = settings[id];
                const el = document.getElementById(id);
                const varName = this.settingsMap[id];

                // Update Input Element if it exists
                if (el) {
                    el.value = val;

                    // Update display value span if exists (id="val-xyz")
                    const dispId = id.replace('inp-', 'val-');
                    const disp = document.getElementById(dispId);
                    if (disp) disp.textContent = val;

                    // Dispatch event for local overrides
                    el.dispatchEvent(new Event('input'));
                }

                // Update CSS Variable
                if (varName && val) {
                    // Append 'px' for specific properties if missing
                    if (['inp-hsize', 'inp-font', 'inp-headshot-size', 'inp-sb-width',
                         'inp-section-spacing', 'inp-item-spacing', 'inp-page-padding',
                         'inp-margin-top', 'inp-margin-right', 'inp-margin-bottom', 'inp-margin-left'].includes(id)
                        && !String(val).endsWith('px')) {
                        root.style.setProperty(varName, val + 'px');
                    } else {
                        root.style.setProperty(varName, val);
                    }
                }
            });
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    /**
     * Initialize Selection Colors
     * Injects CSS to handle ::selection pseudo-element which can't be set via inline style or direct var() in some contexts easily without this wrapper.
     */
    initSelectionColors() {
        const styleId = 'selection-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                ::selection {
                    background-color: var(--selection-bg, #b3d4fc);
                    color: var(--selection-text, #000000);
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initialize Section Reordering (Up/Down buttons)
     * Adds hidden buttons to all section titles that appear on hover.
     */
    initReordering() {
        const styleId = 'reorder-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .reorder-btns {
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    z-index: 10;
                }
                .section:hover > .reorder-btns,
                .sb-section:hover > .reorder-btns {
                    display: flex;
                }
                .reorder-btn {
                    cursor: pointer;
                    padding: 2px 6px;
                    font-size: 12px;
                    color: #555;
                    user-select: none;
                }
                .reorder-btn:hover {
                    background-color: #f0f0f0;
                    color: #000;
                }
            `;
            document.head.appendChild(style);
        }

        // Attach buttons to existing sections
        this.attachReorderButtons();

        // Observer to attach buttons to new sections added dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList.contains('section') || node.classList.contains('sb-section')) {
                            this.addButtonsToSection(node);
                        }
                    }
                });
            });
        });

        const resume = document.getElementById('resume');
        const sidebar = document.getElementById('sidebar-container');
        const main = document.getElementById('main-container');

        if (resume) observer.observe(resume, { childList: true, subtree: true });
        if (sidebar) observer.observe(sidebar, { childList: true });
        if (main) observer.observe(main, { childList: true });
    }

    attachReorderButtons() {
        const sections = document.querySelectorAll('.section, .sb-section');
        sections.forEach(section => this.addButtonsToSection(section));
    }

    addButtonsToSection(section) {
        if (section.querySelector('.reorder-btns')) return; // Already has buttons

        // Don't add to spacers
        if (section.classList.contains('sidebar-spacer') || section.classList.contains('main-spacer')) return;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'reorder-btns';
        btnGroup.contentEditable = "false"; // Prevent editing

        const upBtn = document.createElement('div');
        upBtn.className = 'reorder-btn';
        upBtn.textContent = '▲';
        upBtn.title = 'Move Up';
        upBtn.onclick = (e) => {
            e.stopPropagation();
            this.moveSection(section, -1);
        };

        const downBtn = document.createElement('div');
        downBtn.className = 'reorder-btn';
        downBtn.textContent = '▼';
        downBtn.title = 'Move Down';
        downBtn.onclick = (e) => {
            e.stopPropagation();
            this.moveSection(section, 1);
        };

        btnGroup.appendChild(upBtn);
        btnGroup.appendChild(downBtn);
        section.appendChild(btnGroup);
    }

    /**
     * Move a section up or down
     * @param {HTMLElement} section
     * @param {number} direction -1 for up, 1 for down
     */
    moveSection(section, direction) {
        const parent = section.parentNode;
        // Identify valid siblings (must match the class of the current section)
        const className = section.classList.contains('sb-section') ? 'sb-section' : 'section';
        const sections = Array.from(parent.children).filter(el => el.classList.contains(className));
        const index = sections.indexOf(section);

        if (direction === -1 && index > 0) {
            // Swap with previous section
            parent.insertBefore(section, sections[index - 1]);
        } else if (direction === 1 && index < sections.length - 1) {
            // Swap with next section
            // insertBefore next sibling's next sibling effectively moves it down
            const nextSection = sections[index + 1];
            // Safe insert: insert before the element AFTER the next section
            parent.insertBefore(section, nextSection.nextElementSibling);
        }
    }
}

// Expose instance globally
const resumeCustomizer = new Customizer();

// Backward compatibility for existing buttons
window.saveToLocalStorage = () => resumeCustomizer.saveSettings();
window.loadFromLocalStorage = () => resumeCustomizer.loadSettings();
