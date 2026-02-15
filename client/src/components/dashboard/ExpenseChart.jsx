import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ categoryBreakdown }) => {
    // Filter only expenses (negative values usually, but we need absolute for chart)
    const dataValues = categoryBreakdown.map(cat => Math.abs(parseFloat(cat.total)));
    const labels = categoryBreakdown.map(cat => cat.category);

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    '#6366f1', // Indigo
                    '#8b5cf6', // Violet
                    '#ec4899', // Pink
                    '#14b8a6', // Teal
                    '#f59e0b', // Amber
                    '#3b82f6', // Blue
                    '#10b981', // Emerald
                    '#64748b', // Slate
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            },
            title: {
                display: true,
                text: 'Expense Breakdown',
                font: {
                    family: "'Poppins', sans-serif",
                    size: 16
                }
            }
        },
        cutout: '60%', // Makes it a donut
    };

    return (
        <div className="chart-container" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            {dataValues.length > 0 ? (
                <Doughnut data={data} options={options} />
            ) : (
                <p style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>No expense data to display</p>
            )}
        </div>
    );
};

export default ExpenseChart;
