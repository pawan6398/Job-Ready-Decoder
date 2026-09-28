import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

const COMMON_ROLES = [
  'Full Stack Developer',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Engineer'
];

const ANALYSIS_PROGRESS_STEPS = [
  'Uploading documents...',
  'Extracting text from files...',
  'Analyzing 3 job descriptions...',
  'Finding recurring skills (>= 2/3 occurrences)...',
  'Comparing with candidate resume...',
  'Generating 8 likely interview questions...',
  'Building realistic 30-day learning plan...'
];

export default function CreateAnalysisPage({ onAnalysisCreated, onClose }) {
  const { success, error } = useToast();

  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');

  // Resume State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeInputMode, setResumeInputMode] = useState('upload'); // 'upload' or 'text'

  // 3 Job Descriptions State
  const [activeJdTab, setActiveJdTab] = useState(1);
  const [jds, setJds] = useState({
    1: { file: null, text: '', title: 'Job Description 1 (Fintech)', company: 'NexaPay' },
    2: { file: null, text: '', title: 'Job Description 2 (Cloud SaaS)', company: 'CloudPulse' },
    3: { file: null, text: '', title: 'Job Description 3 (E-Commerce)', company: 'Velocity Commerce' }
  });

  // Analysis Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Quick populate with sample data
  const handleLoadSampleData = async () => {
    setIsSubmitting(true);
    setCurrentStepIndex(0);

    // Step animation ticker
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await api.analysis.loadDemo();
      clearInterval(interval);
      if (res?.analysis) {
        success('Sample Full Stack Analysis created successfully!');
        onAnalysisCreated(res.analysis);
      }
    } catch (err) {
      clearInterval(interval);
      error(err.message || 'Failed to load demo analysis');
      setIsSubmitting(false);
    }
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      error('Please upload a valid PDF, DOCX, or TXT file.');
      return;
    }

    setResumeFile(file);
    try {
      const res = await api.upload.resume(file);
      if (res?.extractedText) {
        setResumeText(res.extractedText);
        success(`Parsed resume: ${file.name} (${res.wordCount} words)`);
      }
    } catch (err) {
      error(err.message || 'Failed to parse resume');
    }
  };

  const handleJdFileChange = async (jdNum, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setJds((prev) => ({
      ...prev,
      [jdNum]: { ...prev[jdNum], file }
    }));

    try {
      const res = await api.upload.jobDescription(file, {
        title: jds[jdNum].title,
        company: jds[jdNum].company
      });
      if (res?.extractedText) {
        setJds((prev) => ({
          ...prev,
          [jdNum]: { ...prev[jdNum], text: res.extractedText }
        }));
        success(`Parsed JD ${jdNum}: ${file.name}`);
      }
    } catch (err) {
      error(err.message || `Failed to parse JD ${jdNum}`);
    }
  };

  const handleJdTextChange = (jdNum, text) => {
    setJds((prev) => ({
      ...prev,
      [jdNum]: { ...prev[jdNum], text }
    }));
  };

  const handleStartAnalysis = async () => {
    const selectedRole = customRole.trim() || targetRole;

    if (!selectedRole) {
      error('Please select or specify a target role.');
      return;
    }

    if (!resumeText.trim()) {
      error('Please upload your resume or paste resume text.');
      return;
    }

    // Strictly check 3 JDs
    for (let i = 1; i <= 3; i++) {
      if (!jds[i].text.trim()) {
        error(`Job Description ${i} is missing. Exactly 3 job descriptions are required.`);
        setActiveJdTab(i);
        return;
      }
    }

    setIsSubmitting(true);
    setCurrentStepIndex(0);

    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_PROGRESS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const payload = {
        targetRole: selectedRole,
        resumeText: resumeText.trim(),
        resumeOriginalName: resumeFile ? resumeFile.name : 'Pasted Resume',
        jobDescriptions: [
          {
            title: jds[1].title || 'Job Description 1',
            company: jds[1].company || 'Employer 1',
            filename: jds[1].file ? jds[1].file.name : 'Direct Input 1',
            text: jds[1].text.trim()
          },
          {
            title: jds[2].title || 'Job Description 2',
            company: jds[2].company || 'Employer 2',
            filename: jds[2].file ? jds[2].file.name : 'Direct Input 2',
            text: jds[2].text.trim()
          },
          {
            title: jds[3].title || 'Job Description 3',
            company: jds[3].company || 'Employer 3',
            filename: jds[3].file ? jds[3].file.name : 'Direct Input 3',
            text: jds[3].text.trim()
          }
        ]
      };

      const res = await api.analysis.create(payload);
      clearInterval(stepTimer);

      if (res?.analysis) {
        success('Analysis completed successfully!');
        onAnalysisCreated(res.analysis);
      }
    } catch (err) {
      clearInterval(stepTimer);
      error(err.message || 'Analysis failed. Please verify your inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Overlay Step-by-Step Progress Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Decoding Job Requirements</h3>
              <p className="text-xs text-slate-600 mt-1">Cross-analyzing 3 JDs vs Resume evidence</p>
            </div>

            <div className="space-y-3 text-left">
              {ANALYSIS_PROGRESS_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 text-xs font-semibold p-2 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-brand-50 text-brand-900 border border-brand-200 shadow-2xs'
                        : isPassed
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-brand-600 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Creation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                NEW JOB ANALYSIS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Decode 3 Job Descriptions vs Your Resume
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Identify recurring skills, classify your skill gaps, predict 8 likely interview questions, and build a 30-day plan.
            </p>
          </div>

          {/* 1-Click Load Sample Analysis Button */}
          <button
            type="button"
            onClick={handleLoadSampleData}
            disabled={isSubmitting}
            className="self-start px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-2 transition shadow-2xs hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            Load Sample Files (1-Click)
          </button>
        </div>

        {/* STEP 1: Target Role */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">Select Target Role</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {COMMON_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setTargetRole(role);
                  setCustomRole('');
                }}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${
                  targetRole === role && !customRole
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Or define a custom role:
            </label>
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g., Senior Full Stack Engineer / AI Product Developer"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
            />
          </div>
        </div>

        {/* STEP 2: Upload Resume */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">Upload Your Resume</h3>
            </div>

            <div className="flex gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setResumeInputMode('upload')}
                className={`px-3 py-1 rounded-lg transition ${
                  resumeInputMode === 'upload' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Upload File (PDF/DOCX)
              </button>
              <button
                type="button"
                onClick={() => setResumeInputMode('text')}
                className={`px-3 py-1 rounded-lg transition ${
                  resumeInputMode === 'text' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {resumeInputMode === 'upload' ? (
            <div className="space-y-3">
              {!resumeFile ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm font-bold text-slate-800">
                    Click to upload or drag & drop your resume
                  </span>
                  <span className="text-xs text-slate-600 mt-1">
                    Accepts PDF, DOCX, or TXT (Max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleResumeFileChange}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{resumeFile.name}</h4>
                      <p className="text-xs text-slate-600">
                        {(resumeFile.size / 1024).toFixed(1)} KB • Ready for analysis
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      setResumeText('');
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={6}
              className="w-full text-xs p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
              placeholder="Paste your complete resume text here (including Education, Technical Skills, Projects, and Experience)..."
            />
          )}
        </div>

        {/* STEP 3: Upload 3 Job Descriptions */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Provide Exactly 3 Job Descriptions
                </h3>
                <p className="text-xs text-slate-600">
                  Upload files or paste text for JD 1, JD 2, and JD 3.
                </p>
              </div>
            </div>

            {/* Indicator of completed JDs */}
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => {
                const hasContent = Boolean(jds[num].text.trim());
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveJdTab(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeJdTab === num
                        ? 'bg-slate-900 text-white'
                        : hasContent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    JD {num}
                    {hasContent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active JD Card Input */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Configuring Job Description {activeJdTab} of 3
                </span>
                <input
                  type="text"
                  value={jds[activeJdTab].title}
                  onChange={(e) =>
                    setJds({
                      ...jds,
                      [activeJdTab]: { ...jds[activeJdTab], title: e.target.value }
                    })
                  }
                  placeholder={`JD ${activeJdTab} Title or Employer`}
                  className="text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-80"
                />
              </div>

              {/* Upload file button for this JD */}
              <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-2xs self-start sm:self-auto">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Upload PDF / DOCX
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => handleJdFileChange(activeJdTab, e)}
                  className="sr-only"
                />
              </label>
            </div>

            {jds[activeJdTab].file && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  {jds[activeJdTab].file.name}
                </span>
                <span className="text-emerald-600 font-bold">Extracted</span>
              </div>
            )}

            <textarea
              value={jds[activeJdTab].text}
              onChange={(e) => handleJdTextChange(activeJdTab, e.target.value)}
              rows={5}
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans bg-white leading-relaxed"
              placeholder={`Paste the full text of Job Description ${activeJdTab} here (responsibilities, required qualifications, technical stack, etc.)...`}
            />
          </div>
        </div>

        {/* STEP 4: Start Analysis Action Banner */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Ensure exactly 3 Job Descriptions and your resume are loaded before beginning.
          </div>

          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            Start Complete Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
