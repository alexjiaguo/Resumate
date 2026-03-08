import re
from bs4 import BeautifulSoup
import os

def tweak_bold_engineer():
    with open('Bold_Engineer.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Move contact row closer to job title by reducing margin-top of .contact-row
    content = re.sub(r'\.contact-row \{([^}]+)margin-top:\s*10px;', r'.contact-row {\1margin-top: 2px;', content)
    
    # Also in case there's margin-bottom on title
    content = re.sub(r'\.top-left \.title \{([^}]+)\}', r'.top-left .title {\1 margin-bottom: 2px; }', content)

    # Let's verify what contact-row has
    print("Tweaked Bold_Engineer.html margin-top")
    
    with open('Bold_Engineer.html', 'w', encoding='utf-8') as f:
        f.write(content)

def tweak_photo_header():
    with open('Photo_Header.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Reduce padding of header-container
    content = re.sub(r'\.header-container \{([^}]+)padding:\s*20px 30px;', r'.header-container {\1padding: 10px 30px;', content)
    
    # Make sure contact-grid aligns perfectly (e.g. justify-content or align-items)
    # the original was grid-template-columns: 1fr 1fr. 
    # let's make it auto auto so it's tight, or keep 1fr 1fr but center it? The user said "proper alignment".
    # I'll let contact-grid align perfectly by having the content centered vertically
    content = re.sub(r'\.contact-grid \{([^}]+)\}', r'.contact-grid {\1 align-items: center; }', content)
    
    with open('Photo_Header.html', 'w', encoding='utf-8') as f:
        f.write(content)

print("Applying tweaks...")
tweak_bold_engineer()
tweak_photo_header()
print("Done.")
