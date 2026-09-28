import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    resumeOriginalName: {
      type: String,
      default: 'Uploaded Resume'
    },
    resumeText: {
      type: String,
      required: true
    },
    jobDescriptionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobDescription'
      }
    ],
    jobDescriptions: [
      {
        id: String,
        title: String,
        company: String,
        filename: String,
        text: String
      }
    ],
    recurringSkills: [
      {
        id: String,
        name: { type: String, required: true },
        frequency: { type: String, required: true }, // "2/3" or "3/3"
        count: { type: Number, required: true },
        total: { type: Number, default: 3 },
        category: {
          type: String,
          enum: [
            'Programming',
            'Frontend',
            'Backend',
            'Database',
            'Cloud',
            'DevOps',
            'Testing',
            'Soft Skills',
            'Education',
            'Other'
          ],
          default: 'Other'
        },
        classification: {
          type: String,
          enum: ['Already Have', 'Need to Learn', 'Need to Demonstrate', 'Not Important for Me'],
          default: 'Need to Learn'
        },
        evidence: {
          type: String,
          default: ''
        },
        userNote: {
          type: String,
          default: ''
        }
      }
    ],
    interviewQuestions: [
      {
        id: String,
        question: { type: String, required: true },
        category: {
          type: String,
          enum: [
            'Technical',
            'Project-based',
            'Resume-based',
            'Behavioral',
            'Problem-solving',
            'Role-specific'
          ],
          default: 'Technical'
        },
        whyLikely: String,
        relevantEvidence: String
      }
    ],
    selectedQuestions: [
      {
        type: String
      }
    ],
    answers: [
      {
        questionId: String,
        question: String,
        whyAsked: String,
        resumeAnswer: String,
        userEditedAnswer: String,
        keyPoints: [String],
        commonMistakes: [String],
        followUpQuestions: [String],
        confidenceRating: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        }
      }
    ],
    learningPlan: {
      skillsToLearn: [String],
      weeks: [
        {
          weekNumber: Number,
          title: String,
          skill: String,
          topics: [String],
          resources: [String],
          practice: String,
          deliverable: String,
          tasks: [
            {
              id: String,
              task: String,
              practiceTask: String,
              expectedOutcome: String,
              completed: { type: Boolean, default: false }
            }
          ]
        }
      ],
      day29: {
        title: String,
        skill: String,
        revisionTasks: [String],
        mockInterviewFocus: String,
        completed: { type: Boolean, default: false }
      },
      day30: {
        title: String,
        skill: String,
        assessmentTasks: [String],
        simulationPrompt: String,
        completed: { type: Boolean, default: false }
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
