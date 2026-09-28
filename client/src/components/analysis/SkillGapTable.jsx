import React, { useState } from 'react';
import Badge from '../common/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Check, Edit3, MessageSquare, Filter, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const CLASSIFICATIONS = [
  'Already Have',
  'Need to Learn',
  'Need to Demonstrate',
  'Not Important for Me'
];

export default function SkillGapTable({ analysis, onUpdateAnalysis }) {
  const { success, error } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [editingEvidenceId, setEditingEvidenceId] = useState(null);
  const [evidenceInput, setEvidenceInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const skills = analysis?.recurringSkills || [];

  // Extract distinct categories
  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  const handleClassificationChange = async (skill, newClassification) => {
    if (skill.classification === newClassification) return;
    setUpdatingId(skill.id);

    try {
      const res = await api.analysis.updateSkill(analysis._id || analysis.id, skill.id, {
        classification: newClassification
      });
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success(`Updated "${skill.name}" to "${newClassification}"`);
      }
    } catch (err) {
      error(err.message || 'Failed to update classification');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveEvidence = async (skill) => {
    try {
      const res = await api.analysis.updateSkill(analysis._id || analysis.id, skill.id, {
        evidence: evidenceInput
      });
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success(`Saved evidence note for "${skill.name}"`);
        setEditingEvidenceId(null);
      }
    } catch (err) {
      error(err.message || 'Failed to save evidence');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Skill Frequency & 4-Column Gap Classification
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
              {filteredSkills.length} Recurring Skills
            </span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Repeated in &ge;2 of the 3 Job Descriptions. Click any classification column to adjust your status.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 4-Column Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 font-semibold text-xs tracking-wider uppercase">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 font-semibold">
                Skill
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold">
                Frequency
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold bg-emerald-50/50 text-emerald-800">
                Already Have
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold bg-rose-50/50 text-rose-800">
                Need to Learn
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold bg-amber-50/50 text-amber-800">
                Need to Demonstrate
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold bg-slate-100/70 text-slate-700">
                Not Important for Me
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredSkills.map((skill) => {
              const isExpanded = expandedSkillId === skill.id;
              const isEditingEvidence = editingEvidenceId === skill.id;

              return (
                <React.Fragment key={skill.id}>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    {/* Skill Name & Category */}
                    <td className="py-4 pl-6 pr-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{skill.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {skill.category}
                        </span>
                        {(skill.evidence || skill.userNote) && (
                          <button
                            onClick={() => {
                              setExpandedSkillId(isExpanded ? null : skill.id);
                              setEvidenceInput(skill.evidence || '');
                            }}
                            className="p-1 rounded text-slate-400 hover:text-brand-600 transition"
                            title="View/Edit Evidence Note"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Frequency */}
                    <td className="px-3 py-4 text-center whitespace-nowrap">
                      <Badge variant={skill.frequency}>{skill.frequency}</Badge>
                    </td>

                    {/* 4 Classification Columns with Radio Checkboxes */}
                    {CLASSIFICATIONS.map((colName) => {
                      const isSelected = skill.classification === colName;
                      const isUpdating = updatingId === skill.id;

                      let cellBg = '';
                      if (isSelected) {
                        if (colName === 'Already Have') cellBg = 'bg-emerald-50/40';
                        if (colName === 'Need to Learn') cellBg = 'bg-rose-50/40';
                        if (colName === 'Need to Demonstrate') cellBg = 'bg-amber-50/40';
                        if (colName === 'Not Important for Me') cellBg = 'bg-slate-100/50';
                      }

                      return (
                        <td
                          key={colName}
                          onClick={() => handleClassificationChange(skill, colName)}
                          className={`px-3 py-4 text-center cursor-pointer transition-colors ${cellBg}`}
                        >
                          <div className="flex items-center justify-center">
                            <label className="relative flex items-center justify-center cursor-pointer">
                              <input
                                type="radio"
                                name={`skill-${skill.id}`}
                                checked={isSelected}
                                onChange={() => handleClassificationChange(skill, colName)}
                                disabled={isUpdating}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? colName === 'Already Have'
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                      : colName === 'Need to Learn'
                                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                      : colName === 'Need to Demonstrate'
                                      ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                                      : 'bg-slate-600 border-slate-600 text-white shadow-xs'
                                    : 'border-slate-300 hover:border-slate-400 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </label>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Expandable Evidence Row */}
                  {(isExpanded || isEditingEvidence || (skill.classification !== 'Not Important for Me' && isExpanded)) && (
                    <tr className="bg-slate-50/60 text-xs">
                      <td colSpan={6} className="py-3 px-6">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                              Resume Evidence & Notes for {skill.name}:
                            </span>
                            {!isEditingEvidence ? (
                              <button
                                onClick={() => {
                                  setEditingEvidenceId(skill.id);
                                  setEvidenceInput(skill.evidence || '');
                                }}
                                className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Edit Note
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingEvidenceId(null)}
                                  className="text-slate-500 hover:text-slate-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEvidence(skill)}
                                  className="text-brand-600 font-bold hover:underline"
                                >
                                  Save
                                </button>
                              </div>
                            )}
                          </div>

                          {!isEditingEvidence ? (
                            <p className="text-slate-600 italic leading-relaxed">
                              {skill.evidence || 'No specific evidence note attached yet. Click Edit Note to describe your project or internship proof.'}
                            </p>
                          ) : (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={evidenceInput}
                                onChange={(e) => setEvidenceInput(e.target.value)}
                                rows={2}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
                                placeholder="e.g., EduAI project — React frontend with Tailwind and Redux state management."
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">Definitions:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <strong>Already Have:</strong> Real evidence in resume/projects
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> <strong>Need to Learn:</strong> Currently missing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <strong>Need to Demonstrate:</strong> Known, but weak proof on resume
          </span>
        </div>
      </div>
    </div>
  );
}
