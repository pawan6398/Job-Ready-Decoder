import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { isMemoryStore, loadStore, saveStore } from '../config/db.js';
import User from './User.js';
import JobDescription from './JobDescription.js';
import Resume from './Resume.js';
import Analysis from './Analysis.js';

// Unified repository to guarantee rock-solid operation whether MongoDB is connected or running local persistent fallback
export const Storage = {
  // USER METHODS
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await User.findOne({ email: cleanEmail });
    }
    const store = loadStore();
    return store.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await User.findById(id).select('-password');
    }
    const store = loadStore();
    const user = store.users.find((u) => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ name, email, password }) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await User.create({ name, email, password });
    }
    const store = loadStore();
    const newUser = {
      _id: uuidv4(),
      name,
      email: email.toLowerCase().trim(),
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  // RESUME METHODS
  async createResume({ userId, originalFilename, extractedText, skillsFound = [] }) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Resume.create({ userId, originalFilename, extractedText, skillsFound });
    }
    const store = loadStore();
    const newResume = {
      _id: uuidv4(),
      userId: userId.toString(),
      originalFilename,
      extractedText,
      skillsFound,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.resumes.push(newResume);
    saveStore(store);
    return newResume;
  },

  // JOB DESCRIPTION METHODS
  async createJobDescription({ userId, title, company, originalFilename, extractedText, skillsFound = [] }) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await JobDescription.create({ userId, title, company, originalFilename, extractedText, skillsFound });
    }
    const store = loadStore();
    const newJD = {
      _id: uuidv4(),
      userId: userId.toString(),
      title: title || 'Target Role JD',
      company: company || 'Employer',
      originalFilename: originalFilename || 'Job Description',
      extractedText,
      skillsFound,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.jobDescriptions.push(newJD);
    saveStore(store);
    return newJD;
  },

  // ANALYSIS METHODS
  async createAnalysis(analysisData) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Analysis.create(analysisData);
    }
    const store = loadStore();
    const newAnalysis = {
      _id: uuidv4(),
      ...analysisData,
      userId: analysisData.userId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.analyses.push(newAnalysis);
    saveStore(store);
    return newAnalysis;
  },

  async findAnalysesByUserId(userId) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Analysis.find({ userId }).sort({ createdAt: -1 });
    }
    const store = loadStore();
    const uid = userId.toString();
    return store.analyses
      .filter((a) => a.userId === uid)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findAnalysisById(id) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Analysis.findById(id);
    }
    const store = loadStore();
    return store.analyses.find((a) => a._id === id || a.id === id) || null;
  },

  async updateAnalysis(id, updateData) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Analysis.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
    }
    const store = loadStore();
    const index = store.analyses.findIndex((a) => a._id === id || a.id === id);
    if (index === -1) return null;
    store.analyses[index] = {
      ...store.analyses[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveStore(store);
    return store.analyses[index];
  },

  async deleteAnalysis(id, userId) {
    if (!isMemoryStore && mongoose.connection.readyState === 1) {
      return await Analysis.findOneAndDelete({ _id: id, userId });
    }
    const store = loadStore();
    const uid = userId.toString();
    const index = store.analyses.findIndex((a) => (a._id === id || a.id === id) && a.userId === uid);
    if (index === -1) return false;
    store.analyses.splice(index, 1);
    saveStore(store);
    return true;
  }
};
