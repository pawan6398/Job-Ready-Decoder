import express from 'express';
import { register, login, getMe, demoLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/demo', demoLogin);
router.get('/me', protect, getMe);

export default router;
