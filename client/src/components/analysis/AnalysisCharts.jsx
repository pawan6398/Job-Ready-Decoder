import React from 'react';

export default function AnalysisCharts({ analysis }) {
  const skills = analysis?.recurringSkills || [];
  const plan = analysis?.learningPlan;

  // 1. Skill Frequency breakdown
  const freq3 = skills.filter((s) => s.frequency === '3/3').length;
  const freq2 = skills.filter((s) => s.frequency === '2/3').length;
  const totalSkills = skills.length;

  // 2. 4-Column Skill Gap Distribution
  const alreadyHave = skills.filter((s) => s.classification === 'Already Have').length;
  const needToLearn = skills.filter((s) => s.classification === 'Need to Learn').length;
  const needToDemo = skills.filter((s) => s.classification === 'Need to Demonstrate').length;
  const notImportant = skills.filter((s) => s.classification === 'Not Important for Me').length;

  // 3. Learning Plan Progress
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
  if (plan?.day29) {
    totalTasks++;
    if (plan.day29.completed) completedTasks++;
  }
  if (plan?.day30) {
    totalTasks++;
    if (plan.day30.completed) completedTasks++;
  }

  const planPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Donut chart calculations
  const donutData = [
    { label: 'Already Have', count: alreadyHave, color: '#10b981' }, // emerald
    { label: 'Need to Learn', count: needToLearn, color: '#f43f5e' }, // rose
    { label: 'Need to Demo', count: needToDemo, color: '#f59e0b' },  // amber
    { label: 'Not Important', count: notImportant, color: '#94a3b8' } // slate
  ];

  const totalDonut = Math.max(1, donutData.reduce((acc, d) => acc + d.count, 0));
  let cumulativePercent = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Chart 1: Skill Frequency Bar Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Skill Frequency Distribution</h4>
          <span className="text-xs text-slate-600 font-semibold">{totalSkills} Total</span>
        </div>

        <div className="space-y-3 pt-2">
          {/* 3/3 Frequency Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-700 font-bold">3 of 3 JDs (100% Demand)</span>
              <span className="text-slate-800">{freq3} skills</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalSkills ? (freq3 / totalSkills) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 2/3 Frequency Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-blue-700 font-bold">2 of 3 JDs (67% Demand)</span>
              <span className="text-slate-800">{freq2} skills</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalSkills ? (freq2 / totalSkills) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Skills present in at least 2 job descriptions form the non-negotiable core requirements for {analysis?.targetRole}.
        </p>
      </div>

      {/* Chart 2: Skill Gap Donut Visualization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Skill Gap Breakdown</h4>
          <span className="text-xs text-slate-600 font-semibold">4 Classifications</span>
        </div>

        <div className="flex items-center justify-center gap-6 py-1">
          {/* Custom SVG Donut */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
              {donutData.map((d, i) => {
                const percent = (d.count / totalDonut) * 100;
                const strokeDasharray = `${percent} ${100 - percent}`;
                const strokeDashoffset = -cumulativePercent;
                cumulativePercent += percent;

                return (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke={d.color}
                    strokeWidth="3.8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute text-center">
              <span className="text-base font-extrabold text-slate-900">{alreadyHave}</span>
              <span className="block text-[10px] text-slate-600 font-medium">Ready</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            {donutData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 font-medium truncate max-w-[100px]">{d.label}:</span>
                <span className="font-bold text-slate-900">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex justify-between">
          <span>Match Score:</span>
          <span className="font-bold text-emerald-600">
            {totalSkills ? Math.round((alreadyHave / totalSkills) * 100) : 0}% Aligned
          </span>
        </div>
      </div>

      {/* Chart 3: 30-Day Preparation Progress Gauge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">30-Day Plan Readiness</h4>
          <span className="text-xs text-brand-600 font-extrabold">{planPercent}%</span>
        </div>

        <div className="space-y-3">
          <div className="relative pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Task Milestones Completed</span>
              <span>{completedTasks} / {totalTasks}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${planPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="block text-[10px] text-slate-600 font-medium">Weeks</span>
              <span className="text-sm font-extrabold text-slate-900">4 Weeks</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="block text-[10px] text-slate-600 font-medium">Assessment</span>
              <span className="text-sm font-extrabold text-slate-900">Day 29 & 30</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2">
          Tracking your daily progress ensures you enter technical screens fully prepared.
        </p>
      </div>
    </div>
  );
}
