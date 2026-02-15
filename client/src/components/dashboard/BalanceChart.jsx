import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BalanceChart = ({ summary }) => {
    const data = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount (INR)',
                data: [summary.totalIncome, Math.abs(summary.totalExpenses)],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)', // Emerald with opacity
                    'rgba(239, 68, 68, 0.7)',  // Red with opacity
                ],
                borderColor: [
                    '#10b981',
                    '#ef4444',
                ],
                borderWidth: 1,
                borderRadius: 8, // Rounded bar corners
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // No need for legend as x-axis explains it
            },
            title: {
                display: true,
                text: 'Financial Overview',
                font: {
                    family: "'Poppins', sans-serif",
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: { family: "'Inter', sans-serif" }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: { family: "'Inter', sans-serif" }
                }
            }
        },
    };

    return (
        <div className="chart-container" style={{ height: '300px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BalanceChart;
