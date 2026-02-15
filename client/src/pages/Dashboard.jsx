import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
    if (error) return <div className="error">{error}</div>;
    if (!summary) return null;

    return (
        <div className="dashboard-page">
            <h2>Financial Summary</h2>

            <div className="dashboard-summary-cards">
                <div className="summary-card income">
                    <h3>Total Income</h3>
                    <p className="total-amount">₹{summary.totalIncome.toFixed(2)}</p>
                </div>
                <div className="summary-card expense">
                    <h3>Total Expenses</h3>
                    <p className="total-amount">₹{Math.abs(summary.totalExpenses).toFixed(2)}</p>
                </div>
                <div className="summary-card balance">
                    <h3>Total Balance</h3>
                    <p className="total-amount">₹{(summary.totalIncome + summary.totalExpenses).toFixed(2)}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="category-section">
                    <h3>Category Breakdown</h3>
                    <div className="category-grid">
                        {summary.categoryBreakdown.map((cat) => (
                            <div key={cat.category} className="category-card">
                                <h4>{cat.category}</h4>
                                <p>₹{Math.abs(parseFloat(cat.total)).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="recent-section">
                    <h3>Recent Transactions</h3>
                    <div className="transaction-list">
                        {summary.recentTransactions.map(t => (
                            <div key={t.id} className="transaction-item compact">
                                <div className="t-info">
                                    <span className="t-date">{t.date}</span>
                                    <span className="t-title">{t.title}</span>
                                </div>
                                <div className={`t-amount ${t.category === 'Income' ? 'income-text' : ''}`}>
                                    {t.category === 'Income' ? '+' : ''}₹{t.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                        {summary.recentTransactions.length === 0 && <p>No recent transactions.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
