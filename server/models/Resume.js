import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalFilename: {
      type: String,
      required: true
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

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
