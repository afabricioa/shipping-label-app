import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import '../styles/ShippingLabels.css';
import type { ShippingLabel } from '../types/shippingLabels';
import { useNavigate } from 'react-router-dom';

export default function ShippingLabels() {
    const { user, logout } = useAuth();

    const [labels, setLabels] = useState<ShippingLabel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const loadLabels = async () => {
            try {
                const response = await api.get<ShippingLabel[]>(
                    '/shipping-labels'
                );

                setLabels(response.data);
            } catch {
                setError(
                    'Unable to load shipping labels.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadLabels();
    }, []);

    if (loading) {
        return (
            <div className="shipping-page">
                <div className="loading-state">
                    Loading shipping labels...
                </div>
            </div>
        );
    }

    return (
        <div className="shipping-page">
            <header className="shipping-header">
                <h1>Shipping Labels</h1>

                <div className="shipping-user">
                    <span>
                        Welcome, {user?.name}
                    </span>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="shipping-content">
                <div className="shipping-title-row">
                    <div className="shipping-title">
                        <h2>Your labels</h2>

                        <p>
                            View and manage your USPS shipping labels.
                        </p>
                    </div>

                    <button
                        className="new-label-button"
                        onClick={() => navigate('/shipping-labels/new')}
                    >
                        + New Label
                    </button>
                </div>

                {error && (
                    <div className="error-state">
                        {error}
                    </div>
                )}

                {!error && labels.length === 0 && (
                    <div className="labels-card">
                        <div className="empty-state">
                            <h3>
                                No shipping labels yet
                            </h3>

                            <p>
                                Create your first shipping label
                                to see it here.
                            </p>
                        </div>
                    </div>
                )}

                {labels.length > 0 && (
                    <div className="labels-card">
                        <table className="labels-table">
                            <thead>
                                <tr>
                                    <th>Carrier</th>
                                    <th>Service</th>
                                    <th>Rate</th>
                                    <th>Tracking</th>
                                    <th>Status</th>
                                    <th>Purchased At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {labels.map((label) => (
                                    <tr key={label.id}>
                                        <td>
                                            {label.carrier}
                                        </td>

                                        <td>
                                            {label.service}
                                        </td>

                                        <td>
                                            {label.currency}{' '}
                                            {label.rate}
                                        </td>

                                        <td>
                                            {label.tracking_code ||
                                                '-'}
                                        </td>

                                        <td>
                                            <span className="status-badge">
                                                {label.status}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(label.created_at).toLocaleString(
                                                'en-US',
                                                {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                }
                                            )}
                                        </td>

                                        <td>
                                            <a
                                                className="label-link"
                                                href={
                                                    label.label_pdf_url ||
                                                    label.label_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Label
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}