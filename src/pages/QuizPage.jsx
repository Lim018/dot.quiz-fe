import { useState, useEffect, useCallback } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export default function QuizPage({ onFinish }) {
    const { quizState, answerQuestion } = useQuiz();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { questions, currentIndex, timeLeft, totalTime, status } = quizState;
    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (status === 'FINISHED') {
            onFinish?.();
        }
    }, [status, onFinish]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const timePercentage = (timeLeft / totalTime) * 100;
    const timerClass = timePercentage < 10
        ? 'timer__display--danger'
        : timePercentage < 25
            ? 'timer__display--warning'
            : '';

    const handleAnswer = useCallback((answer) => {
        if (selectedAnswer !== null || isTransitioning) return;

        setSelectedAnswer(answer);
        setIsTransitioning(true);

        setTimeout(() => {
            answerQuestion(answer);
            setSelectedAnswer(null);
            setIsTransitioning(false);
        }, 300);
    }, [selectedAnswer, isTransitioning, answerQuestion]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (selectedAnswer !== null || isTransitioning) return;

            const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
            const index = keyMap[e.key.toLowerCase()];

            if (index !== undefined && currentQuestion?.all_answers[index]) {
                handleAnswer(currentQuestion.all_answers[index]);
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [currentQuestion, handleAnswer, selectedAnswer, isTransitioning]);

    if (!currentQuestion) {
        return (
            <div className="page page-centered">
                <div className="spinner"></div>
                <p className="mt-4">Loading question...</p>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 'var(--space-6)' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>

                <div className="flex justify-between items-center mb-4">
                    <div className={`timer__display ${timerClass}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                    <span style={{ fontWeight: '600' }}>
                        {currentIndex + 1}/{questions.length}
                    </span>
                </div>

                <div className="progress-bar mb-6">
                    <div
                        className="progress-bar__fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="card mb-6">
                    <h2
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: '600',
                            lineHeight: '1.5',
                            textTransform: 'none',
                            letterSpacing: 'normal'
                        }}
                    >
                        {currentQuestion.question}
                    </h2>
                </div>

                <div className="answer-grid">
                    {currentQuestion.all_answers.map((answer, index) => {
                        const letter = String.fromCharCode(65 + index);
                        const isSelected = selectedAnswer === answer;

                        return (
                            <button
                                key={`${currentQuestion.id}-${index}`}
                                className={`answer-btn ${isSelected ? 'answer-btn--selected' : ''}`}
                                onClick={() => handleAnswer(answer)}
                                disabled={selectedAnswer !== null}
                            >
                                <span className="answer-btn__letter">{letter}</span>
                                <span>{answer}</span>
                            </button>
                        );
                    })}
                </div>

                <p className="text-center mt-6" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    Press A, B, C, or D to answer quickly
                </p>
            </div>
        </div>
    );
}
