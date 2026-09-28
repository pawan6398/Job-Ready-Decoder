import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  HelpCircle,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Users,
  Award
} from 'lucide-react';

export default function LandingPage({ setActivePage, onOpenNewAnalysis }) {
  const { isAuthenticated, demoLogin } = useAuth();

  const handleTryDemo = async () => {
    if (!isAuthenticated) {
      await demoLogin();
    }
    setActivePage('dashboard');
  };

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/50 via-slate-50 to-transparent pointer-events-none -z-10 blur-2xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold tracking-wide uppercase shadow-2xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Built for Final-Year Students, Grads & Career Changers
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Decode the Job. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800">
              Identify Your Gaps.
            </span> <br />
            Get Interview-Ready.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Analyze real job descriptions against your resume, discover the skills employers repeatedly ask for, predict interview questions, and build a focused 30-day preparation plan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onOpenNewAnalysis();
                } else {
                  setActivePage('auth-signup');
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-brand-600" />
              Try Demo Job Analysis
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3-JD Cross-Analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Hallucination Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Actionable 30-Day Plan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to Test with Sample Data
            </span>
          </div>
        </div>

        {/* Hero Preview Card Mockup */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center">
                  FS
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Full Stack Software Engineer Analysis
                  </h3>
                  <p className="text-xs text-slate-600">Cross-referenced across 3 real job descriptions vs. Alex Morgan's resume</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  72% Resume Match
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200">
                  12 Recurring Skills
                </span>
              </div>
            </div>

            {/* Quick Teaser Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="block text-xl font-extrabold text-emerald-700">7</span>
                <span className="text-xs font-semibold text-emerald-800">Already Have</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="block text-xl font-extrabold text-rose-700">2</span>
                <span className="text-xs font-semibold text-rose-800">Need to Learn</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="block text-xl font-extrabold text-amber-700">2</span>
                <span className="text-xs font-semibold text-amber-800">Need to Demonstrate</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="block text-xl font-extrabold text-slate-700">1</span>
                <span className="text-xs font-semibold text-slate-800">Not Important</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            STEP-BY-STEP WORKFLOW
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Job-Ready Decoder Works
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            From raw PDFs to an airtight 30-day interview roadmap in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900">Choose Target Role</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select roles like Full Stack, Frontend, Backend, or define custom titles tailored to your dream opportunity.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900">Upload Resume & 3 JDs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your resume and 3 separate job descriptions in PDF, DOCX, or direct text paste.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900">4-Column Gap Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our engine finds recurring skills across &ge;2 JDs and classifies them against real proof in your resume.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900">Interview Drills & Plan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rehearse 8 predicted interview questions with STAR answers and execute a structured 30-day learning roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: SKILL GAP ANALYSIS */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              FEATURE 01: FOUR-COLUMN TAXONOMY
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Stop guessing what to prepare. <br />
              <span className="text-brand-600">See recurring skills instantly.</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Analyzing a single job description is misleading because one employer may have obscure requirements. Job-Ready Decoder compares <strong>three job descriptions simultaneously</strong>, highlighting only the skills that repeat in 2 of 3 (67%) or 3 of 3 (100%) postings.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                <strong>Already Have:</strong> Confirmed with project or internship evidence.
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
                <strong>Need to Learn:</strong> Critical gaps missing entirely from your background.
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                <strong>Need to Demonstrate:</strong> Skills known in theory but lacking metrics.
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0" />
                <strong>Not Important:</strong> Optional tools you consciously choose to defer.
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Interactive Gap Table Sample
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Skill</th>
                    <th className="p-3 text-center">Freq</th>
                    <th className="p-3 text-center text-emerald-700">Already</th>
                    <th className="p-3 text-center text-rose-700">Learn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold">React.js</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">3/3</span></td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Node.js</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">3/3</span></td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">AWS (Cloud)</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">3/3</span></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-rose-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Docker</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">3/3</span></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-rose-600 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERVIEW PREDICTION */}
      <section id="interview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Predicted Question #1</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Project-based</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              "Explain how you implemented JWT authentication and session security in your EduAI project."
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/90 text-xs text-slate-300 space-y-1.5 border border-slate-700">
              <strong className="text-white block font-semibold">Resume Evidence Cited:</strong>
              <p className="italic">"EduAI — Implemented JWT-based authentication with bcrypt password hashing and HTTP-only cookie session protection."</p>
            </div>
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-emerald-400 font-semibold">✓ Strictly Grounded Answer Ready</span>
              <span className="text-slate-400">STAR Format</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              FEATURE 02: 8 PREDICTED QUESTIONS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Predict what interviewers will ask <br />
              <span className="text-brand-600">before you step into the room.</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We generate exactly 8 tailored interview questions covering Technical, Project-based, Resume-based, Behavioral, Problem-solving, and Role-specific dimensions.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select your 3 toughest questions to unlock full STAR draft answers, common pitfalls to avoid, anticipated follow-up questions, and an interactive rehearsal editor to speak naturally in your own words.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: 30-DAY LEARNING PLAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            FEATURE 03: REALISTIC ROADMAP
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Turn Identified Gaps into a 30-Day Preparation Plan
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            No generic generic tutorials. A step-by-step weekly blueprint with concrete tasks and deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">WEEKS 1 & 2</span>
            <h4 className="font-bold text-base text-slate-900">Skill 1 Mastery & Integration</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master the highest-frequency missing skill (e.g. Docker containerization). Write production Dockerfiles and compose multi-service environments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">WEEKS 3 & 4</span>
            <h4 className="font-bold text-base text-slate-900">Skill 2 Primitives & Full CI/CD</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tackle the secondary recurring gap (e.g. AWS). Deploy full-stack apps with automated GitHub Actions pipelines and live cloud infrastructure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">DAYS 29 & 30</span>
            <h4 className="font-bold text-base text-slate-900">Revision & Role Simulation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              45-minute timed mock technical interviews, architectural defense drills, and resume updates to showcase your newly proven skills.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY JOB-READY DECODER */}
      <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              WHY JOB-READY DECODER?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Why Generic ATS Checkers Fall Short
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional resume checkers simply check keywords against a single job post, encouraging you to stuff keywords you don't even know. Job-Ready Decoder is an engineering preparation platform built to help you master what employers actually demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-base text-white">Triangulated Requirements</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                By requiring 3 JDs, noise and one-off employer quirks disappear. Only true industry patterns remain.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-base text-white">Evidence-Based Validation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never assume you know a skill just because it is written on your resume. We verify project evidence.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-base text-white">Zero Fictional Hallucinations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict grounding safeguards guarantee answers only reference your actual achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Ready to decode your target job and crack the interview?
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Start your analysis in seconds or test with our pre-loaded Full Stack Developer demo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              if (isAuthenticated) {
                onOpenNewAnalysis();
              } else {
                setActivePage('auth-signup');
              }
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
          >
            Get Started Now
          </button>
          <button
            onClick={handleTryDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-all cursor-pointer"
          >
            Launch Interactive Demo
          </button>
        </div>
      </section>
    </div>
  );
}
