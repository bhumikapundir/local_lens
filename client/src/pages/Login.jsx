import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || '/feed';

    const [form, setForm] = useState({ email: '', password: '' });
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
            await login(form);
            navigate(redirectTo, { replace: true }); 
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
            <h1>Welcome back</h1>
            <p className="auth-subtitle">Log in to see what's happening near you.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <label className="auth-label" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="aarav@seed.locallens.dev"
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
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
                {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}

                <button type="submit" className="auth-button" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="auth-footer">
                New here? <Link to="/register">Create an account</Link>
            </p>
        </div>
    );
}

export default Login;