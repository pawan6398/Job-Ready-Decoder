import express from 'express';
import { uploadResume, uploadJobDescription } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/resume', upload.single('resume'), uploadResume);
router.post('/job-description', upload.single('file'), uploadJobDescription);

export default router;
