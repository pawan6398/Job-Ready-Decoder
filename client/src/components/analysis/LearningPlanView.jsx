import React, { useState } from 'react';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LearningPlanView({ analysis, onUpdateAnalysis }) {
  const { success, error } = useToast();
  const [openWeek, setOpenWeek] = useState(1);
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  const plan = analysis?.learningPlan;

  if (!plan || !plan.weeks || plan.weeks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Target className="w-12 h-12 text-brand-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No Learning Plan Generated Yet</h3>
        <p className="text-sm text-slate-600">
          The 30-day preparation roadmap will be built from your identified skill gaps.
        </p>
      </div>
    );
  }

  // Calculate task completion percentage
  let totalTasks = 0;
  let completedTasks = 0;

  plan.weeks.forEach((w) => {
    (w.tasks || []).forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  if (plan.day29) {
    totalTasks++;
    if (plan.day29.completed) completedTasks++;
  }
  if (plan.day30) {
    totalTasks++;
    if (plan.day30.completed) completedTasks++;
  }

  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = async (taskId, currentStatus) => {
    setTogglingTaskId(taskId);
    try {
      const res = await api.analysis.toggleTask(
        analysis._id || analysis.id,
        taskId,
        !currentStatus
      );
      if (res?.analysis) {
        onUpdateAnalysis(res.analysis);
        success(!currentStatus ? 'Task marked complete! Keep going.' : 'Task marked incomplete.');
      }
    } catch (err) {
      error(err.message || 'Failed to update task status');
    } finally {
      setTogglingTaskId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 30-Day Plan Header & Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              <Calendar className="w-3.5 h-3.5" /> 30-Day Preparation Roadmap
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bridge Your High-Impact Skill Gaps
            </h2>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600">
              <span>Focused on Priority Gaps:</span>
              {(plan.skillsToLearn || []).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full md:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Roadmap Progress</span>
              <span className="text-brand-600 font-extrabold text-sm">{completionPercent}%</span>
            </div>
            <ProgressBar value={completedTasks} max={totalTasks} color="gradient" showPercent={false} size="md" />
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>{completedTasks} completed</span>
              <span>{totalTasks - completedTasks} remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Weeks Accordion Cards */}
      <div className="space-y-4">
        {plan.weeks.map((week) => {
          const isOpen = openWeek === week.weekNumber;
          const weekTasks = week.tasks || [];
          const weekDone = weekTasks.filter((t) => t.completed).length;

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border transition-all ${
                isOpen ? 'bg-white border-slate-300 shadow-md ring-1 ring-slate-200' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setOpenWeek(isOpen ? null : week.weekNumber)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                    W{week.weekNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                        Week {week.weekNumber} • {week.skill}
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        ({weekDone}/{weekTasks.length} tasks)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {week.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-24">
                    <ProgressBar value={weekDone} max={weekTasks.length} showPercent={false} size="sm" />
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-6">
                  {/* Topics & Resources */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        Curated Topics
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(week.topics || []).map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        Recommended Resources
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(week.resources || []).map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Practice & Deliverable Banner */}
                  <div className="bg-brand-50/70 p-4 rounded-xl border border-brand-200/80 space-y-1.5 text-xs">
                    <div>
                      <strong className="text-brand-900">Hands-on Practice: </strong>
                      <span className="text-brand-800">{week.practice}</span>
                    </div>
                    <div>
                      <strong className="text-brand-900">Verified Deliverable: </strong>
                      <span className="text-brand-800 font-semibold">{week.deliverable}</span>
                    </div>
                  </div>

                  {/* Tasks Checkbox List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Specific Weekly Tasks & Objectives
                    </h5>
                    <div className="space-y-2.5">
                      {weekTasks.map((t) => {
                        const isToggling = togglingTaskId === t.id;

                        return (
                          <div
                            key={t.id}
                            onClick={() => !isToggling && handleToggleTask(t.id, t.completed)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                              t.completed
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition"
                            >
                              {t.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                              )}
                            </button>

                            <div className="flex-1 space-y-1 text-xs">
                              <p
                                className={`font-bold ${
                                  t.completed ? 'line-through text-slate-600' : 'text-slate-900'
                                }`}
                              >
                                {t.task}
                              </p>
                              <p className="text-slate-600">
                                <strong>Practice:</strong> {t.practiceTask}
                              </p>
                              <p className="text-slate-600">
                                <strong>Outcome:</strong> {t.expectedOutcome}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day 29 & Day 30 Capstone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Day 29 */}
        {plan.day29 && (
          <div
            onClick={() => handleToggleTask('day29', plan.day29.completed)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              plan.day29.completed
                ? 'bg-emerald-50/80 border-emerald-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                DAY 29 MILESTONE
              </span>
              {plan.day29.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </div>

            <h4 className="text-base font-bold text-slate-900">{plan.day29.title}</h4>

            <ul className="space-y-1.5 text-xs text-slate-600">
              {(plan.day29.revisionTasks || []).map((rt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span>{rt}</span>
                </li>
              ))}
            </ul>

            <div className="text-xs bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-200">
              <strong>Mock Focus:</strong> {plan.day29.mockInterviewFocus}
            </div>
          </div>
        )}

        {/* Day 30 */}
        {plan.day30 && (
          <div
            onClick={() => handleToggleTask('day30', plan.day30.completed)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              plan.day30.completed
                ? 'bg-emerald-50/80 border-emerald-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700">
                DAY 30 FINAL CAPSTONE
              </span>
              {plan.day30.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </div>

            <h4 className="text-base font-bold text-slate-900">{plan.day30.title}</h4>

            <ul className="space-y-1.5 text-xs text-slate-600">
              {(plan.day30.assessmentTasks || []).map((at, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  <span>{at}</span>
                </li>
              ))}
            </ul>

            <div className="text-xs bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-200">
              <strong>Role Simulation:</strong> {plan.day30.simulationPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
