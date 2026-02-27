import re

filepath = 'Premium_Headshot.html'
with open(filepath, 'r') as f:
    html = f.read()

# I will extract the whole <aside class="controls"> content and rebuild it.
start_str = '<aside class="controls">'
end_str = '</aside>'
start_idx = html.find(start_str)
end_idx = html.find(end_str)

if start_idx == -1 or end_idx == -1:
    print("Could not find <aside>")
    exit(1)

aside_content = html[start_idx + len(start_str):end_idx]

# Pattern to extract sections by their <h3> tag or top level elements
# Actually, it's easier to use string splitting on <h3>
parts = re.split(r'(<h3>.*?</h3>)', aside_content)

# parts[0] is everything before the first <h3>
# parts[1] is the first <h3>
# parts[2] is the content of the first <h3>
# and so on...

# Let's extract the h2 and save/load buttons from parts[0]
header_part = parts[0]
h2_match = re.search(r'<h2>.*?</h2>', header_part)
h2 = h2_match.group(0) if h2_match else '<h2>Resume Builder v3.0</h2>'

save_buttons_match = re.search(r'<div class="control-row">.*?💾 Save.*?</div>', header_part, re.DOTALL)
save_buttons = save_buttons_match.group(0) if save_buttons_match else ''

color_schemes = ""
text_fmt = ""
spacing = ""
add_content = ""
headshot = ""
typography = ""
colors = ""
print_btn = ""

for i in range(1, len(parts), 2):
    title = parts[i]
    content = parts[i+1]
    
    if "Color Schemes" in title:
        color_schemes = title + content
        # remove save buttons if they were accidentally grabbed here
        color_schemes = re.sub(r'<div class="control-row">\s*<button class="btn" onclick="resumeCustomizer.saveSettings\(\)">💾 Save.*?</button>\s*<button.*?</button>\s*<button.*?</button>\s*</div>', '', color_schemes, flags=re.DOTALL)
    elif "Text Formatting" in title:
        text_fmt = title + content
    elif "Layout &amp; Spacing" in title or "Spacing" in title:
        title = "<h3>Spacing</h3>"
        spacing = title + content
    elif "Add Content" in title:
        add_content = title + content
        # remove print btn from add content if it got stuck there
        print_btn_match = re.search(r'<button class="btn btn-print".*?</button>', add_content, re.DOTALL)
        if print_btn_match:
            print_btn = print_btn_match.group(0)
            add_content = add_content.replace(print_btn, '')
    elif "Headshot" in title:
        headshot = title + content
    elif "Typography Sizes" in title or "Typography" in title:
        title = "<h3>Typography</h3>"
        typography = title + content
    elif "Colors" in title:
        title = "<h3>Colors</h3>"
        colors = title + content
        # remove print btn
        print_btn_match = re.search(r'<button class="btn btn-print".*?</button>', colors, re.DOTALL)
        if print_btn_match:
            print_btn = print_btn_match.group(0)
            colors = colors.replace(print_btn, '')

# Construct the new aside content
new_aside = f"""
        {h2}
        <div class="control-row" style="margin-bottom:10px;">
          <button class="btn" onclick="resumeCustomizer.saveSettings()">💾 Save</button>
          <button class="btn btn-sec" onclick="resumeCustomizer.loadSettings()">📂 Load</button>
          <button class="btn btn-danger" onclick="resumeCustomizer.resetSettings()">↺ Reset</button>
        </div>
{color_schemes}{colors}{text_fmt}{typography}{spacing}{headshot}{add_content}
        {print_btn}
    """

# Add back to html
final_html = html[:start_idx + len(start_str)] + new_aside + html[end_idx:]

with open(filepath, 'w') as f:
    f.write(final_html)

print("Pre-computation done for Premium Headshot.")

