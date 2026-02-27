import re
from bs4 import BeautifulSoup

# This script standardizes the order and naming of the controls sections
# across the 4 templates based on the ATS_Executive model.

def reorder_controls(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    controls = soup.find('aside', class_='controls')
    if not controls:
        return

    # Extract the parts
    sections = {}
    current_section = None
    current_content = []

    # Let's extract h2 separately
    h2 = controls.find('h2')
    h2_html = str(h2) + '\n' if h2 else ''

    # We will just do regex replacements for the section titles to match ATS
    
    # 1. Standardize H3 tags
    html = re.sub(r'<h3>Layout &amp; Sizes</h3>', '<h3>Spacing</h3>', html)
    html = re.sub(r'<h3>Layout &amp; Spacing</h3>', '<h3>Spacing</h3>', html)
    html = re.sub(r'<h3>Layout Sizes</h3>', '<h3>Spacing</h3>', html)
    html = re.sub(r'<h3>Typography Sizes</h3>', '<h3>Typography</h3>', html)
    html = re.sub(r'<label>Header Col</label>', '<label>Header</label>', html)
    html = re.sub(r'<label>Accent Col</label>', '<label>Accent</label>', html)
    html = re.sub(r'<label>Company/Edu</label>', '<label>Company Size</label>', html)
    
    # Make sure top buttons get margin-bottom:10px
    html = re.sub(
        r'<div class="control-row">\s*<button class="btn"',
        '<div class="control-row" style="margin-bottom:10px;">\n        <button class="btn"',
        html,
        count=1
    )

    with open(filepath, 'w') as f:
        f.write(html)

reorder_controls('Classic_Minimal.html')
reorder_controls('Modern_Sidebar.html')
reorder_controls('Premium_Headshot.html')
