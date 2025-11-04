// Client-side PDF text extraction using pdf.js
// Note: This only works in the browser, not in Node.js

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error("PDF extraction only works in the browser");
  }

  try {
    // Dynamically import pdf.js only in browser
    const pdfjs = await import('pdfjs-dist');
    
    // Set worker source
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function extractMetadataFromPdf(file: File): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error("PDF extraction only works in the browser");
  }

  try {
    const pdfjs = await import('pdfjs-dist');
    
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdfDocument.getMetadata();
    
    return metadata.info;
  } catch (error) {
    console.error("PDF metadata extraction error:", error);
    throw new Error(`Failed to extract PDF metadata: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Alias for compatibility
export const extractTextFromPdf = extractTextFromPDF;

