import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker for pdfjs - using a CDN link that matches the package version
// In a real production app, this would be bundled or served from public/
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export class FileParserService {
  static async parseFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return this.parsePdf(file);
    } else if (extension === 'docx' || extension === 'doc') {
      return this.parseDocx(file);
    } else if (extension === 'txt' || extension === 'md') {
      return file.text();
    }
    
    throw new Error(`Unsupported file type: ${extension}`);
  }

  private static async parsePdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '
';
    }
    
    return fullText;
  }

  private static async parseDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
}
