import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchQuestions } from '../services/quizAPI';

const QuizContext = createContext();

const STORAGE_KEY = 'QUIZ_STATE';
const TOTAL_QUESTIONS = 10;
const TOTAL_TIME = 300;
const AUTO_SAVE_INTERVAL = 5000;

const getInitialState = () => ({
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    timeLeft: TOTAL_TIME,
    totalTime: TOTAL_TIME,
    status: 'IDLE',
    totalQuestions: TOTAL_QUESTIONS,
});

export function QuizProvider({ children }) {
    const [quizState, setQuizState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.status === 'IN_PROGRESS') {
                return parsed;
            }
        }
        return getInitialState();
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (quizState.status === 'IN_PROGRESS') {
            const saveInterval = setInterval(() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
            }, AUTO_SAVE_INTERVAL);

            return () => clearInterval(saveInterval);
        }
    }, [quizState]);

    useEffect(() => {
        if (quizState.status !== 'IN_PROGRESS') return;

        const timer = setInterval(() => {
            setQuizState(prev => {
                if (prev.timeLeft <= 1) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        ...prev,
                        timeLeft: 0,
                        status: 'FINISHED'
                    }));
                    return { ...prev, timeLeft: 0, status: 'FINISHED' };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizState.status]);

    // Save on state change during quiz
    useEffect(() => {
        if (quizState.status === 'IN_PROGRESS' || quizState.status === 'FINISHED') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
        }
    }, [quizState.userAnswers, quizState.currentIndex, quizState.status]);

    const startQuiz = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const questions = await fetchQuestions({ amount: TOTAL_QUESTIONS });
            const newState = {
                ...getInitialState(),
                questions,
                status: 'IN_PROGRESS',
            };
            setQuizState(newState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } catch (err) {
            setError(err.message || 'Failed to fetch questions');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const answerQuestion = useCallback((answer) => {
        setQuizState(prev => {
            const currentQuestion = prev.questions[prev.currentIndex];
            const isCorrect = answer === currentQuestion.correct_answer;

            const newAnswers = [...prev.userAnswers, {
                questionId: currentQuestion.id,
                selectedAnswer: answer,
                isCorrect,
                timeSpent: prev.totalTime - prev.timeLeft
            }];

            const isLastQuestion = prev.currentIndex === prev.questions.length - 1;

            const newState = {
                ...prev,
                userAnswers: newAnswers,
                currentIndex: isLastQuestion ? prev.currentIndex : prev.currentIndex + 1,
                status: isLastQuestion ? 'FINISHED' : 'IN_PROGRESS'
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    const resetQuiz = useCallback(() => {
        setQuizState(getInitialState());
        localStorage.removeItem(STORAGE_KEY);
        setError(null);
    }, []);

    const resumeQuiz = useCallback(() => {
        if (quizState.status === 'IN_PROGRESS') {
            return true;
        }
        return false;
    }, [quizState.status]);

    const hasUnfinishedQuiz = quizState.status === 'IN_PROGRESS' && quizState.questions.length > 0;

    return (
        <QuizContext.Provider value={{
            quizState,
            isLoading,
            error,
            hasUnfinishedQuiz,
            startQuiz,
            answerQuestion,
            resetQuiz,
            resumeQuiz
        }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
