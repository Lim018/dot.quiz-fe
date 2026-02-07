import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage({ onSuccess }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        login(name.trim());
        onSuccess?.();
    };

    return (
        <div className="page page-centered">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-8">
                    <h1 className="mb-4" style={{ fontSize: 'var(--text-xl)', color: 'var(--primary)' }}>
                        🎯 dot.quiz
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Test Your Knowledge!
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-6">
                        <label htmlFor="name" className="input-label">
                            👤 Enter your name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={`input ${error ? 'input--error' : ''}`}
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            autoFocus
                            autoComplete="name"
                        />
                        {error && <span className="input-error-text">{error}</span>}
                    </div>

                    <button type="submit" className="btn btn--primary btn--full btn--lg">
                        START QUIZ →
                    </button>
                </form>
            </div>
        </div>
    );
}
