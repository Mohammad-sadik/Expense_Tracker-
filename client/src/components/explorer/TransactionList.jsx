import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import TransactionForm from './TransactionForm';
import SearchBar from './SearchBar';
import { formatCurrency } from '../../utils';

const TransactionList = () => {
    const {
        transactions,
        loading,
        error,
        deleteTransaction,
        loadMore, hasMore
    } = useContext(TransactionContext);

    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            const res = await deleteTransaction(id);
            if (!res.success) {
                alert(res.error);
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    if (loading && transactions.length === 0) return <div>Loading transactions...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="transaction-list-container">
            <div className="list-header">
                <h3>Transactions</h3>
                <button className="btn-primary" onClick={handleAddNew}>+ Add New</button>
            </div>

            <SearchBar />

            <div className="transaction-list">
                <div className="transaction-header">
                    <div className="t-col">Date</div>
                    <div className="t-col">Category</div>
                    <div className="t-col">Title</div>
                    <div className="t-col">Notes</div>
                    <div className="t-col" style={{ textAlign: 'right' }}>Amount</div>
                    <div className="t-col" style={{ textAlign: 'center' }}>Actions</div>
                </div>

                {transactions.map(t => (
                    <div key={t.id} className="transaction-item">
                        <div className="t-col t-date">{t.date}</div>
                        <div className="t-col">
                            <span className="category-badge" data-category={t.category}>{t.category}</span>
                        </div>
                        <div className="t-col t-title" title={t.title}>{t.title}</div>
                        <div className="t-col t-notes" title={t.notes}>{t.notes}</div>
                        <div className={`t-col t-amount ${t.category === 'Income' ? 'income-text' : 'expense-text'}`}>
                            {t.category === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                        </div>
                        <div className="t-col t-actions" style={{ textAlign: 'center' }}>
                            <button className="btn-icon edit" onClick={() => handleEdit(t)}>✎</button>
                            <button className="btn-icon delete" onClick={() => handleDelete(t.id)}>🗑</button>
                        </div>
                    </div>
                ))}

                {transactions.length === 0 && <p style={{ padding: '1rem', textAlign: 'center' }}>No transactions found.</p>}
            </div>

            {hasMore && (
                <button className="load-more-btn" onClick={loadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'View More Transactions'}
                </button>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <TransactionForm
                            existingTransaction={editingTransaction}
                            onSuccess={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
