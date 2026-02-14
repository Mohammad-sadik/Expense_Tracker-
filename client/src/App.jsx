import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import './index.css';

const Navigation = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav className="main-nav">
            <div className="nav-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/explorer" className="nav-link">Explorer</Link>
            </div>
            <div className="user-info">
                <span>Welcome, {user.name}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <TransactionProvider>
                <Router>
                    <div className="app-container">
                        <Navigation />
                        <div className="content-container">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/explorer"
                                    element={
                                        <ProtectedRoute>
                                            <Explorer />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </div>
                </Router>
            </TransactionProvider>
        </AuthProvider>
    );
}

export default App;
