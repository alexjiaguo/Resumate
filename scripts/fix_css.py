import re
import os

css_replacement = """        /* ═══════════════════ CONTROL PANEL ═══════════════════ */
        .controls {
            position: fixed; top: 0; left: 0; bottom: 0;
            width: 300px; background: #1a1a2e; padding: 16px;
            overflow-y: auto; z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 12px; color: #c8cad0;
        }
        .controls h2 { margin: 0 0 12px 0; font-size: 15px; color: #fff; text-align: center; letter-spacing: 0.5px; }
        .controls h3 { margin: 14px 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #6b7280; border-bottom: 1px solid #2d2d4e; padding-bottom: 4px; }
        .control-group { margin-bottom: 8px; }
        .control-group label { display: block; margin-bottom: 3px; color: #9ca3af; font-size: 10px; font-weight: 500; }
        .control-group select, .control-group input[type="text"], .control-group input[type="file"] { width: 100%; padding: 6px 8px; background: #2d2d4e; color: #e5e7eb; border: 1px solid #3d3d5c; border-radius: 4px; font-size: 11px; }

        .stepper { display: flex; align-items: center; border: 1px solid #3d3d5c; border-radius: 4px; overflow: hidden; background: #2d2d4e; }
        .stepper button { width: 26px; height: 26px; border: none; background: #3d3d5c; color: #c8cad0; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; }
        .stepper button:hover { background: #4d4d6e; color: #fff; }
        .stepper input { flex: 1; text-align: center; border: none; background: #2d2d4e; color: #e5e7eb; font-size: 11px; padding: 3px 0; -moz-appearance: textfield; }
        .stepper input::-webkit-outer-spin-button,
        .stepper input::-webkit-inner-spin-button { appearance: none; -webkit-appearance: none; margin: 0; }

        .control-group input[type="color"] { width: 100%; height: 28px; border: 1px solid #3d3d5c; padding: 2px; border-radius: 4px; cursor: pointer; background: #2d2d4e; }

        .btn { display: block; width: 100%; padding: 7px; border: none; color: #fff; background: #0066cc; border-radius: 4px; cursor: pointer; text-align: center; font-weight: 600; font-size: 11px; margin-top: 4px; white-space: nowrap; }
        .btn:hover { background: #0052a3; }
        .btn-sec { background: #4b5563; }
        .btn-sec:hover { background: #374151; }
        .btn-danger { background: #dc2626; }
        .btn-danger:hover { background: #b91c1c; }
        .btn-print { background: #059669; margin-top: 16px; }
        .btn-print:hover { background: #047857; }
        .control-row { display: flex; gap: 5px; align-items: flex-end; }
        .control-row .btn { flex: 1; margin-top: 0; }

        .fmt-bar { display: flex; gap: 3px; margin-bottom: 10px; padding: 6px; background: #2d2d4e; border-radius: 5px; border: 1px solid #3d3d5c; flex-wrap: wrap; }
        .fmt-btn { width: 26px; height: 26px; border: 1px solid #3d3d5c; background: #1a1a2e; border-radius: 3px; cursor: pointer; font-weight: bold; color: #c8cad0; display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .fmt-btn:hover { background: #3d3d5c; color: #fff; }
        .fmt-color-wrap { width: 26px; height: 26px; position: relative; border-radius: 3px; overflow: hidden; border: 1px solid #3d3d5c; }
        .fmt-color-wrap input { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; cursor: pointer; border: none; padding: 0; }

        .page-break-marker { position: absolute; left: 0; right: 0; border-top: 2px dashed #dc2626; pointer-events: none; opacity: 0.5; z-index: 100; display: none; }
        .page-break-marker::after { content: "Page Break"; position: absolute; right: 10px; top: -20px; color: #dc2626; font-size: 10px; font-weight: bold; }"""

import sys

def modify_file(filepath, start_marker, end_marker):
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to replace everything from start_marker down to (but not including) end_marker
    pattern = re.compile(re.escape(start_marker) + r'.*?(?=' + re.escape(end_marker) + r')', re.DOTALL)
    
    if not pattern.search(content):
        print(f"Could not find segment in {filepath}")
        return

    new_content = pattern.sub(css_replacement + "\n\n", content)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"Updated CSS in {filepath}")

# Classic Minimal
modify_file('Classic_Minimal.html', '/* CONTROLS PANEL */', '/* --- RESUME --- */')

# Modern Sidebar
modify_file('Modern_Sidebar.html', '/* --- CONTROL PANEL --- */', '/* --- RESUME --- */')

# Premium Headshot
modify_file('Premium_Headshot.html', '/* --- CONTROLS --- */', '/* REORDER CONTROLS */')

