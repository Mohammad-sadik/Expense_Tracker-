import React, { useContext } from 'react';
import { formatCurrency } from '../../utils';

const SummaryCards = ({ summary }) => {
    return (
        <div className="dashboard-summary-cards">
            <div className="summary-card income">
                <h3>Total Income</h3>
                <p className="total-amount">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="summary-card expense">
                <h3>Total Expenses</h3>
                <p className="total-amount">{formatCurrency(Math.abs(summary.totalExpenses))}</p>
            </div>
            <div className="summary-card balance">
                <h3>Total Balance</h3>
                <p className="total-amount">{formatCurrency(summary.totalIncome + summary.totalExpenses)}</p>
            </div>
        </div>
    );
};

export default SummaryCards;
