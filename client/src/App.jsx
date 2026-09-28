import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CreateAnalysisPage from './pages/CreateAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import HistoryPage from './pages/HistoryPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { error } = useToast();

  const [activePage, setActivePage] = useState('landing');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Auto-redirect to dashboard on initial load if logged in
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && activePage === 'landing') {
        setActivePage('dashboard');
      }
    }
  }, [loading, isAuthenticated]);

  const handleOpenNewAnalysis = () => {
    if (!isAuthenticated) {
      setActivePage('auth-login');
      return;
    }
    setActivePage('create');
  };

  const handleAnalysisCreated = (newAnalysis) => {
    setSelectedAnalysis(newAnalysis);
    setActivePage('detail');
  };

  const handleSelectAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    setActivePage('detail');
  };

  const handleDeleteAnalysis = (deletedId) => {
    if (selectedAnalysis?._id === deletedId || selectedAnalysis?.id === deletedId) {
      setSelectedAnalysis(null);
    }
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenNewAnalysis={handleOpenNewAnalysis}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onOpenNewAnalysis={handleOpenNewAnalysis}
          />
        )}

        {(activePage === 'auth-login' || activePage === 'auth-signup') && (
          <AuthPage
            initialMode={activePage === 'auth-signup' ? 'signup' : 'login'}
            setActivePage={setActivePage}
            onSuccess={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            onOpenNewAnalysis={handleOpenNewAnalysis}
            onSelectAnalysis={handleSelectAnalysis}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'create' && (
          <CreateAnalysisPage
            onAnalysisCreated={handleAnalysisCreated}
            onClose={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'detail' && (
          <AnalysisDetailPage
            analysis={selectedAnalysis}
            onUpdateAnalysis={(updated) => setSelectedAnalysis(updated)}
            onBackToDashboard={() => setActivePage('dashboard')}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            onSelectAnalysis={handleSelectAnalysis}
            onOpenNewAnalysis={handleOpenNewAnalysis}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
