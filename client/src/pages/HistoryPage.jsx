import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import {
  Layers,
  Search,
  Trash2,
  ExternalLink,
  PlusCircle,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HistoryPage({ onSelectAnalysis, onOpenNewAnalysis }) {
  const { success, error } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnalyses = async () => {
    try {
      const res = await api.analysis.getAll();
      setAnalyses(res.analyses || []);
    } catch (err) {
      console.warn('Failed to load history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (id, targetRole) => {
    if (!window.confirm(`Delete analysis for ${targetRole}?`)) return;

    try {
      await api.analysis.delete(id);
      success('Analysis deleted');
      setAnalyses(analyses.filter((a) => a._id !== id && a.id !== id));
    } catch (err) {
      error(err.message || 'Delete failed');
    }
  };

  const filteredAnalyses = analyses.filter((a) =>
    (a.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.resumeOriginalName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-600" /> Past Job Analyses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review your previously decoded job descriptions, updated skill classifications, and preparation plans.
          </p>
        </div>

        <button
          onClick={onOpenNewAnalysis}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-brand-700 transition"
        >
          <PlusCircle className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by target role or resume filename..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
        />
      </div>

      {/* Table or Cards List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">Loading history...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm font-semibold text-slate-700">No analyses found.</p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Create your first 3-JD analysis or try the pre-loaded demo.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAnalyses.map((a) => {
              const skills = a.recurringSkills || [];
              const ready = skills.filter((s) => s.classification === 'Already Have').length;
              const match = skills.length > 0 ? Math.round((ready / skills.length) * 100) : 0;

              return (
                <div
                  key={a._id || a.id}
                  onClick={() => onSelectAnalysis(a)}
                  className="p-5 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 hover:text-brand-600 transition">
                        {a.targetRole}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                        {match}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Resume: <strong>{a.resumeOriginalName}</strong> • {skills.length} Recurring Skills • 8 Questions
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Created on {new Date(a.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnalysis(a);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(a._id || a.id, a.targetRole);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
