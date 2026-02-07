import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';

export default function QuizSetupPage({ onStart, onBack }) {
    const { user } = useAuth();
    const { startQuiz, isLoading, error } = useQuiz();

    const handleStart = async () => {
        await startQuiz();
        onStart?.();
    };

    return (
        <div className="page">
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div className="header">
                    <button className="header__back" onClick={onBack}>
                        ← Back
                    </button>
                    <span className="header__user">Hi, {user.name}!</span>
                </div>

                <div className="card text-center mt-6">
                    <h2 className="mb-6" style={{ fontSize: 'var(--text-lg)' }}>
                        🎮 Quiz Info
                    </h2>

                    <div className="card mb-6" style={{ background: 'var(--bg-primary)' }}>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span>📝 Total Questions</span>
                                <strong>10</strong>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>⏱️ Time Limit</span>
                                <strong>5 minutes</strong>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4" style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)' }}>
                            {error}
                        </div>
                    )}

                    <button
                        className="btn btn--primary btn--full btn--lg"
                        onClick={handleStart}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Loading...
                            </>
                        ) : (
                            '🚀 START QUIZ'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
