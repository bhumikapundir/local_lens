import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setSubmitting(true);

        try {
            await register(form);
            navigate('/feed');
        } catch (err) {
            setError(err.message);
            const map = {};
            (err.errors || []).forEach((item) => {
                map[item.field] = item.message;
            });
            setFieldErrors(map);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-card">
            <h1>Create account</h1>
            <p className="auth-subtitle">Join your neighborhood's community.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <label className="auth-label" htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="auth-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                />
                {fieldErrors.name && <span className="auth-field-error">{fieldErrors.name}</span>}

                <label className="auth-label" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                />
                {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}

                <label className="auth-label" htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="auth-input"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                />
                {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}

                <button type="submit" className="auth-button" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p className="auth-footer">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;