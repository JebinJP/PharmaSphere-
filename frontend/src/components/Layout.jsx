import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>PharmaOS</h1>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Welcome, {user?.username}</p>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/inventory" className="nav-link">Inventory</Link>
                    <Link to="/prescriptions" className="nav-link">Prescriptions</Link>
                    <Link to="/sales" className="nav-link">Sales & Forecast</Link>
                    <Link to="/chat" className="nav-link">AI Assistant</Link>
                    <button onClick={logout} className="nav-link btn-danger" style={{ marginTop: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit' }}>
                        Logout
                    </button>
                </nav>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
