import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo">
                    <span>🔷</span> Bellcorp
                </div>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                            📊 Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/explorer" className={({ isActive }) => isActive ? 'active' : ''}>
                            📑 Transactions
                        </NavLink>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-btn">
                    Logout {user?.name ? `(${user.name})` : ''}
                </button>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
