import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        password_confirmation:
                            passwordConfirmation,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(
                        data.errors
                    )[0];

                    setError(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : 'Unable to create account.'
                    );
                } else {
                    setError(
                        data.message ||
                        'Unable to create account.'
                    );
                }

                return;
            }

            // The register endpoint already returns a token,
            // so we can authenticate the user immediately.
            localStorage.setItem('token', data.token);
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );

            // Refresh AuthContext state through login.
            await login(email, password);

            navigate('/shipping-labels');
        } catch {
            setError(
                'Unable to connect to the server.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1>Create account</h1>

                        <p>
                            Create an account to manage your
                            shipping labels.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >
                        <div className="form-field">
                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                required
                                maxLength={255}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
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
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                required
                                minLength={8}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password_confirmation">
                                Confirm password
                            </label>

                            <input
                                id="password_confirmation"
                                type="password"
                                value={
                                    passwordConfirmation
                                }
                                onChange={(event) =>
                                    setPasswordConfirmation(
                                        event.target.value
                                    )
                                }
                                required
                                minLength={8}
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
                                ? 'Creating account...'
                                : 'Create account'}
                        </button>
                    </form>

                    <div className="register-footer">
                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}