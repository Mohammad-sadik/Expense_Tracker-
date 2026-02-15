import React from 'react';
import { formatCurrency } from '../../utils';

const RecentTransactions = ({ transactions }) => {
    return (
        <div className="recent-section">
            <h3>Recent Transactions</h3>
            <div className="transaction-list">
                {transactions.map(t => (
                    <div key={t.id} className="transaction-item compact">
                        <div className="t-info">
                            <span className="t-date">{t.date}</span>
                            <span className="t-title">{t.title}</span>
                        </div>
                        <div className={`t-amount ${t.category === 'Income' ? 'income-text' : 'expense-text'}`}>
                            {t.category === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                        </div>
                    </div>
                ))}
                {transactions.length === 0 && <p>No recent transactions.</p>}
            </div>
        </div>
    );
};

export default RecentTransactions;
