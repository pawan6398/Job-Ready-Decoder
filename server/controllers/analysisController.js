import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../models/storage.js';
import { analyzeJobDescriptions } from '../services/jobAnalysisService.js';
import { generateInterviewQuestions, generateAnswersForSelectedQuestions } from '../services/interviewService.js';
import { generateLearningPlan } from '../services/learningPlanService.js';
import { extractTextFromBuffer } from '../services/documentParserService.js';
import { getSampleAnalysisData } from '../services/demoData.js';

/**
 * Create a new Job-Ready Analysis
 * @route POST /api/analysis
 */
export const createAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let { targetRole, resumeText, resumeOriginalName, jobDescriptions, isDemo } = req.body;

    // Handle instant demo seed
    if (isDemo) {
      const demoData = getSampleAnalysisData(userId);
      const saved = await Storage.createAnalysis(demoData);
      return res.status(201).json({
        success: true,
        message: 'Demo analysis loaded successfully!',
        analysis: saved
      });
    }

    // Handle multipart uploads if files are attached
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        const file = req.files.resume[0];
        resumeOriginalName = file.originalname;
        resumeText = await extractTextFromBuffer(file.buffer, file.originalname, file.mimetype);
      }

      jobDescriptions = [];
      for (let i = 1; i <= 3; i++) {
        const fileField = req.files[`jd${i}`];
        const textField = req.body[`jd${i}Text`];
        const titleField = req.body[`jd${i}Title`] || `Job Description ${i}`;
        const companyField = req.body[`jd${i}Company`] || `Company ${i}`;

        let text = '';
        let filename = `Job Description ${i}`;

        if (fileField && fileField[0]) {
          filename = fileField[0].originalname;
          text = await extractTextFromBuffer(fileField[0].buffer, filename, fileField[0].mimetype);
        } else if (textField) {
          text = textField.trim();
        }

        if (text) {
          jobDescriptions.push({
            id: uuidv4(),
            title: titleField,
            company: companyField,
            filename,
            text
          });
        }
      }
    }

    // Validation
    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a target role.'
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Valid resume content is required (minimum 50 characters).'
      });
    }

    if (!jobDescriptions || jobDescriptions.length !== 3) {
      return res.status(400).json({
        success: false,
        message: `Exactly 3 job descriptions are required. Received ${jobDescriptions ? jobDescriptions.length : 0}.`
      });
    }

    // Ensure all 3 have content
    for (let i = 0; i < 3; i++) {
      if (!jobDescriptions[i].text || jobDescriptions[i].text.trim().length < 50) {
        return res.status(400).json({
          success: false,
          message: `Job Description ${i + 1} is empty or too short. Please provide complete text.`
        });
      }
    }

    // 1. Skill Frequency & 4-Column Resume Matching
    const recurringSkills = await analyzeJobDescriptions({
      targetRole,
      resumeText,
      jobDescriptions
    });

    // 2. Generate 8 Likely Interview Questions
    const interviewQuestions = await generateInterviewQuestions({
      targetRole,
      resumeText,
      recurringSkills,
      jobDescriptions
    });

    // 3. Generate Realistic 30-Day Learning Plan
    const learningPlan = await generateLearningPlan({
      targetRole,
      recurringSkills
    });

    // Default select first 3 questions and generate initial draft answers
    const defaultSelected = interviewQuestions.slice(0, 3).map((q) => q.id);
    const answers = await generateAnswersForSelectedQuestions({
      selectedQuestionIds: defaultSelected,
      allQuestions: interviewQuestions,
      targetRole,
      resumeText,
      recurringSkills
    });

    // Save Analysis to persistence layer
    const analysisData = {
      userId,
      targetRole: targetRole.trim(),
      resumeOriginalName: resumeOriginalName || 'Uploaded Resume',
      resumeText,
      jobDescriptions,
      recurringSkills,
      interviewQuestions,
      selectedQuestions: defaultSelected,
      answers,
      learningPlan
    };

    const newAnalysis = await Storage.createAnalysis(analysisData);

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully!',
      analysis: newAnalysis
    });
  } catch (error) {
    console.error('Create analysis error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete job description analysis.'
    });
  }
};

/**
 * List all analyses for current user
 * @route GET /api/analysis
 */
export const getAnalyses = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const analyses = await Storage.findAnalysesByUserId(userId);
    return res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analyses.'
    });
  }
};

/**
 * Get single analysis by ID
 * @route GET /api/analysis/:id
 */
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Storage.findAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.'
      });
    }

    const currentUserId = (req.user._id || req.user.id).toString();
    const ownerId = (analysis.userId || '').toString();

    if (ownerId && ownerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this analysis.'
      });
    }

    return res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Get analysis by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis.'
    });
  }
};

/**
 * Delete analysis
 * @route DELETE /api/analysis/:id
 */
export const deleteAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const deleted = await Storage.deleteAnalysis(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found or could not be deleted.'
      });
    }

    return res.json({
      success: true,
      message: 'Analysis deleted successfully.'
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete analysis.'
    });
  }
};

/**
 * Update Skill Classification (Already Have, Need to Learn, Need to Demonstrate, Not Important for Me)
 * @route PATCH /api/analysis/:id/skills/:skillId
 */
export const updateSkillClassification = async (req, res) => {
  try {
    const { id, skillId } = req.params;
    const { classification, evidence, userNote } = req.body;

    const analysis = await Storage.findAnalysisById(id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    const validClassifications = [
      'Already Have',
      'Need to Learn',
      'Need to Demonstrate',
      'Not Important for Me'
    ];

    if (classification && !validClassifications.includes(classification)) {
      return res.status(400).json({
        success: false,
        message: `Invalid classification. Must be one of: ${validClassifications.join(', ')}`
      });
    }

    const skills = [...(analysis.recurringSkills || [])];
    const skillIndex = skills.findIndex((s) => s.id === skillId || s._id === skillId);

    if (skillIndex === -1) {
      return res.status(404).json({ success: false, message: 'Skill not found in this analysis.' });
    }

    skills[skillIndex] = {
      ...skills[skillIndex],
      ...(classification ? { classification } : {}),
      ...(evidence !== undefined ? { evidence } : {}),
      ...(userNote !== undefined ? { userNote } : {})
    };

    const updated = await Storage.updateAnalysis(id, { recurringSkills: skills });

    return res.json({
      success: true,
      message: 'Skill classification updated!',
      skill: skills[skillIndex],
      analysis: updated
    });
  } catch (error) {
    console.error('Update skill error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update skill classification.'
    });
  }
};

/**
 * Select Top 3 Interview Questions and Generate Grounded Answers
 * @route POST /api/analysis/:id/interview-questions
 */
export const selectTopQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedQuestionIds } = req.body;

    if (!selectedQuestionIds || !Array.isArray(selectedQuestionIds) || selectedQuestionIds.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Please select exactly 3 interview questions.'
      });
    }

    const analysis = await Storage.findAnalysisById(id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    const answers = await generateAnswersForSelectedQuestions({
      selectedQuestionIds,
      allQuestions: analysis.interviewQuestions || [],
      targetRole: analysis.targetRole,
      resumeText: analysis.resumeText,
      recurringSkills: analysis.recurringSkills || []
    });

    const updated = await Storage.updateAnalysis(id, {
      selectedQuestions: selectedQuestionIds,
      answers
    });

    return res.json({
      success: true,
      message: 'Answers generated for top 3 questions!',
      selectedQuestions: selectedQuestionIds,
      answers,
      analysis: updated
    });
  } catch (error) {
    console.error('Select questions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate answers for selected questions.'
    });
  }
};

/**
 * Update User Answer and Confidence Rating
 * @route PATCH /api/analysis/:id/interview-questions/:questionId
 */
export const updateInterviewQuestionAnswer = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { userEditedAnswer, confidenceRating } = req.body;

    const analysis = await Storage.findAnalysisById(id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    const answers = [...(analysis.answers || [])];
    const answerIndex = answers.findIndex((a) => a.questionId === questionId || a.id === questionId);

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Answer record not found for this question.'
      });
    }

    const validRatings = ['Low', 'Medium', 'High'];
    if (confidenceRating && !validRatings.includes(confidenceRating)) {
      return res.status(400).json({
        success: false,
        message: 'Confidence rating must be Low, Medium, or High.'
      });
    }

    answers[answerIndex] = {
      ...answers[answerIndex],
      ...(userEditedAnswer !== undefined ? { userEditedAnswer } : {}),
      ...(confidenceRating ? { confidenceRating } : {})
    };

    const updated = await Storage.updateAnalysis(id, { answers });

    return res.json({
      success: true,
      message: 'Answer updated successfully!',
      answer: answers[answerIndex],
      analysis: updated
    });
  } catch (error) {
    console.error('Update answer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update interview answer.'
    });
  }
};

/**
 * Toggle Task Completion in Learning Plan
 * @route PATCH /api/analysis/:id/learning-plan/tasks/:taskId
 */
export const toggleLearningPlanTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { completed } = req.body;

    const analysis = await Storage.findAnalysisById(id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    const plan = JSON.parse(JSON.stringify(analysis.learningPlan || { weeks: [] }));
    let taskFound = false;

    // Search in weeks
    for (const week of plan.weeks || []) {
      for (const task of week.tasks || []) {
        if (task.id === taskId || task._id === taskId) {
          task.completed = completed !== undefined ? Boolean(completed) : !task.completed;
          taskFound = true;
          break;
        }
      }
      if (taskFound) break;
    }

    // Search in day29 & day30
    if (!taskFound && plan.day29 && (taskId === 'day29' || plan.day29.id === taskId)) {
      plan.day29.completed = completed !== undefined ? Boolean(completed) : !plan.day29.completed;
      taskFound = true;
    }

    if (!taskFound && plan.day30 && (taskId === 'day30' || plan.day30.id === taskId)) {
      plan.day30.completed = completed !== undefined ? Boolean(completed) : !plan.day30.completed;
      taskFound = true;
    }

    const updated = await Storage.updateAnalysis(id, { learningPlan: plan });

    return res.json({
      success: true,
      message: 'Learning plan task updated!',
      learningPlan: plan,
      analysis: updated
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update learning plan task.'
    });
  }
};

/**
 * 1-Click Load Demo Analysis
 * @route POST /api/analysis/demo
 */
export const loadDemoAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const demoData = getSampleAnalysisData(userId);
    const created = await Storage.createAnalysis(demoData);

    return res.status(201).json({
      success: true,
      message: 'Demo analysis loaded successfully!',
      analysis: created
    });
  } catch (error) {
    console.error('Demo analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load demo analysis.'
    });
  }
};
