import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded file buffer based on MIME type or filename extension.
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} Extracted and cleaned text
 */
export async function extractTextFromBuffer(buffer, originalName = '', mimetype = '') {
  const ext = originalName.split('.').pop().toLowerCase();

  try {
    if (ext === 'pdf' || mimetype.includes('pdf')) {
      const data = await pdfParse(buffer);
      return cleanText(data.text);
    }

    if (ext === 'docx' || mimetype.includes('wordprocessingml')) {
      const result = await mammoth.extractRawText({ buffer });
      return cleanText(result.value);
    }

    if (ext === 'txt' || mimetype.includes('text/plain') || mimetype.includes('plain')) {
      return cleanText(buffer.toString('utf-8'));
    }

    // Default fallback to UTF-8 text
    return cleanText(buffer.toString('utf-8'));
  } catch (error) {
    console.error(`Document parser error for ${originalName}:`, error.message);
    throw new Error(`Failed to extract text from "${originalName}": ${error.message}`);
  }
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text = '') {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ') // Strip non-printable ASCII except newlines
    .replace(/\n{3,}/g, '\n\n')      // Collapse multi-blank lines
    .trim();
}
