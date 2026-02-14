import React, { useContext, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/explorer/TransactionList';
import TransactionForm from '../components/explorer/TransactionForm';

const Explorer = () => {
    const {
        searchTerm, setSearchTerm,
        categoryFilter, setCategoryFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        minAmount, setMinAmount,
        maxAmount, setMaxAmount
    } = useContext(TransactionContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    return (
        <div className="explorer-page">
            <div className="explorer-header">
                <h2>Transactions</h2>
                <button onClick={handleAdd}>+ Add New</button>
            </div>

            <div className="filters-container">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="All">All Categories</option>
                        <option value="Income">Income</option>
                        <option value="Food">Food</option>
                        <option value="Rent">Rent</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="filters secondary-filters">
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        title="Start Date"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        title="End Date"
                    />
                    <input
                        type="number"
                        placeholder="Min Amount"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Amount"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />
                </div>
            </div>

            <TransactionList onEdit={handleEdit} />

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <TransactionForm
                            currentTransaction={editingTransaction}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explorer;
