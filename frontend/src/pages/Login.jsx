import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h3 className="auth-title">Login to System</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input type="text" placeholder="Username"
                            className="form-input"
                            value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" placeholder="Password"
                            className="form-input"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <button className="btn btn-primary">Login</button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.875rem' }}>Don't have an account? Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
