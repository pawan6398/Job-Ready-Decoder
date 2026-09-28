import multer from 'multer';

// Use memory storage so document parser can immediately process buffer
const storage = multer.memoryStorage();

// Allowed file extensions and MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
];

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop().toLowerCase();
  const isAllowedExt = ['pdf', 'docx', 'doc', 'txt'].includes(ext);
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.startsWith('text/');

  if (isAllowedExt || isAllowedMime) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file format "${ext}". Please upload PDF, DOCX, or TXT documents.`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});
