import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/shipping-labels');
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Unable to login.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Shipping Labels</h1>

                        <p>
                            Sign in to manage your shipping labels
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >
                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? 'Signing in...'
                                : 'Sign in'}
                        </button>
                    </form>
                    <div className="login-footer">
                        <span>Don't have an account?</span>

                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            Create account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}