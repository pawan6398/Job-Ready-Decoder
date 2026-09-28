import { extractTextFromBuffer } from '../services/documentParserService.js';
import { Storage } from '../models/storage.js';

/**
 * Extract text from uploaded Resume (PDF or DOCX)
 * @route POST /api/upload/resume
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume document provided. Please upload a PDF or DOCX file.'
      });
    }

    const originalFilename = req.file.originalname;
    const mimetype = req.file.mimetype;
    const extractedText = await extractTextFromBuffer(req.file.buffer, originalFilename, mimetype);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded resume appears to be empty or unreadable. Please check the file and try again.'
      });
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    // Persist resume record linked to user
    const resumeRecord = await Storage.createResume({
      userId: req.user._id || req.user.id,
      originalFilename,
      extractedText
    });

    return res.json({
      success: true,
      message: 'Resume parsed successfully!',
      resumeId: resumeRecord._id || resumeRecord.id,
      originalFilename,
      wordCount,
      preview: extractedText.substring(0, 300) + '...',
      extractedText
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process resume file.'
    });
  }
};

/**
 * Extract text from uploaded Job Description (PDF, DOCX, or TXT)
 * @route POST /api/upload/job-description
 */
export const uploadJobDescription = async (req, res) => {
  try {
    let extractedText = '';
    let originalFilename = 'Pasted Job Description';

    if (req.file) {
      originalFilename = req.file.originalname;
      const mimetype = req.file.mimetype;
      extractedText = await extractTextFromBuffer(req.file.buffer, originalFilename, mimetype);
    } else if (req.body.text) {
      extractedText = req.body.text.trim();
      originalFilename = req.body.title || 'Direct Text Input';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a JD document (PDF, DOCX, TXT) or paste the job description text.'
      });
    }

    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Job description content is too short. Please provide at least 50 characters.'
      });
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    const jdRecord = await Storage.createJobDescription({
      userId: req.user._id || req.user.id,
      title: req.body.title || originalFilename,
      company: req.body.company || 'Employer',
      originalFilename,
      extractedText
    });

    return res.json({
      success: true,
      message: 'Job description parsed successfully!',
      jobDescriptionId: jdRecord._id || jdRecord.id,
      originalFilename,
      wordCount,
      preview: extractedText.substring(0, 250) + '...',
      extractedText
    });
  } catch (error) {
    console.error('JD upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process job description.'
    });
  }
};
