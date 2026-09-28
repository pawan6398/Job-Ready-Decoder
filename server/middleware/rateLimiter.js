import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for auth
  message: {
    success: false,
    message: 'Too many authentication requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // standard API limit
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60, // 60 requests per 10 minutes for heavy analysis
  message: {
    success: false,
    message: 'Analysis request rate limit reached. Please wait a few moments before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
