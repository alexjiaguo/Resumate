import { saveAs } from 'file-saver';
import { ResumeData } from '../types';
import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, TabStopPosition, TabStopType,
} from 'docx';

export const downloadMarkdown = (data: ResumeData) => {
  let md = `# ${data.personalInfo.fullName}\n`;
  md += `${data.personalInfo.title} | ${data.personalInfo.location}\n`;
  md += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.linkedin}\n\n`;

  md += `## Summary\n${data.summary}\n\n`;

  md += `## Experience\n`;
  data.experience.forEach(exp => {
    md += `### ${exp.title} | ${exp.company}\n`;
    md += `${exp.dates} | ${exp.location}\n`;
    exp.achievements.forEach(a => {
      md += `- ${a}\n`;
    });
    md += `\n`;
  });

  md += `## Education\n`;
  data.education.forEach(edu => {
    md += `### ${edu.degree}\n`;
    md += `${edu.school} | ${edu.dates} | ${edu.location}\n\n`;
  });

  md += `## Skills\n`;
  md += data.skills.map(s => s.isHighlighted ? `**${s.name}**` : s.name).join(', ') + '\n\n';

  md += `## Languages\n`;
  md += data.languages.join(', ') + '\n\n';

  md += `## Certifications\n`;
  md += data.certifications.join(', ') + '\n';

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.md`);
};

export const downloadHtml = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Extract all relevant styles
  let styles = '';
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let j = 0; j < rules.length; j++) {
          styles += rules[j].cssText + '\n';
        }
      } catch (e) {
        // Skip cross-origin sheets
      }
    }
  } catch (e) {
    console.error('Error reading styles:', e);
  }

  const htmlContent = 
    '<!DOCTYPE html>\n<html>\n<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <title>' + filename + '</title>\n' +
    '  <style>\n' +
    styles + '\n' +
    '    body { margin: 0; padding: 20px; display: flex; justify-content: center; background: #f0f0f0; font-family: sans-serif; }\n' +
    '    .resume-paper { background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 0 auto; }\n' +
    '    @media print {\n' +
    '      body { padding: 0; background: white; }\n' +
    '      .resume-paper { box-shadow: none; }\n' +
    '    }\n' +
    '  </style>\n' +
    '</head>\n<body>\n' +
    element.outerHTML +
    '\n</body>\n</html>';

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${filename.replace(/\s+/g, '_')}_Resume.html`);
};

export const downloadDocx = async (data: ResumeData) => {
  const sectionTitle = (text: string): Paragraph =>
    new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: 'Calibri', color: '2c3e50' })],
      spacing: { before: 240, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'd1d5db' } },
    });

  const children: Paragraph[] = [];

  // Name
  children.push(new Paragraph({
    children: [new TextRun({ text: data.personalInfo.fullName, bold: true, size: 48, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
  }));

  // Contact
  const contactParts = [
    data.personalInfo.location,
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.linkedin,
  ].filter(Boolean);
  children.push(new Paragraph({
    children: [new TextRun({ text: contactParts.join('  ·  '), size: 20, color: '666666', font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Summary
  if (data.summary) {
    children.push(sectionTitle('Summary'));
    children.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 22, font: 'Calibri' })],
      spacing: { after: 120 },
    }));
  }

  // Experience
  if (data.experience.length) {
    children.push(sectionTitle('Experience'));
    data.experience.forEach(exp => {
      children.push(new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: `${exp.title}`, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: ` — ${exp.company}`, size: 22, font: 'Calibri' }),
          new TextRun({ text: `\t${exp.dates}`, italics: true, size: 20, color: '666666', font: 'Calibri' }),
        ],
        spacing: { before: 120 },
      }));
      if (exp.location) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.location, italics: true, size: 20, color: '888888', font: 'Calibri' })],
        }));
      }
      exp.achievements.forEach(ach => {
        children.push(new Paragraph({
          children: [new TextRun({ text: ach, size: 22, font: 'Calibri' })],
          bullet: { level: 0 },
          spacing: { before: 40 },
        }));
      });
    });
  }

  // Education
  if (data.education.length) {
    children.push(sectionTitle('Education'));
    data.education.forEach(edu => {
      children.push(new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: edu.degree, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: `\t${edu.dates}`, italics: true, size: 20, color: '666666', font: 'Calibri' }),
        ],
        spacing: { before: 120 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: `${edu.school}${edu.location ? ' · ' + edu.location : ''}`, size: 20, color: '666666', font: 'Calibri' })],
      }));
    });
  }

  // Skills
  if (data.skills.length) {
    children.push(sectionTitle('Skills'));
    children.push(new Paragraph({
      children: data.skills.flatMap((s, i) => {
        const runs: TextRun[] = [];
        if (i > 0) runs.push(new TextRun({ text: ',  ', size: 22, font: 'Calibri' }));
        runs.push(new TextRun({ text: s.name, bold: s.isHighlighted, size: 22, font: 'Calibri' }));
        return runs;
      }),
      spacing: { after: 120 },
    }));
  }

  // Languages
  if (data.languages.length) {
    children.push(sectionTitle('Languages'));
    children.push(new Paragraph({
      children: [new TextRun({ text: data.languages.join(',  '), size: 22, font: 'Calibri' })],
    }));
  }

  // Certifications
  if (data.certifications.length) {
    children.push(sectionTitle('Certifications'));
    data.certifications.forEach(cert => {
      children.push(new Paragraph({
        children: [new TextRun({ text: cert, size: 22, font: 'Calibri' })],
        bullet: { level: 0 },
      }));
    });
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
};
