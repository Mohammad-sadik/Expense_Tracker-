import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentTransactions from '../components/dashboard/RecentTransactions';
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

            <div className="dashboard-grid">
                <div className="category-section">
                    <h3>Category Breakdown</h3>
                    <div className="category-grid">
                        {summary.categoryBreakdown.map((cat) => (
                            <div key={cat.category} className="category-card">
                                <h4>{cat.category}</h4>
                                <p>{formatCurrency(Math.abs(parseFloat(cat.total)))}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <RecentTransactions transactions={summary.recentTransactions} />
            </div>
        </div>
    );
};

export default Dashboard;
