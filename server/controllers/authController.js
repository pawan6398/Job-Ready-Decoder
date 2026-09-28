import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Storage } from '../models/storage.js';

const generateToken = (userId, email, name) => {
  const secret = process.env.JWT_SECRET || 'job_ready_decoder_super_secret_jwt_key_2026_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, email, name }, secret, { expiresIn });
};

/**
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length.'
      });
    }

    const existingUser = await Storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Storage.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(newUser._id || newUser.id, newUser.email, newUser.name);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error. Please try again.'
    });
  }
};

/**
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    const user = await Storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const token = generateToken(user._id || user.id, user.email, user.name);

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to a server error. Please try again.'
    });
  }
};

/**
 * @route GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await Storage.findUserById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.'
    });
  }
};

/**
 * 1-Click Demo Login for quick testing & recruiter walkthroughs
 * @route POST /api/auth/demo
 */
export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'alex.morgan.demo@jobreadydecoder.com';
    let user = await Storage.findUserByEmail(demoEmail);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('DemoPassword2026!', salt);
      user = await Storage.createUser({
        name: 'Alex Morgan (Demo User)',
        email: demoEmail,
        password: hashedPassword
      });
    }

    const token = generateToken(user._id || user.id, user.email, user.name);

    return res.json({
      success: true,
      message: 'Logged in as Demo User!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Demo login failed.'
    });
  }
};
