import { useQuiz } from '../contexts/QuizContext';

export default function ResumeModal({ onContinue, onNewQuiz }) {
    const { quizState } = useQuiz();

    const { currentIndex, questions, timeLeft } = quizState;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal text-center">
                <h2 className="mb-6" style={{ fontSize: 'var(--text-lg)' }}>
                    📚 Welcome Back!
                </h2>

                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    You have an unfinished quiz:
                </p>

                <div className="card mb-6" style={{ background: 'var(--bg-primary)' }}>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span>Progress</span>
                            <strong>{currentIndex + 1}/{questions.length} questions</strong>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Time left</span>
                            <strong>{formatTime(timeLeft)}</strong>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button className="btn btn--secondary btn--full" onClick={onContinue}>
                        ▶ Continue Quiz
                    </button>
                    <button className="btn btn--outlined btn--full" onClick={onNewQuiz}>
                        🔄 Start New Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
