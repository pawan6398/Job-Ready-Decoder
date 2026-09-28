import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Compass, PlusCircle, LogOut, User, Menu, X, ArrowRight, Layers } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenNewAnalysis }) {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleDemoLaunch = async () => {
    if (!isAuthenticated) {
      await demoLogin();
    }
    setActivePage('dashboard');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div
            onClick={() => setActivePage(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Job-Ready <span className="text-brand-600">Decoder</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-600 font-medium tracking-wide uppercase">
                JD Skill & Interview Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setActivePage('landing')}
                  className={`text-sm font-semibold transition ${
                    activePage === 'landing' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <a
                  href="#how-it-works"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Features
                </a>
                <a
                  href="#why-us"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Why Decoder
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className={`text-sm font-semibold flex items-center gap-2 py-1.5 px-3 rounded-lg transition ${
                    activePage === 'dashboard'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => setActivePage('history')}
                  className={`text-sm font-semibold flex items-center gap-2 py-1.5 px-3 rounded-lg transition ${
                    activePage === 'history'
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Past Analyses
                </button>

                <button
                  onClick={onOpenNewAnalysis}
                  className="text-sm font-semibold flex items-center gap-2 py-2 px-4 rounded-xl bg-brand-600 text-white shadow-sm hover:bg-brand-700 transition shadow-brand-500/20 hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Analysis
                </button>
              </>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleDemoLaunch}
                  className="text-xs font-semibold px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  Try Demo (1-Click)
                </button>

                <button
                  onClick={() => setActivePage('auth-login')}
                  className="text-sm font-semibold px-4 py-2 text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </button>

                <button
                  onClick={() => setActivePage('auth-signup')}
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate pr-1">
                    {user?.name || 'My Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Signed In As</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePage('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Compass className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenNewAnalysis();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <PlusCircle className="w-4 h-4 text-slate-400" />
                      Create Analysis
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          setActivePage('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  setActivePage('landing');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Home
              </button>
              <button
                onClick={handleDemoLaunch}
                className="w-full py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-700 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Try Demo Account (1-Click)
              </button>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setActivePage('auth-login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActivePage('auth-signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold text-center"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="py-2 border-b border-slate-100 mb-2">
                <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  setActivePage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActivePage('history');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Past Analyses
              </button>
              <button
                onClick={() => {
                  onOpenNewAnalysis();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                New Analysis
              </button>
              <button
                onClick={() => {
                  logout();
                  setActivePage('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-rose-600 text-sm font-medium text-left"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
