import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import BalanceChart from '../components/dashboard/BalanceChart';
import { formatCurrency } from '../utils';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('/api/transactions/summary');
                setSummary(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load summary');
                setLoading(false);
            }
        };

        if (user) {
            fetchSummary();
        }
    }, [user]);

    if (loading) return <div>Loading summary...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!summary) return null;

    return (
        <div className="dashboard-page">
            <h2>Financial Summary</h2>

            <SummaryCards summary={summary} />

            {/* Charts Section */}
            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
                <div className="chart-section" style={{
                    background: 'var(--surface-glass)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-glass)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                    <BalanceChart summary={summary} />
                </div>
                <div className="chart-section" style={{
                    background: 'var(--surface-glass)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-glass)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                    <ExpenseChart categoryBreakdown={summary.categoryBreakdown} />
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="category-section">
                    <h3>Category Details</h3>
                    <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {summary.categoryBreakdown.map((cat) => (
                            <div key={cat.category} className="category-card" style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{cat.category}</h4>
                                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(Math.abs(parseFloat(cat.total)))}</p>
                            </div>
                        ))}
                        {summary.categoryBreakdown.length === 0 && <p>No expense data.</p>}
                    </div>
                </div>

                <RecentTransactions transactions={summary.recentTransactions} />
            </div>
        </div>
    );
};

export default Dashboard;
