import React from 'react';
import './Dashboard.css'; // Import the CSS file
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler // Import Filler for area charts
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler // Register Filler
);

// --- Chart Data (Sample Data - Closely matching the image) ---

// Income Chart (Area Line Chart)
const incomeData = {
    labels: ['', '', '', '', '', '', ''], // Labels hidden in image, keep placeholders
    datasets: [
        {
            label: 'Income', // Hidden in final render
            data: [30, 55, 40, 70, 50, 80, 60], // Example data shape
            fill: true, // Fill area below line
            borderColor: 'rgb(53, 162, 235)', // Line color
            backgroundColor: 'rgba(53, 162, 235, 0.1)', // Area fill color
            tension: 0.4, // Makes the line curvy
            pointRadius: 0, // Hide points
        },
    ],
};

// Growth Chart (Bar Chart)
const growthData = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''], // Placeholder labels
    datasets: [
        {
            label: 'Growth', // Hidden
            data: [6, 9, 7, 11, 5, 8, 10, 7, 12, 6, 9, 5], // Example data shape
            backgroundColor: 'rgba(53, 162, 235, 0.5)', // Bar color
            borderRadius: 2,
            barPercentage: 0.6, // Adjust bar width
            categoryPercentage: 0.7, // Adjust spacing between bars
        },
    ],
};

// Expense Gauge Charts (Doughnut)
const createGaugeData = (percentage, color) => ({
    labels: ['Used', 'Remaining'],
    datasets: [
        {
            data: [percentage, 100 - percentage],
            backgroundColor: [color, 'rgba(226, 232, 240, 0.5)'], // Use a light gray for remaining
            borderColor: ['#ffffff', '#ffffff'], // White border for separation
            borderWidth: 1,
            circumference: 360, // Full circle
            rotation: -90,      // Start from the top
            cutout: '80%',     // Make it a thin ring like a gauge
        },
    ],
});

// Chart Options
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }, // No legends shown
        title: { display: false },  // No titles shown
        tooltip: { enabled: false } // Disable tooltips if not desired
    },
    scales: { // Hide axes for income and growth
        x: {
            display: false,
            grid: { display: false },
            ticks: { display: false },
            border: { display: false }
        },
        y: {
            display: false,
            grid: { display: false },
            ticks: { display: false },
            border: { display: false }
        },
    },
};

const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        title: { display: false },
    },
};


// --- Main Component ---

function Dashboard() {
    // Sample Static Data matching the image
    const balance = 15000;
    const mostViewedItems = ['item 01', 'item 02', 'item 03', 'item 04'];
    const invoices = [
        { id: '01', date: 'November', code: '1245/s/o', status: 'PAID' },
        { id: '02', date: 'November', code: '1123/f/o', status: 'PAID' },
        { id: '03', date: 'November', code: '1298/a/o', status: 'PAID' },
        { id: '04', date: 'November', code: '1247/s/o', status: 'PAID' },
        { id: '05', date: 'November', code: '1333/c/o', status: 'PAID' },
        { id: '06', date: 'November', code: '2134/v/o', status: 'PAID' },
    ];
    const messages = [
        { name: 'Johnson, Mark', subject: '[ Invoice November ]', detail: 'Status Update : Success' },
        { name: 'Adelia, Nadia', subject: '[ Project Assignment ]', detail: 'Presentation Material' },
        { name: 'Amelia, Laura', subject: '[ Meeting Schedule ]', detail: 'Project : interior design' },
        { name: 'Johnson, Mark', subject: '[ Invoice November ]', detail: 'Status Update : Success' },
        { name: 'Adelia, Nadia', subject: '[ Project Assignment ]', detail: 'Presentation Material' },
        { name: 'Amelia, Laura', subject: '[ Meeting Schedule ]', detail: 'Project : interior design' },
    ];

    // Gauge percentages from image
    const expensePercentages = [80, 75, 50];
    const expenseGaugeColor = 'rgb(53, 162, 235)'; // Color from image

    return (
        // Use the db- prefixed class names from the CSS
        <div className="db-container">

            {/* --- Row 1 --- */}
            <div className="db-widget db-widget-income">
                <h2 className="db-widget-title">income</h2>
                <div className="db-chart-container db-income-chart">
                    <Line options={commonChartOptions} data={incomeData} />
                </div>
            </div>

            <div className="db-widget db-widget-balance">
                <h2 className="db-widget-title">balance</h2>
                <div className="db-balance-value">
                    <span className="db-currency">$</span>
                    {/* Format number like image: 15.000 */}
                    {balance.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </div>
                <button className="db-history-button">see history</button>
            </div>

            {/* --- Row 2 --- */}
            <div className="db-widget db-widget-growth">
                <h2 className="db-widget-title">growth</h2>
                 <div className="db-chart-container db-growth-chart">
                    <Bar options={commonChartOptions} data={growthData} />
                </div>
            </div>

            <div className="db-widget db-widget-expense">
                <h2 className="db-widget-title">expense</h2>
                <div className="db-gauges-container">
                    {expensePercentages.map((perc, index) => (
                        <div className="db-gauge-item" key={index}>
                            <div className="db-gauge-chart-container">
                                <Doughnut data={createGaugeData(perc, expenseGaugeColor)} options={gaugeOptions} />
                                <div className="db-gauge-percentage">{perc}%</div>
                            </div>
                            {/* No labels below gauges in the image */}
                        </div>
                    ))}
                </div>
            </div>

            <div className="db-widget db-widget-most-viewed">
                <h2 className="db-widget-title">most viewed item</h2>
                <ul className="db-item-list">
                    {mostViewedItems.map((item, index) => (
                        <li key={index} className="db-most-viewed-item">
                            <span className="db-item-name">{item}</span>
                            <button className="db-boost-button">BOOST</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- Row 3 --- */}
            <div className="db-widget db-widget-invoices">
                <h2 className="db-widget-title">invoices</h2>
                <ul className="db-invoice-list">
                    {invoices.map((invoice, index) => (
                        <li key={index} className="db-invoice-item">
                            <span className="db-invoice-detail">
                                <span className="db-bullet">•</span> {/* Added bullet */}
                                Invoices {invoice.id}/{invoice.date}/{invoice.code}
                            </span>
                            <span className="db-status-tag db-status-paid">
                                {invoice.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="db-widget db-widget-message">
                <h2 className="db-widget-title">message</h2>
                <ul className="db-message-list">
                     {messages.map((msg, index) => (
                        <li key={index} className="db-message-item">
                            <span className="db-message-name">{msg.name}</span>
                            <span className="db-message-subject">{msg.subject}</span>
                            <span className="db-message-detail">{msg.detail}</span>
                        </li>
                     ))}
                </ul>
            </div>

        </div>
    );
}

export default Dashboard;