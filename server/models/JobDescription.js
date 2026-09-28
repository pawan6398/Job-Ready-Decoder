import mongoose from 'mongoose';

const JobDescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'Target Role Job Description'
    },
    company: {
      type: String,
      default: 'Target Employer'
    },
    originalFilename: {
      type: String,
      default: 'Direct Input'
    },
    extractedText: {
      type: String,
      required: true
    },
    skillsFound: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.JobDescription || mongoose.model('JobDescription', JobDescriptionSchema);
