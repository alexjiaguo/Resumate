import { ResumeData, ExperienceItem, EducationItem, SkillItem } from '../types';

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
  static parse(text: string, fileType: string): ResumeData {
    if (fileType === 'md') {
      return this.parseMarkdown(text);
    }
    return this.parseGenericText(text);
  }

  // ========================================
  // MARKDOWN PARSER (deterministic format)
  // ========================================
  private static parseMarkdown(md: string): ResumeData {
    const lines = md.split('\n');
    const sections = this.splitMarkdownSections(lines);

    const personalInfo = this.parseMarkdownHeader(lines);
    const summary = sections['summary'] || '';
    const experience = this.parseMarkdownExperience(sections['experience'] || '');
    const education = this.parseMarkdownEducation(sections['education'] || '');
    const skills = this.parseMarkdownSkills(sections['skills'] || '');
    const languages = this.parseCommaSeparated(sections['languages'] || '');
    const certifications = this.parseCommaSeparated(sections['certifications'] || '');

    return { personalInfo, summary, experience, education, skills, languages, certifications };
  }

  private static parseMarkdownHeader(lines: string[]) {
    let fullName = '', title = '', email = '', phone = '', linkedin = '', location = '';

    // Line 0: # Full Name
    const nameLine = lines.find(l => l.startsWith('# '));
    if (nameLine) fullName = nameLine.replace(/^#\s+/, '').trim();

    // Line 1: Title | Location
    const headerLines = lines.slice(0, 6);
    for (const line of headerLines) {
      if (line.startsWith('#')) continue;
      if (line.includes('|') && !line.includes('@')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          title = parts[0];
          location = parts[1];
        }
        continue;
      }
      // Line with email/phone/linkedin
      if (line.includes('@') || line.includes('linkedin')) {
        const parts = line.split('|').map(p => p.trim());
        for (const part of parts) {
          if (part.includes('@')) email = part;
          else if (part.match(/^\+?\d[\d\s\-().]+$/)) phone = part;
          else if (part.includes('linkedin')) linkedin = part;
        }
      }
    }

    return { fullName, title, email, phone, linkedin, location };
  }

  private static splitMarkdownSections(lines: string[]): Record<string, string> {
    const sections: Record<string, string> = {};
    let currentSection = '';
    let content: string[] = [];

    for (const line of lines) {
      const sectionMatch = line.match(/^##\s+(.+)/);
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

  private static parseMarkdownExperience(text: string): ExperienceItem[] {
    if (!text.trim()) return [];
    const entries = text.split(/^###\s+/m).filter(Boolean);
    return entries.map((entry, i) => {
      const lines = entry.split('\n').filter(Boolean);
      // Line 0: Title | Company
      const headerParts = lines[0]?.split('|').map(p => p.trim()) || [];
      const title = headerParts[0] || '';
      const company = headerParts[1] || '';
      // Line 1: Dates | Location
      const metaParts = lines[1]?.split('|').map(p => p.trim()) || [];
      const dates = metaParts[0] || '';
      const location = metaParts[1] || '';
      // Remaining lines: achievements (- prefixed)
      const achievements = lines.slice(2)
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
        .map(l => l.replace(/^[\s\-•]+/, '').trim())
        .filter(Boolean);
      return { id: String(i + 1), company, title, dates, location, achievements };
    });
  }

  private static parseMarkdownEducation(text: string): EducationItem[] {
    if (!text.trim()) return [];
    const entries = text.split(/^###\s+/m).filter(Boolean);
    return entries.map((entry, i) => {
      const lines = entry.split('\n').filter(Boolean);
      const degree = lines[0]?.trim() || '';
      const metaParts = lines[1]?.split('|').map(p => p.trim()) || [];
      const school = metaParts[0] || '';
      const dates = metaParts[1] || '';
      const location = metaParts[2] || '';
      return { id: String(i + 1), school, degree, dates, location };
    });
  }

  private static parseMarkdownSkills(text: string): SkillItem[] {
    if (!text.trim()) return [];
    return text.split(',').map((s, i) => {
      const isHighlighted = s.includes('**');
      const name = s.replace(/\*\*/g, '').trim();
      return { id: String(i + 1), name, isHighlighted };
    }).filter(s => s.name);
  }

  // ========================================
  // GENERIC TEXT PARSER (PDF / DOCX / TXT)
  // ========================================
  private static parseGenericText(text: string): ResumeData {
    const sections = this.detectSections(text);
    const personalInfo = this.extractContactInfo(text);
    
    return {
      personalInfo,
      summary: sections['summary'] || sections['professional summary'] || sections['profile'] || sections['objective'] || '',
      experience: this.parseGenericExperience(sections['experience'] || sections['work experience'] || sections['professional experience'] || sections['employment'] || ''),
      education: this.parseGenericEducation(sections['education'] || sections['academic'] || ''),
      skills: this.parseGenericSkills(sections['skills'] || sections['technical skills'] || sections['core competencies'] || sections['competencies'] || ''),
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
}
