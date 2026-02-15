import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/ui';
import { DollarSign, Clock } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/transactions/dashboard');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2.5rem' }}>Loading dashboard...</div>;
    }

    if (!data) {
        return <div style={{ textAlign: 'center', padding: '2.5rem' }}>Error loading data.</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Dashboard</h1>

            {/* Stats Grid */}
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <Card className="stat-card">
                    <div className="stat-icon">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Expenses</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>₹{data.total.toFixed(2)}</p>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Transactions */}
                <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-color)' }}>Recent Transactions</h2>
                    <Card style={{ padding: 0, overflow: 'hidden' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {data.recent.length === 0 ? (
                                <li style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent transactions</li>
                            ) : (
                                data.recent.map((transaction) => (
                                    <li key={transaction.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <div className="flex-between">
                                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary)', margin: 0 }}>
                                                {transaction.title}
                                            </p>
                                            <span className="badge">
                                                {transaction.category}
                                            </span>
                                        </div>
                                        <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', margin: 0 }}>
                                                <DollarSign style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                                                {transaction.amount}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', margin: 0 }}>
                                                <Clock style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </Card>
                </div>

                {/* Category Breakdown */}
                <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-color)' }}>Expenses by Category</h2>
                    <Card>
                        {data.breakdown.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>No data available</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.breakdown.map((item) => (
                                    <li key={item.category} className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.category}</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-color)' }}>₹{item.total.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
