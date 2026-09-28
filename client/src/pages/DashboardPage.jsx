import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import {
  Compass,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Trash2,
  Layers,
  Award,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function DashboardPage({
  onOpenNewAnalysis,
  onSelectAnalysis,
  setActivePage
}) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    try {
      const res = await api.analysis.getAll();
      setAnalyses(res.analyses || []);
    } catch (err) {
      console.warn('Could not fetch analyses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleLaunchDemo = async () => {
    try {
      const res = await api.analysis.loadDemo();
      if (res?.analysis) {
        success('Loaded Alex Morgan Sample Full Stack Analysis!');
        onSelectAnalysis(res.analysis);
      }
    } catch (err) {
      error(err.message || 'Failed to load demo analysis');
    }
  };

  const handleDelete = async (id, role, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete analysis for ${role}?`)) return;

    try {
      await api.analysis.delete(id);
      success('Analysis deleted');
      setAnalyses(analyses.filter((a) => a._id !== id && a.id !== id));
    } catch (err) {
      error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Engineering Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Track your job description gap analyses, rehearse predicted interview questions, and follow your 30-day technical roadmap.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-700 hover:bg-indigo-100 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            Load Sample Analysis
          </button>

          <button
            onClick={onOpenNewAnalysis}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-brand-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            New 3-JD Analysis
          </button>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Start New */}
        <div
          onClick={onOpenNewAnalysis}
          className="bg-gradient-to-br from-brand-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md cursor-pointer hover:scale-[1.01] transition-transform space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <PlusCircle className="w-5 h-5 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold">Start New Cross-Analysis</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Upload your resume along with 3 job descriptions to immediately decode the employer's core non-negotiable skills.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            Create Analysis <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Sample Profile */}
        <div
          onClick={handleLaunchDemo}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Explore Pre-loaded Demo</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Explore Alex Morgan's Full Stack Software Engineer analysis with 12 recurring skills, 8 questions, and a 30-day plan.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            Open Demo Project <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Metrics summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Preparation Statistics</h3>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="block text-slate-600">Analyses Created</span>
                <span className="text-base font-extrabold text-slate-900">{analyses.length}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="block text-slate-600">Readiness Status</span>
                <span className="text-base font-extrabold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-600">Based on your persistent workspace</span>
        </div>
      </div>

      {/* Recent Analyses List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900">Recent Job Analyses</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {analyses.length}
            </span>
          </div>

          {analyses.length > 0 && (
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              View All
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading analyses...</div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No analyses created yet</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Get started by uploading your resume and 3 job descriptions, or launch the demo dataset.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleLaunchDemo}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-brand-700 text-xs font-bold"
              >
                Try Demo Analysis
              </button>
              <button
                onClick={onOpenNewAnalysis}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Create Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyses.map((a) => {
              const skills = a.recurringSkills || [];
              const ready = skills.filter((s) => s.classification === 'Already Have').length;
              const match = skills.length > 0 ? Math.round((ready / skills.length) * 100) : 0;

              return (
                <div
                  key={a._id || a.id}
                  onClick={() => onSelectAnalysis(a)}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer bg-white space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(a.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition">
                        {a.targetRole}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 truncate max-w-xs">
                        Resume: {a.resumeOriginalName || 'Uploaded Document'}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                      {match}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="text-slate-600">
                      <strong>{skills.length}</strong> recurring skills (&ge;2 JDs)
                    </span>
                    <button
                      onClick={(e) => handleDelete(a._id || a.id, a.targetRole, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Analysis"
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
