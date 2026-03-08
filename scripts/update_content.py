import re
from bs4 import BeautifulSoup

templates = [
    ("Classic_Minimal.html", "1.0"),
    ("ATS_Executive.html", "2.0"),
    ("Premium_Headshot.html", "3.0"),
    ("Modern_Sidebar.html", "4.0"),
    ("Photo_Header.html", "5.0"),
    ("Clean_Professional.html", "6.0"),
    ("Elegant_TwoColumn.html", "7.0"),
    ("Bold_Engineer.html", "8.0"),
    ("Academic.html", "9.0")
]

def update_version_in_html(filename, new_version):
    with open(filename, "r") as f:
        html = f.read()
    
    # Update <title>
    html = re.sub(r'<title>([^<]*?)v\d+\.0([^<]*?)</title>', f'<title>\\g<1>v{new_version}\\g<2></title>', html)
    
    # Update <h2> in control panel
    html = re.sub(r'(<aside[^>]*>[\s\S]*?)<h2>([^<]*?)v\d+\.0([^<]*?)</h2>', f'\\g<1><h2>\\g<2>v{new_version}\\g<3></h2>', html)
    
    with open(filename, "w") as f:
         f.write(html)

def update_index_html():
    with open("index.html", "r") as f:
        html = f.read()
    soup = BeautifulSoup(html, "html.parser")
    for filename, version in templates:
        card = soup.find("a", href=filename)
        if card:
             badge = card.find("span", class_="badge")
             if badge:
                 if "New" in badge.text or "v" in badge.text:
                     badge.string = f"New / v{version}"
    with open("index.html", "w") as f:
        f.write(str(soup))

def sync_content():
    # Read the academic content from Academic.html
    with open("Academic.html", "r") as f:
        aca_soup = BeautifulSoup(f.read(), "html.parser")
    
    resume_div = aca_soup.find("div", id="resume")
    header_html = str(resume_div.find("div", class_="header"))
    
    sections = []
    for sec in resume_div.find_all("div", class_="section"):
        sections.append((sec.find("div", class_="section-title").text.strip(), str(sec)))

    # Extra CSS rules needed for academic content
    academic_css = """
      /* Academic Section Styles */
      .edu-entry { margin-bottom: 6px; }
      .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
      .edu-header .school { font-weight: 700; color: var(--header-color); font-size: var(--company-font-size); }
      .edu-header .dates { color: var(--accent-color); font-style: italic; font-size: 0.95em; }
      .edu-degree { font-size: 1em; margin-top: 1px; }
      .edu-coursework { font-size: 0.92em; color: #666; font-style: italic; margin-top: 1px; }
      .job { margin-bottom: 7px; }
      .job-header { display: flex; justify-content: space-between; font-size: var(--company-font-size); font-weight: 600; color: var(--header-color); }
      .job-header .dates { color: var(--accent-color); font-weight: 400; font-style: italic; }
      .job-title { font-style: italic; font-size: 1em; margin-bottom: 1px; }
      .job ul { padding-left: 16px; margin-top: 2px; }
      .job li { margin-bottom: 1px; line-height: var(--line-height); }
      .skills-category { margin-bottom: 3px; font-size: 1em; }
      .skills-category strong { color: var(--header-color); }
      .skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
      .sk { padding: 2px 8px; border-radius: 3px; background: #f0f3f6; color: #2c3e50; position: relative; cursor: pointer; transition: opacity 0.15s; }
      .sk.hl { background: var(--header-color); color: #fff; font-weight: 600; }
      .sk .sk-del { display: none; position: absolute; top: -6px; right: -6px; width: 14px; height: 14px; background: #dc2626; color: #fff; border: none; border-radius: 50%; font-size: 9px; line-height: 1; cursor: pointer; align-items: center; justify-content: center; padding: 0; }
      .sk:hover .sk-del { display: flex; }
      .cert-item { margin-bottom: 3px; font-size: 1em; }
      .lang-item { font-size: 1em; }
"""

    side_section_titles = ["Education", "Technical Skills", "Languages & Test Scores", "Key Skills"]

    for filename, version in templates:
        # Don't overwrite Academic it's the source
        if filename == "Academic.html": continue
        
        with open(filename, "r") as f:
            html = f.read()
        target = BeautifulSoup(html, "html.parser")
        
        # Inject CSS if not present
        style_tag = target.find("style")
        if style_tag and ".edu-entry" not in style_tag.text:
            style_tag.append(academic_css)
            
        resume = target.find("div", id="resume")
        if not resume: continue
        
        # Determine Layout Type
        # Type A: One column
        # Type B: Has .main-body -> .side-col and .main-col (Photo_Header uses .header-container outside)
        # Type C: Has #sidebar-container and #main-container (Premium_Headshot)
        # Type D: Has .sidebar and .main-content BUT NO #sidebar-container ID (Modern_Sidebar? wait Modern Sidebar uses #bottom-grid)
        # Actually elegant two column has .left-col and .main-col.
        
        is_1col = False
        if resume.find("div", class_="side-col"):
            side_col = resume.find("div", class_="side-col")
            main_col = resume.find("div", class_="main-col")
            # clear them
            side_col.clear()
            main_col.clear()
            
            # Photo_Header has header-container outside.
            if resume.find("div", class_="header-container"):
                h_info = resume.find("div", class_="header-info")
                if h_info:
                    # just change name and title text
                    h1 = h_info.find("h1")
                    if h1: h1.string = "Alex (Jiajia) Guo"
                    tit = h_info.find("div", class_="title")
                    if tit: tit.string = "Senior Product Manager, GenAI & Operations"
                    # grid contact
                    grid = h_info.find("div", class_="contact-grid")
                    if grid:
                        grid.clear()
                        grid.append(BeautifulSoup('''
                            <div class="contact-item"><span class="icon">📞</span>+86 131-2038-1760</div>
                            <div class="contact-item"><span class="icon">✉</span><a href="mailto:alexjia.guo@gmail.com">alexjia.guo@gmail.com</a></div>
                            <div class="contact-item"><span class="icon">🌐</span><a href="#">linkedin.com/in/alex-jiajia</a></div>
                        ''', "html.parser"))
            
            # inject sections
            for title, sec_html in sections:
                if title in side_section_titles:
                    side_col.append(BeautifulSoup(sec_html, "html.parser"))
                else:
                    main_col.append(BeautifulSoup(sec_html, "html.parser"))
                    
        elif resume.find("div", id="sidebar-container") and resume.find("div", id="main-container"):
            # Premium headshot uses ID
            sc = resume.find("div", id="sidebar-container")
            mc = resume.find("div", id="main-container")
            # preserve spacer and header in sidebar if presents
            spacer = sc.find("div", class_="sidebar-spacer")
            h1 = sc.find("h1")
            sub = sc.find("div", class_="subtitle")
            if h1: h1.string = "Alex (Jiajia) Guo"
            if sub: sub.string = "Senior Product Manager"
            
            for child in list(sc.children):
                if child.name == "div" and "section" in child.get("class", []):
                    child.extract()
            for child in list(mc.children):
                if child.name == "div" and "section" in child.get("class", []):
                    child.extract()
            
            for title, sec_html in sections:
                if title in side_section_titles:
                    sc.append(BeautifulSoup(sec_html, "html.parser"))
                else:
                    mc.append(BeautifulSoup(sec_html, "html.parser"))
                    
        elif resume.find("div", class_="left-col"):
            # Elegant Two Column Uses left-col and right-col inside main-body
            lc = resume.find("div", class_="left-col")
            rc = resume.find("div", class_="right-col")
            # Elegant Two Column has header-elegant
            he = resume.find("div", class_="header-elegant")
            if he:
                h1 = he.find("h1")
                if h1: h1.string = "Alex (Jiajia) Guo"
                tit = he.find("div", class_="subtitle")
                if tit: tit.string = "Senior Product Manager"
                hc = he.find("div", class_="header-contact")
                if hc:
                    hc.clear()
                    hc.append(BeautifulSoup('''
<span><span class="icon">📞</span> +86 131-2038-1760</span>
<span><span class="icon">✉</span> alexjia.guo@gmail.com</span>
<span><span class="icon">🔗</span> linkedin.com/in/alex-jiajia</span>
                    ''', "html.parser"))
            lc.clear()
            rc.clear()
            for title, sec_html in sections:
                if title in side_section_titles:
                    rc.append(BeautifulSoup(sec_html, "html.parser"))
                else:
                    lc.append(BeautifulSoup(sec_html, "html.parser"))

        elif resume.find("div", class_="header-left"):
            # Modern Sidebar has .header-left, .header-right, #experience-container, and #bottom-grid
            resume.find("div", class_="header-left").find("h1").string = "Alex (Jiajia) Guo"
            resume.find("div", class_="header-left").find("div", class_="title").string = "Senior Product Manager"
            
            exp_c = resume.find("div", id="experience-container")
            bot_g = resume.find("div", id="bottom-grid")
            if exp_c: exp_c.clear()
            if bot_g: bot_g.clear()
            
            # Modern Sidebar layout
            for title, sec_html in sections:
                if title == "Professional Experience" or title == "Training & Certifications":
                     if exp_c: exp_c.append(BeautifulSoup(sec_html, "html.parser"))
                else:
                     if bot_g:
                         s = BeautifulSoup(sec_html, "html.parser").find("div", class_="section")
                         s["class"] = s.get("class", []) + ["bottom-section"]
                         bot_g.append(s)

        else:
            # 1 column (Classic, Clean, Bold, ATS)
            pb = resume.find("div", id="page-break-line")
            resume.clear()
            if pb: resume.append(pb)
            resume.append(BeautifulSoup(header_html, "html.parser"))
            for title, sec_html in sections:
                resume.append(BeautifulSoup(sec_html, "html.parser"))

        with open(filename, "w") as f:
            f.write(str(target))

if __name__ == '__main__':
    update_index_html()
    for filename, version in templates:
         update_version_in_html(filename, version)
    sync_content()
    print("Done")
