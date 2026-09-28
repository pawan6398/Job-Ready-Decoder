import express from 'express';
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
  updateSkillClassification,
  selectTopQuestions,
  updateInterviewQuestionAnswer,
  toggleLearningPlanTask,
  loadDemoAnalysis
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

// Upload fields for analysis multipart upload
const analysisUploadFields = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jd1', maxCount: 1 },
  { name: 'jd2', maxCount: 1 },
  { name: 'jd3', maxCount: 1 }
]);

router.post('/', aiLimiter, analysisUploadFields, createAnalysis);
router.post('/demo', loadDemoAnalysis);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

// Skill classification updates
router.patch('/:id/skills/:skillId', updateSkillClassification);

// Interview questions and answers
router.post('/:id/interview-questions', selectTopQuestions);
router.patch('/:id/interview-questions/:questionId', updateInterviewQuestionAnswer);

// 30-Day Learning Plan
router.patch('/:id/learning-plan/tasks/:taskId', toggleLearningPlanTask);

export default router;
