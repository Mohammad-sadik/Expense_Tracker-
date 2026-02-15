import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, LogOut, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transactions', icon: List },
    ];

    return (
        <div className="layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>Bellcorp Expense</span>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0.5rem' }}>
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="nav-icon" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <User style={{ width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                        </div>
                        <div style={{ marginLeft: '0.75rem' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-color)' }}>
                                {user?.name}
                            </p>
                            <button
                                onClick={logout}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}
                            >
                                <LogOut style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
