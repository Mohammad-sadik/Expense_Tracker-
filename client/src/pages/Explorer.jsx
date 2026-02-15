import React from 'react';
import TransactionList from '../components/explorer/TransactionList';

const Explorer = () => {
    return (
        <div className="explorer-page">
            <h2>Transaction Explorer</h2>
            <TransactionList />
        </div>
    );
};

export default Explorer;
