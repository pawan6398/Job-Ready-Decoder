import React, { useState } from 'react';
import Badge from '../common/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Circle, ArrowRight, HelpCircle, FileText, Loader2, Sparkles } from 'lucide-react';

export default function InterviewQuestionsList({
  analysis,
  onUpdateAnalysis,
  onSwitchToAnswers
}) {
  const { success, error } = useToast();
  const [selectedIds, setSelectedIds] = useState(analysis?.selectedQuestions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const questions = analysis?.interviewQuestions || [];

  const categories = ['All', ...new Set(questions.map((q) => q.category).filter(Boolean))];

  const filteredQuestions = filterCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === filterCategory);

  const toggleSelectQuestion = (qId) => {
    if (selectedIds.includes(qId)) {
      setSelectedIds(selectedIds.filter((id) => id !== qId));
    } else {
      if (selectedIds.length >= 3) {
        error('You can select a maximum of 3 questions. Deselect one first.');
        return;
      }
      setSelectedIds([...selectedIds, qId]);
    }
  };

  const handleGenerateAnswers = async () => {
    if (selectedIds.length !== 3) {
      error(`Please select exactly 3 questions. Currently selected: ${selectedIds.length}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.analysis.selectQuestions(analysis._id || analysis.id, selectedIds);
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success('Generated resume-grounded answers for your top 3 questions!');
        if (onSwitchToAnswers) {
          onSwitchToAnswers();
        }
      }
    } catch (err) {
      error(err.message || 'Failed to generate answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Instructions and Selection Counter */}
      <div className="bg-gradient-to-r from-brand-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/30 text-brand-200 border border-brand-400/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 8 Predicted Interview Questions
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">
            Select Your 3 Toughest Questions to Drill
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Choose the 3 questions you feel least prepared for. We will generate strictly resume-grounded STAR answers, key points, common mistakes, and follow-ups.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
            <span className="text-xs text-slate-300 block font-medium">Selected</span>
            <span className="text-lg font-extrabold text-white">
              {selectedIds.length} <span className="text-xs font-normal text-slate-400">/ 3</span>
            </span>
          </div>

          <button
            onClick={handleGenerateAnswers}
            disabled={selectedIds.length !== 3 || isSubmitting}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
              selectedIds.length === 3
                ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-brand-500/25 cursor-pointer scale-[1.02]'
                : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Answers...
              </>
            ) : (
              <>
                Prepare Top 3 Answers
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 8 Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q, idx) => {
          const isSelected = selectedIds.includes(q.id);

          return (
            <div
              key={q.id}
              onClick={() => toggleSelectQuestion(q.id)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-brand-50/70 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <Badge variant="indigo">{q.category}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 fill-brand-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug mb-3">
                  {q.question}
                </h4>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-700">Why it's likely: </strong>
                      {q.whyLikely}
                    </div>
                  </div>

                  {q.relevantEvidence && (
                    <div className="flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <FileText className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-700">Resume Evidence: </strong>
                        <span className="italic">{q.relevantEvidence}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? 'text-brand-600' : 'text-slate-600'}`}>
                  {isSelected ? '✓ Selected for Drill' : 'Click card to select'}
                </span>
                <span className="text-[11px] text-slate-600">Target Role Match</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
