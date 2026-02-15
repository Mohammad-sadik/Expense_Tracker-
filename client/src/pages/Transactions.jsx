import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button, Input, Card } from '../components/ui';
import { Plus, Trash, Edit, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Transactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Read initial state from URL or defaults
    const initialFilters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const page = parseInt(searchParams.get('page')) || 1;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = { ...filters, page, limit: 10 };
            const res = await api.get('/transactions', { params });
            setTransactions(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters, page]); // Only fetch when filters or page changes

    // Separate effect for URL synchronization to avoid loops
    useEffect(() => {
        const currentSearchParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                currentSearchParams.set(key, filters[key]);
            }
        });
        if (page > 1) {
            currentSearchParams.set('page', page.toString());
        }
        setSearchParams(currentSearchParams);
    }, [filters, page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        // Reset page to 1 when filters change
        const currentSearchParams = new URLSearchParams(searchParams);
        currentSearchParams.set(name, value);
        currentSearchParams.set('page', '1');
        setSearchParams(currentSearchParams);
    };

    const setPage = (newPage) => {
        const currentSearchParams = new URLSearchParams(searchParams);
        currentSearchParams.set('page', newPage.toString());
        setSearchParams(currentSearchParams);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const openModal = (transaction = null) => {
        if (transaction) {
            setCurrentTransaction(transaction);
            setFormData({
                title: transaction.title,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
                notes: transaction.notes || ''
            });
        } else {
            setCurrentTransaction(null);
            setFormData({
                title: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTransaction) {
                await api.put(`/transactions/${currentTransaction.id}`, formData);
            } else {
                await api.post('/transactions', formData);
            }
            setIsModalOpen(false);
            fetchTransactions();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-color)' }}>Transactions</h1>
                <Button onClick={() => openModal()} style={{ width: 'auto' }}>
                    <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} /> Add Transaction
                </Button>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <Input
                        name="search"
                        placeholder="Search..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        style={{ marginBottom: 0 }}
                    />
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <select
                            name="category"
                            className="input-field"
                            value={filters.category}
                            onChange={handleFilterChange}
                            style={{ fontFamily: 'inherit' }}
                        >
                            <option value="">All Categories</option>
                            <option value="Basic Living">Basic Living</option>
                            <option value="Transport">Transport</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Health">Health</option>
                            <option value="Growth">Growth</option>
                            <option value="Work">Work</option>
                            <option value="Financial">Financial</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <Input
                        name="startDate"
                        type="date"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        style={{ marginBottom: 0 }}
                    />
                    <Input
                        name="endDate"
                        type="date"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        style={{ marginBottom: 0 }}
                    />
                </div>
            </Card>

            {/* Table */}
            <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                {loading ? (
                    <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>₹{t.amount}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{t.category}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{t.date}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => openModal(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '1rem' }}>
                                                <Edit style={{ width: '1rem', height: '1rem' }} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                                <Trash style={{ width: '1rem', height: '1rem' }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex-between">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{ width: 'auto', opacity: page === 1 ? 0.5 : 1 }}
                >
                    Previous
                </Button>
                <span style={{ color: 'var(--text-color)' }}>Page {page} of {totalPages}</span>
                <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    style={{ width: 'auto', opacity: page === totalPages ? 0.5 : 1 }}
                >
                    Next
                </Button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-color)', margin: 0 }}>
                                {currentTransaction ? 'Edit Transaction' : 'Add Transaction'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X style={{ width: '1.5rem', height: '1.5rem' }} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="Title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <Input
                                label="Amount"
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                            <div className="input-group">
                                <label className="input-label">Category</label>
                                <select
                                    className="input-field"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ fontFamily: 'inherit' }}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Basic Living">Basic Living</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Health">Health</option>
                                    <option value="Growth">Growth</option>
                                    <option value="Work">Work</option>
                                    <option value="Financial">Financial</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="Date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                            <div className="input-group">
                                <label className="input-label">Notes</label>
                                <textarea
                                    className="input-field"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" style={{ width: 'auto' }}>Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
