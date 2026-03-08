import os
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

def build_bold_engineer(data):
    html = f"""<div class="resume" contenteditable="true" id="resume">
  <div class="page-break-marker" id="page-break-line" style="display: none; top: 1122px;"></div>
  <div class="top-wrap">
    <div class="top-left">
      <h1>{data['name']}</h1>
      <div class="title">{data['jobs'][0]['role']}</div>
      <div class="contact-row">
        <div class="contact-badge"><span class="contact-label">TEL</span><span class="contact-value">+86 131-2038-1760</span></div>
        <div class="contact-badge"><span class="contact-label">EMAIL</span><span class="contact-value">alexjia.guo@gmail.com</span></div>
        <div class="contact-badge"><span class="contact-label">LINKEDIN</span><span class="contact-value">linkedin.com/in/alex-jiajia</span></div>
      </div>
    </div>
    <div class="top-right"><img alt="Headshot" id="headshot-img" src="headshot.png"/></div>
  </div>

  <div class="section">
    <div class="sec-header">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""    <div class="exp-item">
      <div class="exp-top"><span>{j['role']}</span> <span class="dates">{j['dates']}</span></div>
      <span class="exp-co">{j['company']}</span>
      <ul class="list">
"""
        for b in j['bullets']:
            html += f"        <li>{b}</li>\n"
        html += "      </ul>\n    </div>\n"
        
    html += """  </div>
  <div class="section">
    <div class="sec-header">Education</div>
"""
    for e in data['edus']:
        html += f"""    <div class="exp-item">
      <div class="exp-top"><span>{e['school']}</span> <span class="dates">{e['dates']}</span></div>
      <span class="exp-co">{e['degree']}</span>
"""
        if e['coursework']:
            html += f"      <div style='font-size:0.9em;color:#666;margin-top:2px;'>{e['coursework']}</div>\n"
        html += "    </div>\n"

    html += """  </div>
  <div class="section">
    <div class="sec-header">Technical Skills</div>
    <ul class="list">
"""
    for ts in data['tech_skills']:
        html += f"      <li>{ts}</li>\n"
    html += """    </ul>
  </div>
  <div class="section">
    <div class="sec-header">Key Skills</div>
    <ul class="skills-list">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"      <li class='sk{hl}'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\">×</span></li>\n"
        
    html += """    </ul>
  </div>
</div>"""
    return html

def build_clean_professional(data):
    html = f"""<div class="resume" contenteditable="true" id="resume">
  <div class="page-break-marker" id="page-break-line" style="display: none; top: 1122px;"></div>
  <div class="centered-header">
    <h1>{data['name']}</h1>
    <div class="job-title">{data['jobs'][0]['role']}</div>
    <div class="centered-contact">
      <span>📞 +86 131-2038-1760</span>
      <span>✉ alexjia.guo@gmail.com</span>
      <span>🔗 linkedin.com/in/alex-jiajia</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""    <div class="exp-item">
      <div class="exp-header"><span class="exp-name">{j['role']}</span> <span class="exp-dates">{j['dates']}</span></div>
      <div class="exp-place">{j['company']}</div>
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
        html += f"""    <div class="exp-item">
      <div class="exp-header"><span class="exp-name">{e['school']}</span> <span class="exp-dates">{e['dates']}</span></div>
      <div class="exp-place">{e['degree']}</div>
"""
        if e['coursework']:
            html += f"      <div style='font-size:0.9em;color:#666;margin-top:2px;'>{e['coursework']}</div>\n"
        html += "    </div>\n"

    html += """  </div>
  <div class="section">
    <div class="section-title">Technical Skills</div>
    <ul>
"""
    for ts in data['tech_skills']:
        html += f"      <li>{ts}</li>\n"
    html += """    </ul>
  </div>
  <div class="section">
    <div class="section-title">Core Competencies</div>
    <div class="skills-grid">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"      <span class='skill-tag{hl}'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\">×</span></span>\n"
        
    html += """    </div>
  </div>
</div>"""
    return html

def build_elegant_twocolumn(data):
    html = f"""<div class="resume" contenteditable="true" id="resume">
  <div class="page-break-marker" id="page-break-line" style="display: none; top: 1122px;"></div>
  <div class="header-elegant">
    <div class="header-name">
      <h1>{data['name']}</h1>
      <div class="subtitle">{data['jobs'][0]['role']}</div>
    </div>
    <div class="header-contact">
      <span>📞 +86 131-2038-1760</span>
      <span>✉ alexjia.guo@gmail.com</span>
      <span>🔗 linkedin.com/in/alex-jiajia</span>
    </div>
  </div>
  
  <div class="body-grid">
    <div class="left-col">
      <div class="section">
        <div class="section-title">Experience</div>
"""
    for j in data['jobs']:
        html += f"""        <div class="job-entry">
          <div class="job-top"><span class="job-role">{j['role']}</span> <span class="job-dates">{j['dates']}</span></div>
          <span class="job-co">{j['company']}</span>
          <ul class="list">
"""
        for b in j['bullets']:
            html += f"            <li>{b}</li>\n"
        html += "          </ul>\n        </div>\n"
        
    html += """      </div>
    </div>
    
    <div class="right-col">
      <div class="section">
        <div class="section-title">Education</div>
"""
    for e in data['edus']:
        html += f"""        <div class="edu-box">
          <div style="font-weight:700;color:var(--header-color);">{e['school']}</div>
          <div style="font-style:italic;color:#7f8c8d;font-size:var(--company-font-size);">{e['degree']}</div>
          <div style="font-size:9px;color:var(--accent-color);font-weight:600;margin-bottom:4px;">{e['dates']}</div>
"""
        if e['coursework']:
            html += f"          <div style='font-size:0.9em;color:#666;'>{e['coursework']}</div>\n"
        html += "        </div>\n"

    html += """      </div>
      <div class="section">
        <div class="section-title">Technical</div>
        <ul class="list">
"""
    for ts in data['tech_skills']:
        html += f"          <li style='font-size:10px;'>{ts}</li>\n"
    html += """        </ul>
      </div>
      <div class="section">
        <div class="section-title">Skills</div>
        <ul class="list">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"          <li class='sk{hl}'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\" style=\"display:none;margin-left:8px;color:#e74c3c;cursor:pointer;\">×</span></li>\n"
        
    html += """        </ul>
      </div>
    </div>
  </div>
</div>"""
    return html

def build_photo_header(data):
    html = f"""<div class="resume" contenteditable="true" id="resume">
  <div class="page-break-marker" id="page-break-line" style="display: none; top: 1122px;"></div>
  
  <div class="header-container">
    <div class="photo-box"><img id="headshot-img" src="headshot.png" alt="Profile" style="width:100%;height:100%;object-fit:cover;" /></div>
    <div class="header-info">
      <h1>{data['name']}</h1>
      <div class="title">{data['jobs'][0]['role']}</div>
      <div class="contact-grid">
        <div class="contact-item"><span class="icon">📞</span> +86 131-2038-1760</div>
        <div class="contact-item"><span class="icon">✉</span> alexjia.guo@gmail.com</div>
        <div class="contact-item"><span class="icon">🔗</span> linkedin.com/in/alex-jiajia</div>
        <div class="contact-item"><span class="icon">📍</span> Beijing, China</div>
      </div>
    </div>
  </div>

  <div class="main-body">
    <div class="main-col">
      <div class="section">
        <div class="section-title">Professional Experience</div>
"""
    for j in data['jobs']:
        html += f"""        <div class="job">
          <div class="job-header"><span class="job-role">{j['role']}</span> <span class="job-dates">{j['dates']}</span></div>
          <div class="job-company">{j['company']}</div>
          <ul>
"""
        for b in j['bullets']:
            html += f"            <li>{b}</li>\n"
        html += "          </ul>\n        </div>\n"
        
    html += """      </div>
    </div>
    
    <div class="side-col">
      <div class="section">
        <div class="section-title">Education</div>
"""
    for e in data['edus']:
        html += f"""        <div style="margin-bottom:15px;">
          <div style="font-weight:700;color:var(--header-color);font-size:11px;">{e['school']}</div>
          <div style="font-style:italic;color:#555;font-size:10px;margin:2px 0;">{e['degree']}</div>
          <div style="font-size:10px;color:#888;">{e['dates']}</div>
"""
        if e['coursework']:
            html += f"          <div style='font-size:9px;color:#666;margin-top:2px;'>{e['coursework']}</div>\n"
        html += "        </div>\n"

    html += """      </div>
      <div class="section">
        <div class="section-title">Technical</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
"""
    for ts in data['tech_skills']:
        html += f"          <div style='font-size:10px;'>{ts}</div>\n"
    html += """        </div>
      </div>
      <div class="section">
        <div class="section-title">Core Skills</div>
        <div class="skills-wrap" style="display:flex;flex-wrap:wrap;gap:5px;">
"""
    for sk in data['skills_wrap']:
        hl = ' hl' if sk['hl'] else ''
        html += f"          <span class='sk{hl}' style='background:#e2e8f0;padding:3px 8px;border-radius:12px;font-size:9px;'>{sk['name']}<span class=\"sk-del\" contenteditable=\"false\" onclick=\"resumeCustomizer.removeSkill(this)\" style=\"display:none;margin-left:4px;color:#dc2626;cursor:pointer;\">×</span></span>\n"
        
    html += """        </div>
      </div>
    </div>
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
    inject_and_save('Bold_Engineer.html', build_bold_engineer, data)
    inject_and_save('Clean_Professional.html', build_clean_professional, data)
    inject_and_save('Elegant_TwoColumn.html', build_elegant_twocolumn, data)
    inject_and_save('Photo_Header.html', build_photo_header, data)
