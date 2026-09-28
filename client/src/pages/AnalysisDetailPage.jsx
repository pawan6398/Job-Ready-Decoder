import React, { useState } from 'react';
import SkillGapTable from '../components/analysis/SkillGapTable';
import InterviewQuestionsList from '../components/analysis/InterviewQuestionsList';
import QuestionAnswerDrill from '../components/analysis/QuestionAnswerDrill';
import LearningPlanView from '../components/analysis/LearningPlanView';
import AnalysisCharts from '../components/analysis/AnalysisCharts';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Table,
  HelpCircle,
  FileCheck,
  Calendar,
  Printer,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award
} from 'lucide-react';

export default function AnalysisDetailPage({
  analysis,
  onUpdateAnalysis,
  onBackToDashboard,
  onDeleteAnalysis
}) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'questions' | 'answers' | 'plan'
  const [isDeleting, setIsDeleting] = useState(false);

  if (!analysis) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">No analysis selected.</p>
        <button
          onClick={onBackToDashboard}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const skills = analysis.recurringSkills || [];
  const alreadyHaveCount = skills.filter((s) => s.classification === 'Already Have').length;
  const needToLearnCount = skills.filter((s) => s.classification === 'Need to Learn').length;
  const needToDemoCount = skills.filter((s) => s.classification === 'Need to Demonstrate').length;
  const notImportantCount = skills.filter((s) => s.classification === 'Not Important for Me').length;

  const matchScore = skills.length > 0 ? Math.round((alreadyHaveCount / skills.length) * 100) : 0;

  // Determine readiness level
  let readiness = 'Low';
  let readinessVariant = 'Low';
  if (matchScore >= 70) {
    readiness = 'High';
    readinessVariant = 'High';
  } else if (matchScore >= 45) {
    readiness = 'Medium';
    readinessVariant = 'Medium';
  }

  // Calculate learning plan progress
  const plan = analysis.learningPlan;
  let totalTasks = 0;
  let completedTasks = 0;
  if (plan?.weeks) {
    plan.weeks.forEach((w) => {
      (w.tasks || []).forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
  }
  if (plan?.day29?.completed) completedTasks++;
  if (plan?.day29) totalTasks++;
  if (plan?.day30?.completed) completedTasks++;
  if (plan?.day30) totalTasks++;

  const planProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the analysis for "${analysis.targetRole}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.analysis.delete(analysis._id || analysis.id);
      success('Analysis deleted successfully.');
      onDeleteAnalysis(analysis._id || analysis.id);
    } catch (err) {
      error(err.message || 'Failed to delete analysis');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print / Export Report
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Main Analysis Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200 uppercase tracking-wider">
                DECODED ANALYSIS
              </span>
              <span className="text-xs text-slate-600">
                Created {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {analysis.targetRole}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 flex-wrap">
              <span>Resume: <strong>{analysis.resumeOriginalName || 'Uploaded Resume'}</strong></span>
              <span>•</span>
              <span>Triangulated across <strong>3 Job Descriptions</strong></span>
            </p>
          </div>

          {/* Readiness Badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 self-start md:self-auto">
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 uppercase">Interview Readiness</span>
              <Badge variant={readinessVariant} className="text-sm px-3 py-1 font-extrabold mt-1">
                {readiness} Readiness
              </Badge>
            </div>
            <div className="border-l border-slate-200 pl-4 text-center">
              <span className="block text-[11px] font-semibold text-slate-600 uppercase">Match Score</span>
              <span className="text-2xl font-black text-brand-600">{matchScore}%</span>
            </div>
          </div>
        </div>

        {/* 6 Metric Quick Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-semibold text-slate-600">Recurring Skills</span>
            <span className="text-xl font-black text-slate-900">{skills.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="block text-xs font-semibold text-emerald-800">Already Have</span>
            <span className="text-xl font-black text-emerald-700">{alreadyHaveCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <span className="block text-xs font-semibold text-rose-800">Need to Learn</span>
            <span className="text-xl font-black text-rose-700">{needToLearnCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="block text-xs font-semibold text-amber-800">Need to Demonstrate</span>
            <span className="text-xl font-black text-amber-700">{needToDemoCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="block text-xs font-semibold text-slate-800">Not Important</span>
            <span className="text-xl font-black text-slate-700">{notImportantCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="block text-xs font-semibold text-indigo-800">30-Day Plan</span>
            <span className="text-xl font-black text-indigo-700">{planProgress}%</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 no-print">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          Dashboard & Charts
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'skills'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-4 h-4" />
          Skill Gap Table ({skills.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'questions'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Predicted Questions (8)
        </button>

        <button
          onClick={() => setActiveTab('answers')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'answers'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Top 3 Answers & Drills
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'plan'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          30-Day Learning Plan
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Visual Charts */}
          <AnalysisCharts analysis={analysis} />

          {/* Quick Peek: Top Skill Gaps & Top Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Skill Gaps */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Top Priority Skill Gaps (Need to Learn)
                </h4>
                <button
                  onClick={() => setActiveTab('skills')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {skills
                  .filter((s) => s.classification === 'Need to Learn')
                  .slice(0, 4)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-rose-950 font-bold block">{skill.name}</strong>
                        <span className="text-slate-600">{skill.category}</span>
                      </div>
                      <Badge variant={skill.frequency}>{skill.frequency} JDs</Badge>
                    </div>
                  ))}

                {skills.filter((s) => s.classification === 'Need to Learn').length === 0 && (
                  <p className="text-xs text-slate-600 italic">No missing skills! You meet all recurring requirements.</p>
                )}
              </div>
            </div>

            {/* Top Predicted Questions Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Interview Questions Preview
                </h4>
                <button
                  onClick={() => setActiveTab('questions')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  View All (8)
                </button>
              </div>

              <div className="space-y-2.5">
                {(analysis.interviewQuestions || []).slice(0, 3).map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => setActiveTab('questions')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Question #{idx + 1}</span>
                      <Badge variant="indigo">{q.category}</Badge>
                    </div>
                    <p className="font-bold text-slate-900">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Skill Frequency & 4-Column Gap Table */}
      {activeTab === 'skills' && (
        <div className="animate-in fade-in">
          <SkillGapTable analysis={analysis} onUpdateAnalysis={onUpdateAnalysis} />
        </div>
      )}

      {/* 3. 8 Predicted Interview Questions */}
      {activeTab === 'questions' && (
        <div className="animate-in fade-in">
          <InterviewQuestionsList
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
            onSwitchToAnswers={() => setActiveTab('answers')}
          />
        </div>
      )}

      {/* 4. Top 3 Answers & Rehearsal Drills */}
      {activeTab === 'answers' && (
        <div className="animate-in fade-in">
          <QuestionAnswerDrill analysis={analysis} onUpdateAnalysis={onUpdateAnalysis} />
        </div>
      )}

      {/* 5. 30-Day Learning Plan */}
      {activeTab === 'plan' && (
        <div className="animate-in fade-in">
          <LearningPlanView analysis={analysis} onUpdateAnalysis={onUpdateAnalysis} />
        </div>
      )}
    </div>
  );
}
