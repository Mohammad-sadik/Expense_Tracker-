import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/ui';
import { IndianRupee, Clock } from 'lucide-react';

const Dashboard = () => {
    // ... (unchanged)

    {/* Stats Grid */ }
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <Card className="stat-card">
                    <div className="stat-icon">
                        <IndianRupee className="h-8 w-8" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Expenses</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>₹{data.total.toFixed(2)}</p>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Transactions */}
                {/* ... (unchanged) */}
                                        <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', margin: 0 }}>
                                                <IndianRupee style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
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
                        </ul >
                    </Card >
                </div >

    {/* Category Breakdown */ }
    < div >
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
                </div >
            </div >
        </div >
    );
};

export default Dashboard;
