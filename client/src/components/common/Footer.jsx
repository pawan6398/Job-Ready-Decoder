import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                Job-Ready <span className="text-brand-600">Decoder</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Analyze real job descriptions against your resume, discover the skills employers repeatedly ask for, predict interview questions, and build a focused 30-day preparation plan.
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1 pt-2">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for final-year students, fresh grads, and tech professionals.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => setActivePage('landing')} className="hover:text-brand-600 transition">
                  Overview
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-600 transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-600 transition">
                  Skill Frequency Analysis
                </a>
              </li>
              <li>
                <a href="#interview" className="hover:text-brand-600 transition">
                  Interview Predictor
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <span className="text-slate-600">Resume Evidence Guide</span>
              </li>
              <li>
                <span className="text-slate-600">30-Day Roadmap Methodology</span>
              </li>
              <li>
                <span className="text-slate-600">API Documentation</span>
              </li>
              <li>
                <span className="text-slate-600">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} Job-Ready Decoder. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Production Quality Architecture</span>
            <span>Zero Hallucinations Guarantee</span>
            <span>Deterministic Grounding</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
