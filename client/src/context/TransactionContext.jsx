import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    useEffect(() => {
        if (user) {
            setPage(1);
            setTransactions([]);
            fetchTransactions(1, true);
        }
    }, [user, searchTerm, categoryFilter, startDate, endDate, minAmount, maxAmount]);

    const fetchTransactions = async (pageNum = 1, reset = false) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pageNum,
                limit: 100,
                search: searchTerm,
                category: categoryFilter
            });

            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (minAmount) params.append('minAmount', minAmount);
            if (maxAmount) params.append('maxAmount', maxAmount);

            const res = await axios.get(`/api/transactions?${params.toString()}`);
            const { transactions: newTransactions = [], totalPages } = res.data || {};

            if (reset) {
                setTransactions(newTransactions || []);
            } else {
                setTransactions(prev => [...prev, ...(newTransactions || [])]);
            }

            setHasMore(pageNum < totalPages);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.error || 'Failed to fetch transactions');
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTransactions(nextPage, false);
    };

    const addTransaction = async (transaction) => {
        try {
            const res = await axios.post('/api/transactions', transaction);
            setTransactions([res.data, ...transactions]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to add transaction' };
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`/api/transactions/${id}`);
            setTransactions(transactions.filter(t => t.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to delete transaction' };
        }
    };

    const updateTransaction = async (id, updatedTransaction) => {
        try {
            const res = await axios.put(`/api/transactions/${id}`, updatedTransaction);
            setTransactions(transactions.map(t => t.id === id ? res.data : t));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to update transaction' };
        }
    };

    return (
        <TransactionContext.Provider value={{
            transactions: transactions,
            allTransactions: transactions,
            loading,
            error,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            searchTerm,
            setSearchTerm,
            categoryFilter,
            setCategoryFilter,
            startDate, setStartDate,
            endDate, setEndDate,
            minAmount, setMinAmount,
            maxAmount, setMaxAmount,
            loadMore,
            hasMore
        }}>
            {children}
        </TransactionContext.Provider>
    );
};
