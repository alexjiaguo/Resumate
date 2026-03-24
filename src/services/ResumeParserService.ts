import { ResumeData, ExperienceItem, EducationItem, SkillItem, TechnicalSkillCategory } from '../types';

/**
 * Parses raw text (from MD, PDF, or DOCX) into a structured ResumeData object.
 * MD files use deterministic heading-based parsing.
 * PDF/DOCX use heuristic section detection with common resume heading patterns.
 */
export class ResumeParserService {
  
  /**
   * Main entry point: parse raw text into ResumeData.
   * @param text - Raw text content from a resume file
   * @param fileType - 'md' | 'pdf' | 'docx' | 'txt'
   */
  static parse(text: string, fileType: string): Partial<ResumeData> {
    if (fileType === 'md') {
      return this.parseMarkdown(text);
    }
    return this.parseGenericText(text);
  }

  // ========================================
  // MARKDOWN PARSER (deterministic format)
  // ========================================
  private static parseMarkdown(md: string): Partial<ResumeData> {
    const lines = md.split('\n');
    const sections = this.splitMarkdownSections(lines);

    const personalInfo = this.parseMarkdownHeader(lines);
    // Try multiple common section name variants
    const summary = sections['professional summary'] || sections['summary'] || sections['profile'] || sections['objective'] || '';
    const experience = this.parseMarkdownExperience(sections['professional experience'] || sections['experience'] || sections['work experience'] || sections['employment'] || '');
    const education = this.parseMarkdownEducation(sections['education'] || sections['academic'] || '');
    const skills = this.parseMarkdownSkills(sections['skills'] || sections['key skills'] || sections['core competencies'] || '');
    const languages = this.parseLanguages(sections['languages'] || '');
    const certifications = this.parseBulletList(sections['training & certifications'] || sections['certifications & training'] || sections['certifications'] || sections['training'] || '');
    const technicalSkills = this.parseTechnicalSkills(sections['technical skills'] || sections['skills'] || '');

    return { personalInfo, summary, experience, education, skills, technicalSkills, languages, certifications };
  }

  private static parseMarkdownHeader(lines: string[]) {
    let fullName = '', title = '', email = '', phone = '', linkedin = '', location = '';

    // Strip emoji from text for cleaner parsing
    const stripEmoji = (s: string) => s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{2BFF}\u{FE00}-\u{FEFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').trim();

    // # Full Name (H1)
    const nameLine = lines.find(l => l.match(/^#\s+[^#]/));
    if (nameLine) fullName = nameLine.replace(/^#\s+/, '').trim();

    // ## Job Title (H2 — often the line right after H1)
    const titleLine = lines.find(l => l.match(/^##\s+[^#]/));
    if (titleLine) title = titleLine.replace(/^##\s+/, '').trim();

    // Scan first 10 lines for contact info (pipe-separated, with or without emoji)
    const headerLines = lines.slice(0, 10);
    for (const rawLine of headerLines) {
      if (rawLine.match(/^#{1,3}\s/)) continue; // Skip headings
      const line = stripEmoji(rawLine);
      
      // Look for pipe-separated contact line
      if (line.includes('|') && (line.includes('@') || line.includes('linkedin') || line.match(/\+?\d{2,}/))) {
        const parts = line.split('|').map(p => p.trim());
        for (const part of parts) {
          const clean = part.trim();
          if (!clean) continue;
          if (clean.includes('@') && clean.includes('.')) email = clean;
          else if (clean.match(/\+?\d[\d\s\-().]{6,}/)) phone = clean;
          else if (clean.match(/linkedin/i) || clean.match(/www\./i)) linkedin = clean;
          else if (!title && !clean.match(/[|@]/) && clean.length > 3) location = clean;
          // Look for location patterns (City, Country/State)
          else if (clean.match(/^\w[\w\s]+,\s*\w/)) location = clean;
        }
      }
    }

    // Fallback: if title wasn't found as H2, look for non-heading, non-contact lines
    if (!title) {
      for (const line of headerLines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.includes('@') || trimmed.includes('|')) continue;
        if (trimmed.match(/\*\*(.+)\*\*/)) {
          title = trimmed.replace(/\*\*/g, '').trim();
          break;
        }
      }
    }

    return { fullName, title, email, phone, linkedin, location };
  }

  /**
   * Split markdown into sections. Handles ## and ### as section headings.
   * Detects which heading level is used for top-level sections and parses accordingly.
   */
  private static splitMarkdownSections(lines: string[]): Record<string, string> {
    const sections: Record<string, string> = {};
    let currentSection = '';
    let content: string[] = [];

    // Determine if sections use ## or ### — find the first heading after the header area
    let sectionLevel = 2;
    const knownSections = /summary|experience|education|skills|languages|certifications|training|profile|objective|competencies|employment|projects/i;
    for (const line of lines) {
      const m3 = line.match(/^###\s+(.+)/);
      const m2 = line.match(/^##\s+(.+)/);
      if (m3 && knownSections.test(m3[1])) { sectionLevel = 3; break; }
      if (m2 && knownSections.test(m2[1])) { sectionLevel = 2; break; }
    }

    const sectionRegex = sectionLevel === 3 ? /^###\s+(.+)/ : /^##\s+(.+)/;

    for (const line of lines) {
      const sectionMatch = line.match(sectionRegex);
      if (sectionMatch) {
        if (currentSection) {
          sections[currentSection] = content.join('\n').trim();
        }
        currentSection = sectionMatch[1].toLowerCase().trim();
        content = [];
      } else if (currentSection) {
        content.push(line);
      }
    }
    if (currentSection) {
      sections[currentSection] = content.join('\n').trim();
    }
    return sections;
  }

  /**
   * Parse experience that may use ### or #### sub-headings for individual roles.
   * Handles formats:
   *   #### Title | Company\n*Dates | Location*
   *   ### Title | Company\nDates | Location
   */
  private static parseMarkdownExperience(text: string): ExperienceItem[] {
    if (!text.trim()) return [];
    // Split on ### or #### (whichever is used for sub-entries)
    const entries = text.split(/^#{3,4}\s+/m).filter(Boolean);
    return entries.map((entry, i) => {
      const lines = entry.split('\n').filter(Boolean);
      // Line 0: Title | Company  (pipe-separated)
      const headerParts = lines[0]?.split('|').map(p => p.trim()) || [];
      const title = headerParts[0] || '';
      const company = headerParts[1] || '';
      // Line 1: *Dates | Location* — strip markdown italic markers
      const metaRaw = (lines[1] || '').replace(/^\*+|\*+$/g, '').trim();
      const metaParts = metaRaw.split('|').map(p => p.trim());
      const dates = metaParts[0] || '';
      const location = metaParts[1] || '';
      // Remaining lines: achievements (- or • prefixed)
      const achievements = lines.slice(2)
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
        .map(l => l.replace(/^[\s\-•]+/, '').trim())
        .filter(Boolean);
      return { id: String(i + 1), company, title, dates, location, achievements };
    });
  }

  /**
   * Parse education - handles both sub-heading format and bullet-list format:
   *   - **M.S., Electrical Engineering**, University (Sep 2014 – Jul 2017)
   */
  private static parseMarkdownEducation(text: string): EducationItem[] {
    if (!text.trim()) return [];
    
    // Check if education uses bullet list format
    const bulletLines = text.split('\n').filter(l => l.trim().match(/^[-•]\s/));
    if (bulletLines.length > 0) {
      return bulletLines.map((line, i) => {
        const clean = line.replace(/^[\s\-•]+/, '').trim();
        // Try: **Degree**, School (Dates)
        const m = clean.match(/\*\*(.+?)\*\*,?\s*(.+?)(?:\s*\((.+?)\))?$/);
        if (m) {
          return { id: String(i + 1), degree: m[1].trim(), school: m[2].trim(), dates: m[3]?.trim() || '', location: '' };
        }
        // Fallback: just use the whole line
        return { id: String(i + 1), degree: clean, school: '', dates: '', location: '' };
      });
    }

    // Sub-heading format: ### Degree\nSchool | Dates | Location
    const entries = text.split(/^#{3,4}\s+/m).filter(Boolean);
    return entries.map((entry, i) => {
      const lines = entry.split('\n').filter(Boolean);
      const degree = lines[0]?.trim() || '';
      const metaParts = (lines[1] || '').split('|').map(p => p.trim());
      const school = metaParts[0] || '';
      const dates = metaParts[1] || '';
      const location = metaParts[2] || '';
      return { id: String(i + 1), school, degree, dates, location };
    });
  }

  /**
   * Parse skills from markdown. Handles:
   *   - Comma-separated: React, TypeScript, Node.js
   *   - Bullet list with categories: - **Category**: skill1, skill2
   *   - Plain bullet list: - React\n- TypeScript
   */
  private static parseMarkdownSkills(text: string): SkillItem[] {
    if (!text.trim()) return [];
    const lines = text.split('\n').filter(l => l.trim());
    const skills: SkillItem[] = [];
    let idCounter = 1;

    for (const line of lines) {
      const trimmed = line.replace(/^[\s\-•*]+/, '').trim();
      // "**Category**: skill1, skill2" → extract individual skills
      const catMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.+)/);
      if (catMatch) {
        const items = catMatch[2].split(',').map(s => s.trim()).filter(Boolean);
        for (const name of items) {
          skills.push({ id: String(idCounter++), name, isHighlighted: false });
        }
      } else if (trimmed.includes(',')) {
        // Comma-separated on one line
        const items = trimmed.split(',').map(s => s.replace(/\*\*/g, '').trim()).filter(Boolean);
        for (const name of items) {
          skills.push({ id: String(idCounter++), name, isHighlighted: name.includes('**') });
        }
      } else if (trimmed) {
        skills.push({ id: String(idCounter++), name: trimmed.replace(/\*\*/g, ''), isHighlighted: trimmed.includes('**') });
      }
    }
    return skills;
  }

  /**
   * Parse languages from bullet list. Handles:
   *   - **English**: Fluent (TOEFL: 103)
   *   - English (Fluent)
   */
  private static parseLanguages(text: string): string[] {
    if (!text.trim()) return [];
    return text.split('\n')
      .map(l => l.replace(/^[\s\-•]+/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean);
  }

  /**
   * Parse a section into a simple list of strings (for certifications, etc.)
   */
  private static parseBulletList(text: string): string[] {
    if (!text.trim()) return [];
    return text.split('\n')
      .map(l => l.replace(/^[\s\-•]+/, '').trim())
      .filter(Boolean);
  }

  // ========================================
  // GENERIC TEXT PARSER (PDF / DOCX / TXT)
  // ========================================
  private static parseGenericText(text: string): Partial<ResumeData> {
    const sections = this.detectSections(text);
    const personalInfo = this.extractContactInfo(text);
    
    return {
      personalInfo,
      summary: sections['summary'] || sections['professional summary'] || sections['profile'] || sections['objective'] || '',
      experience: this.parseGenericExperience(sections['experience'] || sections['work experience'] || sections['professional experience'] || sections['employment'] || ''),
      education: this.parseGenericEducation(sections['education'] || sections['academic'] || ''),
      skills: this.parseGenericSkills(sections['skills'] || sections['technical skills'] || sections['core competencies'] || sections['competencies'] || ''),
      technicalSkills: this.parseTechnicalSkills(sections['technical skills'] || sections['skills'] || ''),
      languages: this.parseCommaSeparated(sections['languages'] || ''),
      certifications: this.parseCommaSeparated(sections['certifications'] || sections['certificates'] || sections['licenses'] || ''),
    };
  }

  /**
   * Detect sections by looking for common resume heading patterns:
   * - ALL CAPS lines
   * - Lines followed by a line of dashes/equals
   * - Short lines (< 40 chars) that match known section names
   */
  private static detectSections(text: string): Record<string, string> {
    const lines = text.split('\n');
    const sectionKeywords = [
      'summary', 'professional summary', 'profile', 'objective', 'about',
      'experience', 'work experience', 'professional experience', 'employment', 'work history',
      'education', 'academic', 'academic background',
      'skills', 'technical skills', 'core competencies', 'competencies', 'technologies',
      'languages', 'certifications', 'certificates', 'licenses', 'awards',
      'projects', 'publications', 'volunteer', 'interests'
    ];

    const sections: Record<string, string> = {};
    let currentSection = '';
    let content: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase().replace(/[:\-—_|]/g, '').trim();
      
      // Check if this line is a section heading
      const isHeading = (
        // Matches a known section keyword
        sectionKeywords.some(k => lowerLine === k) ||
        // ALL CAPS line that's short enough to be a heading
        (line.length > 2 && line.length < 40 && line === line.toUpperCase() && /[A-Z]/.test(line) && sectionKeywords.some(k => lowerLine.includes(k)))
      );

      if (isHeading) {
        if (currentSection) {
          sections[currentSection] = content.join('\n').trim();
        }
        // Normalize the section name
        currentSection = sectionKeywords.find(k => lowerLine.includes(k)) || lowerLine;
        content = [];
      } else if (currentSection) {
        content.push(lines[i]);
      }
    }
    if (currentSection) {
      sections[currentSection] = content.join('\n').trim();
    }
    return sections;
  }

  private static extractContactInfo(text: string) {
    const firstLines = text.split('\n').slice(0, 10).join('\n');
    
    // Extract email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Extract LinkedIn
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/[\w-]+|linkedin\.com\/[\w-]+)/i);
    const linkedin = linkedinMatch ? linkedinMatch[0] : '';

    // Extract name: usually the first non-empty, non-contact line
    const lines = firstLines.split('\n').map(l => l.trim()).filter(Boolean);
    let fullName = '';
    let title = '';
    let location = '';

    for (const line of lines) {
      if (line.includes('@') || line.match(/^\+?\d/) || line.toLowerCase().includes('linkedin')) continue;
      if (!fullName) {
        fullName = line.replace(/[#*]/g, '').trim();
        continue;
      }
      if (!title) {
        // Second non-contact line is likely the title
        const parts = line.split(/[|,·]/).map(p => p.trim());
        title = parts[0] || '';
        if (parts.length > 1) location = parts[parts.length - 1];
        continue;
      }
      // Try to extract location from remaining header lines
      if (!location && (line.toLowerCase().includes('ca') || line.includes(','))) {
        location = line;
      }
    }

    return { fullName, title, email, phone, linkedin, location };
  }

  private static parseGenericExperience(text: string): ExperienceItem[] {
    if (!text.trim()) return [];
    
    // Split by date patterns (Jan 2020 – Present, 2020-2023, etc.)
    const datePattern = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.,]*\d{4}|2\d{3})\s*[–\-—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.,]*\d{4}|2\d{3}|Present|Current)/gi;
    
    const lines = text.split('\n');
    const entries: ExperienceItem[] = [];
    let currentEntry: Partial<ExperienceItem> | null = null;
    let achievements: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const dateMatch = trimmed.match(datePattern);
      
      // Check if this looks like a new entry (has a date range)
      if (dateMatch) {
        // Save previous entry
        if (currentEntry) {
          entries.push({
            id: String(entries.length + 1),
            company: currentEntry.company || '',
            title: currentEntry.title || '',
            dates: currentEntry.dates || '',
            location: currentEntry.location || '',
            achievements: [...achievements],
          });
        }
        
        const dates = dateMatch[0];
        const beforeDate = trimmed.replace(dates, '').trim().replace(/[|,·]/g, '').trim();
        
        currentEntry = { dates };
        achievements = [];
        
        if (beforeDate) {
          // Could be company or title or location
          const parts = beforeDate.split(/[|,·]/).map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            currentEntry.title = parts[0];
            currentEntry.company = parts[1];
          } else {
            currentEntry.company = parts[0];
          }
        }
        continue;
      }

      // Check if it's a bullet point (achievement)
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.match(/^\d+\./)) {
        achievements.push(trimmed.replace(/^[\-•*\d.)\s]+/, '').trim());
        continue;
      }

      // Non-bullet, non-date line — could be title/company
      if (currentEntry && !currentEntry.title) {
        currentEntry.title = trimmed;
      } else if (currentEntry && !currentEntry.company) {
        currentEntry.company = trimmed;
      }
    }

    // Don't forget the last entry
    if (currentEntry) {
      entries.push({
        id: String(entries.length + 1),
        company: currentEntry.company || '',
        title: currentEntry.title || '',
        dates: currentEntry.dates || '',
        location: currentEntry.location || '',
        achievements: [...achievements],
      });
    }

    return entries;
  }

  private static parseGenericEducation(text: string): EducationItem[] {
    if (!text.trim()) return [];
    const lines = text.split('\n').filter(l => l.trim());
    const entries: EducationItem[] = [];
    let currentEntry: Partial<EducationItem> = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      const dateMatch = trimmed.match(/\b(20\d{2}|19\d{2})\s*[–\-—to]+\s*(20\d{2}|19\d{2}|Present|Current)\b/i);
      
      if (dateMatch) {
        if (currentEntry.degree || currentEntry.school) {
          currentEntry.dates = dateMatch[0];
          // Rest of line minus the date could be location
          const rest = trimmed.replace(dateMatch[0], '').replace(/[|,·]/g, '').trim();
          if (rest && !currentEntry.location) currentEntry.location = rest;
          
          entries.push({
            id: String(entries.length + 1),
            school: currentEntry.school || '',
            degree: currentEntry.degree || '',
            dates: currentEntry.dates || '',
            location: currentEntry.location || '',
          });
          currentEntry = {};
        }
        continue;
      }
      
      // Heuristic: lines with "University", "College", "School", "Institute" are schools
      if (trimmed.match(/\b(university|college|school|institute|academy)\b/i)) {
        if (currentEntry.school) {
          // Push previous if incomplete
          entries.push({
            id: String(entries.length + 1),
            school: currentEntry.school || '',
            degree: currentEntry.degree || '',
            dates: currentEntry.dates || '',
            location: currentEntry.location || '',
          });
          currentEntry = {};
        }
        currentEntry.school = trimmed;
      } else if (trimmed.match(/\b(B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D|MBA|Bachelor|Master|Doctor|Diploma|Certificate|Associate)\b/i)) {
        currentEntry.degree = trimmed;
      } else if (!currentEntry.school) {
        currentEntry.school = trimmed;
      } else if (!currentEntry.degree) {
        currentEntry.degree = trimmed;
      }
    }
    
    // Handle last entry
    if (currentEntry.school || currentEntry.degree) {
      entries.push({
        id: String(entries.length + 1),
        school: currentEntry.school || '',
        degree: currentEntry.degree || '',
        dates: currentEntry.dates || '',
        location: currentEntry.location || '',
      });
    }

    return entries;
  }

  private static parseGenericSkills(text: string): SkillItem[] {
    if (!text.trim()) return [];
    // Try comma-separated first, then bullet/newline separated
    let items: string[];
    if (text.includes(',')) {
      items = text.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      items = text.split(/[\n•\-*]/).map(s => s.trim()).filter(Boolean);
    }
    // Flatten any "Category: Skill1, Skill2" patterns
    const flat: string[] = [];
    for (const item of items) {
      if (item.includes(':')) {
        const [, skills] = item.split(':');
        if (skills) {
          flat.push(...skills.split(',').map(s => s.trim()).filter(Boolean));
        }
      } else {
        flat.push(item);
      }
    }
    return flat.slice(0, 30).map((name, i) => ({
      id: String(i + 1),
      name: name.replace(/\*\*/g, '').trim(),
      isHighlighted: false,
    }));
  }

  private static parseCommaSeparated(text: string): string[] {
    if (!text.trim()) return [];
    // Try comma-separated, then newline/bullet separated
    if (text.includes(',')) {
      return text.split(',').map(s => s.trim()).filter(Boolean);
    }
    return text.split(/[\n•\-]/).map(s => s.trim()).filter(Boolean);
  }

  /**
   * Parse "Category: Skill1, Skill2" patterns into TechnicalSkillCategory[]
   */
  private static parseTechnicalSkills(text: string): TechnicalSkillCategory[] {
    if (!text.trim()) return [];
    const categories: TechnicalSkillCategory[] = [];
    const lines = text.split('\n').filter(l => l.trim());

    for (const line of lines) {
      const trimmed = line.replace(/^[\-•*]\s*/, '').trim();
      // Match "Category: skill1, skill2, skill3" or "**Category:** skill1, skill2"
      const match = trimmed.match(/^\**([^:*]+)\**:\s*(.+)/);
      if (match) {
        categories.push({
          id: String(categories.length + 1),
          category: match[1].trim(),
          skills: match[2].trim(),
        });
      }
    }
    return categories;
  }
}
