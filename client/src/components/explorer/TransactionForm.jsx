import React, { useState, useContext, useEffect } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionForm = ({ existingTransaction, onSuccess }) => {
    const { addTransaction, updateTransaction } = useContext(TransactionContext);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingTransaction) {
            setTitle(existingTransaction.title);
            setAmount(existingTransaction.amount);
            setCategory(existingTransaction.category);
            setDate(existingTransaction.date);
            setNotes(existingTransaction.notes || '');
        }
    }, [existingTransaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const transactionData = {
            title,
            amount: parseFloat(amount),
            category,
            date,
            notes
        };

        let res;
        if (existingTransaction) {
            res = await updateTransaction(existingTransaction.id, transactionData);
        } else {
            res = await addTransaction(transactionData);
        }

        if (res.success) {
            // Reset form if adding new
            if (!existingTransaction) {
                setTitle('');
                setAmount('');
                setCategory('Food');
                setDate(new Date().toISOString().split('T')[0]);
                setNotes('');
            }
            if (onSuccess) onSuccess();
        } else {
            setError(res.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Grocery Shopping"
                />
            </div>

            <div className="form-group">
                <label>Amount (₹)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>

            <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Income">Income</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add details..."
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => onSuccess && onSuccess()}>Cancel</button>
                <button type="submit" className="btn-primary">
                    {existingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
