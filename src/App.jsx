import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizProvider, useQuiz } from './contexts/QuizContext';
import LoginPage from './pages/LoginPage';
import QuizSetupPage from './pages/QuizSetupPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ResumeModal from './components/ResumeModal';
import './index.css';

function AppContent() {
  const { user } = useAuth();
  const { quizState, hasUnfinishedQuiz, resetQuiz } = useQuiz();
  const [currentPage, setCurrentPage] = useState('login');
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (!user.isLoggedIn) {
      setCurrentPage('login');
    } else if (hasUnfinishedQuiz) {
      setShowResumeModal(true);
    } else if (quizState.status === 'FINISHED') {
      setCurrentPage('result');
    } else {
      setCurrentPage('setup');
    }
  }, [user.isLoggedIn]);

  const handleLoginSuccess = () => {
    if (hasUnfinishedQuiz) {
      setShowResumeModal(true);
    } else {
      setCurrentPage('setup');
    }
  };

  const handleQuizStart = () => {
    if (quizState.status === 'IN_PROGRESS') {
      setCurrentPage('quiz');
    }
  };

  const handleQuizFinish = () => {
    setCurrentPage('result');
  };

  const handleRetry = () => {
    setCurrentPage('setup');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleContinueQuiz = () => {
    setShowResumeModal(false);
    setCurrentPage('quiz');
  };

  const handleNewQuiz = () => {
    resetQuiz();
    setShowResumeModal(false);
    setCurrentPage('setup');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  useEffect(() => {
    if (quizState.status === 'IN_PROGRESS' && currentPage === 'setup') {
      setCurrentPage('quiz');
    }
  }, [quizState.status, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onSuccess={handleLoginSuccess} />;
      case 'setup':
        return (
          <QuizSetupPage
            onStart={handleQuizStart}
            onBack={handleBackToLogin}
          />
        );
      case 'quiz':
        return <QuizPage onFinish={handleQuizFinish} />;
      case 'result':
        return <ResultPage onRetry={handleRetry} onLogout={handleLogout} />;
      default:
        return <LoginPage onSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      {renderPage()}
      {showResumeModal && (
        <ResumeModal
          onContinue={handleContinueQuiz}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
