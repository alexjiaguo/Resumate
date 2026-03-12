import * as pdfjs from 'pdfjs-dist';

// Set up worker for pdfjs - using a CDN link that matches the package version
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

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
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => {
            const str = item.str || '';
            // Add space if the item doesn't end with a space and next item starts on same line
            return item.hasEOL ? str + '\n' : str;
          })
          .join(' ')
          .replace(/  +/g, ' ')  // collapse multiple spaces
          .trim();
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (err) {
      throw new Error(`PDF parsing failed: ${err instanceof Error ? err.message : String(err)}. The PDF may be image-based or corrupt.`);
    }
  }

  private static async parseDocx(file: File): Promise<string> {
    try {
      // Dynamically import mammoth only when needed
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (err) {
      throw new Error(`DOCX parsing failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
