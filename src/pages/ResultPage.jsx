import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';

export default function ResultPage({ onRetry, onLogout }) {
    const { quizState, resetQuiz } = useQuiz();
    const { logout } = useAuth();
    const [showReview, setShowReview] = useState(false);

    const { questions, userAnswers } = quizState;

    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A', message: 'Excellent! 🎉', class: 'score-circle--a' };
        if (percentage >= 75) return { grade: 'B', message: 'Great job! 👏', class: 'score-circle--b' };
        if (percentage >= 60) return { grade: 'C', message: 'Good effort! 💪', class: 'score-circle--c' };
        if (percentage >= 50) return { grade: 'D', message: 'Keep practicing! 📚', class: 'score-circle--d' };
        return { grade: 'F', message: 'Try again! 🔄', class: 'score-circle--f' };
    };

    const result = getGrade();

    const handleRetry = () => {
        resetQuiz();
        onRetry?.();
    };

    const handleLogout = () => {
        resetQuiz();
        logout();
        onLogout?.();
    };

    return (
        <div className="page">
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card text-center">
                    <h1 className="mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                        🎉 Quiz Complete!
                    </h1>

                    <div className={`score-circle ${result.class}`}>
                        <span className="score-circle__percentage">{percentage}%</span>
                        <span className="score-circle__grade">{result.grade}</span>
                    </div>

                    <p className="mb-6" style={{ fontSize: 'var(--text-lg)', fontWeight: '600' }}>
                        {result.message}
                    </p>

                    <div className="stats-grid mb-6">
                        <div className="stat stat--success">
                            <div className="stat__value">{correctAnswers}</div>
                            <div className="stat__label">Correct</div>
                        </div>
                        <div className="stat stat--danger">
                            <div className="stat__value">{totalQuestions - correctAnswers}</div>
                            <div className="stat__label">Wrong</div>
                        </div>
                        <div className="stat">
                            <div className="stat__value">{totalQuestions}</div>
                            <div className="stat__label">Total</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <button className="btn btn--primary btn--full" onClick={handleRetry}>
                            📝 Try Another Quiz
                        </button>
                        <button className="btn btn--outlined btn--full" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>

                    <div className="review-section">
                        <button
                            className="review-toggle"
                            onClick={() => setShowReview(!showReview)}
                        >
                            <span>▶ Review Answers</span>
                            <span>{showReview ? '▲' : '▼'}</span>
                        </button>

                        {showReview && (
                            <div className="review-list">
                                {questions.map((q, index) => {
                                    const userAnswer = userAnswers[index];
                                    const isCorrect = userAnswer?.isCorrect;

                                    return (
                                        <div
                                            key={q.id}
                                            className={`review-item ${isCorrect ? 'review-item--correct' : 'review-item--wrong'}`}
                                        >
                                            <div className="review-item__question">
                                                <strong>Q{index + 1}:</strong> {q.question}
                                            </div>
                                            <div className="review-item__answer">
                                                Your answer: {userAnswer?.selectedAnswer || 'Not answered'}
                                                {isCorrect ? ' ✅' : ' ❌'}
                                            </div>
                                            {!isCorrect && (
                                                <div className="review-item__correct">
                                                    Correct: {q.correct_answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
