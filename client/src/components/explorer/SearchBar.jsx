import React, { useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const SearchBar = () => {
    const {
        searchTerm, setSearchTerm,
        categoryFilter, setCategoryFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        minAmount, setMinAmount,
        maxAmount, setMaxAmount,
    } = useContext(TransactionContext);

    return (
        <div className="filters-bar">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
            />

            {/* Category Filter */}
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-input"
            >
                <option value="All">All Categories</option>
                <option value="Income">Income</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
            </select>

            {/* Date Range */}
            <div className="filter-group">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="filter-input" />
                <span>to</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="filter-input" />
            </div>

            {/* Amount Range */}
            <div className="filter-group">
                <input type="number" placeholder="Min Amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="filter-input" style={{ width: '100px' }} />
                <input type="number" placeholder="Max Amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="filter-input" style={{ width: '100px' }} />
            </div>
        </div>
    );
};

export default SearchBar;
