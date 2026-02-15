import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';

function App() {
    return (
        <AuthProvider>
            <TransactionProvider>
                <Router>
                    <div className="app-container">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/explorer" element={<Explorer />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </TransactionProvider>
        </AuthProvider>
    );
}

export default App;
