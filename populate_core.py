import re
from bs4 import BeautifulSoup

def read_academic():
    with open('Academic.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    res = soup.find(id='resume')
    
    data = {}
    data['name'] = res.find('h1').text.strip()
    
    # Extract jobs
    jobs = []
    for job in res.find_all(class_='job'):
        header = job.find(class_='job-header')
        role = header.find('span').text.split(' — ')[0].strip()
        company = header.find('span').text.split(' — ')[1].strip() if ' — ' in header.find('span').text else ""
        dates = header.find(class_='dates').text.strip()
        
        bullets = [li.text for li in job.find('ul').find_all('li')]
        jobs.append({'role': role, 'company': company, 'dates': dates, 'bullets': bullets})
    data['jobs'] = jobs
    
    # Extract education
    edus = []
    for edu in res.find_all(class_='edu-entry'):
        school = edu.find(class_='school').text.strip()
        dates = edu.find(class_='dates').text.strip()
        degree = edu.find(class_='edu-degree').text.strip()
        cw_tag = edu.find(class_='edu-coursework')
        coursework = cw_tag.text.strip() if cw_tag else ""
        edus.append({'school': school, 'dates': dates, 'degree': degree, 'coursework': coursework})
    data['edus'] = edus
    
    # Extract skills wrap
    skills = []
    skills_wrap = res.find(class_='skills-wrap')
    if skills_wrap:
        for sk in skills_wrap.find_all('span', class_='sk'):
            skills.append({'name': sk.contents[0].strip(), 'hl': 'hl' in sk.get('class', [])})
    data['skills_wrap'] = skills
    
    # Details
    data['tech_skills'] = [d.text for d in res.find_all(class_='skills-category')]
    data['certs'] = [c.text for c in res.find_all(class_='cert-item')]
    data['langs'] = [l.text for l in res.find_all(class_='lang-item')]
    
    return data

def build_classic_minimal(data):
    html = f"""<div class="resume" id="resume" contenteditable="true">
  <div id="page-break-line" class="page-break-marker" style="top: 1122px; display:none;"></div>
  <div class="header">
    <h1>{data['name']}</h1>
    <div class="info">
      +86 131-2038-1760 ·
      <a href="mailto:alexjia.guo@gmail.com">alexjia.guo@gmail.com</a> ·
      <a href="#">linkedin.com/in/alex-jiajia</a>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""    <div class="job">
      <div class="job-header"><span>{j['company']}</span> <span class="dates">{j['dates']}</span></div>
      <div class="job-title">{j['role']}</div>
      <ul>
"""
        for b in j['bullets']:
            html += f"        <li>{b}</li>\n"
        html += "      </ul>\n    </div>\n"
        
    html += """  </div>
  <div class="section">
    <div class="section-title">Education</div>
"""
    for e in data['edus']:
        html += f"""    <div class="edu-item" style="margin-bottom:6px;">
      <div style="display:flex; justify-content:space-between; font-weight:600; font-size:12px;"><span>{e['school']}</span><span>{e['dates']}</span></div>
      <div style="font-size:11px;">{e['degree']}</div>
"""
        if e['coursework']:
            html += f"      <div style='font-size:11px;color:#666;font-style:italic;'>{e['coursework']}</div>\n"
        html += "    </div>\n"

    html += """  </div>
  <div class="section">
    <div class="section-title">Technical Skills</div>
"""
    for ts in data['tech_skills']:
        html += f"    <div><p style='font-size:11px; margin-bottom:2px;'>{ts}</p></div>\n"
        
    html += """  </div>
  <div class="section">
    <div class="section-title">Key Skills</div>
    <div class="skills-wrap">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"      <span class='sk{hl}'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\">×</span></span>\n"
        
    html += """    </div>
  </div>
</div>"""
    return html

def build_ats_executive(data):
    # Same standard HTML but mapped perfectly to 1 column format
    html = f"""<div class="resume" id="resume" contenteditable="true">
  <div id="page-break-line" class="page-break-marker" style="top: 1122px; display:none;"></div>
  <div class="header">
    <h1>{data['name']}</h1>
    <div class="subtitle">{data['jobs'][0]['role']}</div>
    <div class="contact-line">
      +86 131-2038-1760 · alexjia.guo@gmail.com · linkedin.com/in/alex-jiajia
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""    <div class="job">
      <div class="job-header"><span class="job-company">{j['company']}</span> <span class="job-dates">{j['dates']}</span></div>
      <div class="job-title-line">{j['role']}</div>
      <ul>
"""
        for b in j['bullets']:
            html += f"        <li>{b}</li>\n"
        html += "      </ul>\n    </div>\n"
        
    html += """  </div>
  <div class="section">
    <div class="section-title">Education</div>
"""
    for e in data['edus']:
        html += f"""    <div class="job" style="margin-bottom:8px;">
      <div class="job-header"><span class="job-company">{e['school']}</span> <span class="job-dates">{e['dates']}</span></div>
      <div class="job-title-line">{e['degree']}</div>
"""
        if e['coursework']:
            html += f"      <div style='font-size:0.9em;color:#666;font-style:italic;'>{e['coursework']}</div>\n"
        html += "    </div>\n"

    html += """  </div>
  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="job"><ul>
"""
    for ts in data['tech_skills']:
        html += f"      <li>{ts}</li>\n"
        
    html += """    </ul></div>
  </div>
  <div class="section">
    <div class="section-title">Key Skills</div>
    <div class="skills-wrap" style="display:flex; flex-wrap:wrap; gap:5px; margin-top:5px;">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"      <span class='sk{hl}' style='padding:2px 8px; border:1px solid #ccc; font-size:10px; border-radius:3px;'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\" style=\"display:none;\">×</span></span>\n"
        
    html += """    </div>
  </div>
</div>"""
    return html

def build_modern_sidebar(data):
    html = f"""<div class="resume" id="resume" contenteditable="true">
  <div class="header-left">
    <h1>{data['name']}</h1>
    <div class="title">{data['jobs'][0]['role']}</div>
    <div class="contact-info">
      +86 131-2038-1760 | alexjia.guo@gmail.com | linkedin.com/in/alex-jiajia
    </div>
  </div>
  <div class="header-right"></div>
  
  <div id="experience-container">
    <div class="section">
      <div class="section-title">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""      <div class="xp-item">
        <div class="xp-header">
          <span class="xp-role">{j['role']}</span>
          <span class="xp-dates">{j['dates']}</span>
        </div>
        <div class="xp-company">{j['company']}</div>
        <ul class="xp-bullets">
"""
        for b in j['bullets']:
            html += f"          <li>{b}</li>\n"
        html += "        </ul>\n      </div>\n"
        
    html += """    </div>
  </div>
  
  <div class="bottom" id="bottom-grid">
    <div class="section bottom-section">
      <div class="section-title">Education</div>
"""
    for e in data['edus']:
        html += f"""      <div class="xp-item" style="margin-bottom:10px;">
        <div class="xp-role" style="font-size:12px;">{e['school']}</div>
        <div class="xp-company" style="font-size:11px;">{e['degree']}</div>
        <div class="xp-dates" style="font-size:10px;">{e['dates']}</div>
"""
        if e['coursework']:
            html += f"        <div style='font-size:10px;color:#666;font-style:italic;'>{e['coursework']}</div>\n"
        html += "      </div>\n"

    html += """    </div>
    
    <div class="section bottom-section">
      <div class="section-title">Technical</div>
      <div style="display:flex; flex-direction:column; gap:4px;">
"""
    for ts in data['tech_skills']:
        html += f"        <div style='font-size:11px;'>{ts}</div>\n"
        
    html += """      </div>
    </div>
    
    <div class="section bottom-section">
      <div class="section-title">Core Skills</div>
      <div class="skills-wrap" style="display:flex; flex-wrap:wrap; gap:5px;">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"        <span class='sk{hl}' style='background:#f1f5f9; padding:3px 8px; border-radius:3px; font-size:10px; cursor:pointer;'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\" style=\"display:none; margin-left:5px; color:#e74c3c;\">×</span></span>\n"
        
    html += """      </div>
    </div>
  </div>
</div>"""
    return html

def build_premium_headshot(data):
    html = f"""<div class="resume" id="resume">
  <div id="page-break-line" class="page-break-marker" style="top: 1122px; display: none"></div>

  <!-- SIDEBAR -->
  <div class="sidebar" id="sidebar-container" contenteditable="true">
    <div class="headshot-container">
      <img id="headshot-img" src="headshot.png" class="headshot" alt="Headshot" onerror="this.style.display = 'none'" />
    </div>

    <h1>{data['name']}</h1>
    <div class="subtitle">{data['jobs'][0]['role']}</div>

    <div class="sb-section">
      <h3>Contact</h3>
      <div class="contact-item"><span class="ic">☎</span> +86 131-2038-1760</div>
      <div class="contact-item"><span class="ic">✉</span> alexjia.guo@gmail.com</div>
      <div class="contact-item"><span class="ic">🔗</span> linkedin.com/in/alex-jiajia</div>
    </div>

    <div class="sb-section">
      <h3>Education</h3>
"""
    for e in data['edus']:
        html += f"""      <div class="edu-block" style="margin-bottom:12px;">
        <div class="dates">{e['dates']}</div>
        <div class="degree">{e['degree']}</div>
        <div class="school">{e['school']}</div>
      </div>\n"""
      
    html += """    </div>

    <div class="sb-section">
      <h3>Technical</h3>
"""
    for ts in data['tech_skills']:
        html += f"""      <div style='font-size:10px; margin-bottom:4px; line-height:1.3;'>{ts}</div>\n"""
        
    html += """    </div>

    <div class="sb-section">
      <h3>Skills</h3>
      <div class="skills-wrap">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"        <span class='sk{hl}'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\">×</span></span>\n"
        
    html += """      </div>
    </div>
    <div class="sidebar-spacer"></div>
  </div>

  <!-- MAIN -->
  <div class="main" id="main-container">
    <div class="section">
      <div class="section-title" contenteditable="true">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""      <div class="job" contenteditable="true">
        <div class="job-header">
          <span class="job-company">{j['company']}</span>
          <span class="job-dates">{j['dates']}</span>
        </div>
        <div class="job-role">{j['role']}</div>
        <ul>
"""
        for b in j['bullets']:
            html += f"          <li>{b}</li>\n"
        html += "        </ul>\n      </div>\n"
        
    html += """    </div>
    <div class="main-spacer"></div>
  </div>
</div>"""
    return html

def inject_and_save(filename, build_func, data):
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    old_resume = soup.find(id='resume')
    if old_resume:
        new_resume_html = build_func(data)
        new_resume_soup = BeautifulSoup(new_resume_html, 'html.parser')
        old_resume.replace_with(new_resume_soup.find(id='resume'))
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Fixed {filename}")

if __name__ == '__main__':
    data = read_academic()
    inject_and_save('Classic_Minimal.html', build_classic_minimal, data)
    inject_and_save('ATS_Executive.html', build_ats_executive, data)
    inject_and_save('Modern_Sidebar.html', build_modern_sidebar, data)
    inject_and_save('Premium_Headshot.html', build_premium_headshot, data)

