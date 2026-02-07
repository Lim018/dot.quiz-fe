import { decode } from 'html-entities';

const BASE_URL = 'https://opentdb.com/api.php';

// Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function fetchQuestions({ amount = 10, category = 9, type = 'multiple' }) {
    const params = new URLSearchParams({
        amount: amount.toString(),
        category: category.toString(), // General Knowledge
        type,
        encode: 'url3986'
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }

    const data = await response.json();

    if (data.response_code !== 0) {
        throw new Error('No questions available. Please try again.');
    }

    // Decode and shuffle questions, then shuffle answers
    const decodedQuestions = data.results.map((q, index) => ({
        id: `q_${index}_${Date.now()}`,
        category: decode(decodeURIComponent(q.category)),
        type: q.type,
        difficulty: q.difficulty,
        question: decode(decodeURIComponent(q.question)),
        correct_answer: decode(decodeURIComponent(q.correct_answer)),
        incorrect_answers: q.incorrect_answers.map(a => decode(decodeURIComponent(a))),
        all_answers: shuffleArray([
            decode(decodeURIComponent(q.correct_answer)),
            ...q.incorrect_answers.map(a => decode(decodeURIComponent(a)))
        ])
    }));

    // Shuffle questions order so each user gets different order
    return shuffleArray(decodedQuestions);
}
