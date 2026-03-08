import os
import re

templates = [
    'Classic_Minimal.html',
    'Modern_Sidebar.html',
    'Premium_Headshot.html',
    'ATS_Executive.html',
    'Photo_Header.html',
    'Clean_Professional.html',
    'Elegant_TwoColumn.html',
    'Bold_Engineer.html',
    'Academic.html'
]

# 1. Extract HTML select from Academic.html
with open('Academic.html', 'r', encoding='utf-8') as f:
    academic_content = f.read()

# Match the <select id="inp-color-scheme"...>...</select>
select_pattern = re.compile(r'<select id="inp-color-scheme"[^>]*>.*?</select>', re.DOTALL)
select_match = select_pattern.search(academic_content)
if not select_match:
    print("Could not find select in Academic.html")
    exit(1)
themes_html = select_match.group(0)

# 2. Extract JS schemes from Academic.html
schemes_pattern = re.compile(r'const schemes = \{.*?\};', re.DOTALL)
schemes_match = schemes_pattern.search(academic_content)
if not schemes_match:
    print("Could not find schemes in Academic.html")
    exit(1)
themes_js = schemes_match.group(0)

print(f"Extracted {themes_html.count('<option')} options from Academic.html")

for template in templates:
    if template == 'Academic.html':
        continue
    
    with open(template, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace HTML
    content = select_pattern.sub(themes_html, content)
    
    # Replace JS
    content = schemes_pattern.sub(themes_js.replace('\\', '\\\\'), content)
    
    with open(template, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated themes in {template}")

print("Done syncing themes.")
