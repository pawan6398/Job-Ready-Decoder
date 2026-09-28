import React, { useState } from 'react';
import Badge from '../common/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Edit3,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function QuestionAnswerDrill({ analysis, onUpdateAnalysis }) {
  const { success, error } = useToast();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [savingIdx, setSavingIdx] = useState(null);

  const answers = analysis?.answers || [];

  if (answers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-brand-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Answers Generated Yet</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Please select 3 questions from the "Interview Questions" tab and click "Prepare Top 3 Answers".
        </p>
      </div>
    );
  }

  const currentAnswer = answers[activeTabIdx] || answers[0];

  const handleConfidenceChange = async (newRating) => {
    try {
      const res = await api.analysis.updateAnswer(
        analysis._id || analysis.id,
        currentAnswer.questionId || currentAnswer.id,
        {
          confidenceRating: newRating
        }
      );
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success(`Confidence updated to ${newRating}`);
      }
    } catch (err) {
      error(err.message || 'Failed to update confidence');
    }
  };

  const handleSaveUserAnswer = async (editedText) => {
    setSavingIdx(activeTabIdx);
    try {
      const res = await api.analysis.updateAnswer(
        analysis._id || analysis.id,
        currentAnswer.questionId || currentAnswer.id,
        {
          userEditedAnswer: editedText
        }
      );
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success('Saved your customized answer!');
      }
    } catch (err) {
      error(err.message || 'Failed to save answer');
    } finally {
      setSavingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Grounding Anti-Hallucination Notice */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Strict Grounding Guarantee:</strong> All drafted answers are drawn directly from your uploaded resume projects, metrics, and experience. No fictional companies, projects, or achievements were hallucinated.
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {answers.map((ans, idx) => (
          <button
            key={ans.questionId || idx}
            onClick={() => setActiveTabIdx(idx)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
              activeTabIdx === idx
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 text-center flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span className="max-w-[200px] truncate">{ans.question}</span>
            <Badge variant={ans.confidenceRating || 'Medium'}>
              {ans.confidenceRating || 'Medium'}
            </Badge>
          </button>
        ))}
      </div>

      {/* Detailed Drill Card for Active Question */}
      {currentAnswer && (
        <DrillCardDetail
          key={currentAnswer.questionId || activeTabIdx}
          answer={currentAnswer}
          onSaveAnswer={handleSaveUserAnswer}
          onConfidenceChange={handleConfidenceChange}
          isSaving={savingIdx === activeTabIdx}
        />
      )}
    </div>
  );
}

function DrillCardDetail({ answer, onSaveAnswer, onConfidenceChange, isSaving }) {
  const [editedText, setEditedText] = useState(answer.userEditedAnswer || answer.resumeAnswer || '');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
      {/* Top Header: Question & Confidence */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2 flex-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            QUESTION FOCUS
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
            {answer.question}
          </h2>
        </div>

        {/* Confidence Rating Dropdown */}
        <div className="flex items-center gap-2 self-start bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">Confidence:</span>
          <select
            value={answer.confidenceRating || 'Medium'}
            onChange={(e) => onConfidenceChange(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer text-slate-800"
          >
            <option value="Low">Low (Need More Practice)</option>
            <option value="Medium">Medium (Ready to Refine)</option>
            <option value="High">High (Interview-Ready)</option>
          </select>
        </div>
      </div>

      {/* Why They May Ask It */}
      <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100/80 space-y-1">
        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
          Why They May Ask It
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed">
          {answer.whyAsked || 'Interviewers assess technical rigor, problem-solving depth, and real project involvement.'}
        </p>
      </div>

      {/* Resume-Grounded Answer + User's Own Words Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Resume-Grounded Draft Answer
            <span className="text-xs font-normal text-slate-600">(STAR Format)</span>
          </h4>

          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={() => {
                  onSaveAnswer(editedText);
                  setIsEditing(false);
                }}
                disabled={isSaving}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Answer'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Rehearse / Customize
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={7}
              className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans text-sm text-slate-800 leading-relaxed shadow-inner"
              placeholder="Edit the draft answer in your own voice..."
            />
            <p className="text-[11px] text-slate-600">
              Tip: Adapt phrasing to sound natural when speaking out loud during phone screens or onsite rounds.
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
            {editedText || answer.resumeAnswer}
          </div>
        )}
      </div>

      {/* Grid: Key Points & Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Key Points */}
        <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100 space-y-3">
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Points to Hit
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {(answer.keyPoints || []).map((pt, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="bg-rose-50/40 rounded-xl p-5 border border-rose-100 space-y-3">
          <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Common Mistakes to Avoid
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {(answer.commonMistakes || []).map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-Up Questions */}
      {answer.followUpQuestions && answer.followUpQuestions.length > 0 && (
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Anticipated Follow-Up Questions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {answer.followUpQuestions.map((fq, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed"
              >
                "{fq}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
