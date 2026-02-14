import React, { useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionList = ({ onEdit }) => {
    const { transactions, deleteTransaction, loading, error } = useContext(TransactionContext);
    const [showAll, setShowAll] = React.useState(false);

    if (loading && transactions.length === 0) return <div>Loading transactions...</div>;
    if (error) return <div className="error">{error}</div>;
    if (transactions.length === 0 && !loading) return <div>No transactions found.</div>;

    const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

    return (
        <div className="transaction-list-container">
            <div className="transaction-list">
                <div className="transaction-list">
                    <div className="transaction-header">
                        <span className="t-col t-date">Date</span>
                        <span className="t-col t-category">Category</span>
                        <span className="t-col t-title">Title</span>
                        <span className="t-col t-notes">Notes</span>
                        <span className="t-col t-amount">Amount</span>
                        <span className="t-col t-actions">Actions</span>
                    </div>
                    {displayedTransactions.map(t => (
                        <div key={t.id} className="transaction-item">
                            <span className="t-col t-date">{t.date}</span>
                            <span className="t-col t-category">
                                <span className="category-badge" data-category={t.category}>{t.category}</span>
                            </span>
                            <span className="t-col t-title">{t.title}</span>
                            <span className="t-col t-notes" title={t.notes}>{t.notes || '-'}</span>
                            <span className={`t-col t-amount ${t.category === 'Income' ? 'income-text' : ''}`}>
                                {t.category === 'Income' ? '+' : ''}₹{t.amount.toFixed(2)}
                            </span>
                            <div className="t-col t-actions">
                                <button onClick={() => onEdit(t)}>Edit</button>
                                <button onClick={() => deleteTransaction(t.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!showAll && transactions.length > 5 && (
                <button onClick={() => setShowAll(true)} className="load-more-btn">
                    View More..
                </button>
            )}
        </div>
    );
};

export default TransactionList;
