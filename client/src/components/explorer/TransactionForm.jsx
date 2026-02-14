import React, { useState, useContext, useEffect } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionForm = ({ currentTransaction, onClose }) => {
    const { addTransaction, updateTransaction } = useContext(TransactionContext);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (currentTransaction) {
            setTitle(currentTransaction.title);
            setAmount(currentTransaction.amount);
            setCategory(currentTransaction.category);
            setDate(currentTransaction.date);
            setNotes(currentTransaction.notes || '');
        }
    }, [currentTransaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transactionData = {
            title,
            amount: parseFloat(amount),
            category,
            date,
            notes
        };

        let res;
        if (currentTransaction) {
            res = await updateTransaction(currentTransaction.id, transactionData);
        } else {
            res = await addTransaction(transactionData);
        }

        if (res.success) {
            if (onClose) onClose();
            // Reset form if not editing
            if (!currentTransaction) {
                setTitle('');
                setAmount('');
                setCategory('Food');
                setDate(new Date().toISOString().split('T')[0]);
                setNotes('');
            }
        } else {
            alert(res.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            {onClose && (
                <div className="close-btn" onClick={onClose}>
                    &times;
                </div>
            )}
            <h3 className="modal-title">{currentTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
            <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Income">Income</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="form-group">
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <button type="submit">{currentTransaction ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default TransactionForm;
