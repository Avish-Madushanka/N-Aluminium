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
    Legend
);

// --- Chart Data (Sample Data - Replace with your actual data) ---

const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
        {
            label: 'Monthly Revenue ($)',
            data: [5500, 6200, 7800, 7100, 8500, 9200, 8800],
            fill: true,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.2)',
            tension: 0.4, // Makes the line curvy
        },
    ],
};

const collectionVolumeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
        {
            label: 'Collected Weight (Tonnes)',
            data: [12, 15, 11, 18, 14, 20, 17, 22],
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderRadius: 4,
        },
    ],
};

// Data for the Doughnut charts (Efficiency/Costs)
// Note: The original image had simple % circles. Doughnut charts are more visually informative.
const costRatioData = (label, percentage, color) => ({
    labels: [label, 'Remainder'],
    datasets: [
        {
            data: [percentage, 100 - percentage],
            backgroundColor: [color, 'rgba(200, 200, 200, 0.3)'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2,
            circumference: 270, // Makes it a partial circle like gauge
            rotation: 225,      // Starts the circle from bottom-left
        },
    ],
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // Hide legend for cleaner look in small widget
        },
        title: {
            display: false, // We have widget titles already
        },
        tooltip: {
            enabled: true,
        }
    },
    scales: { // Optional: customize axes if needed
        y: {
            beginAtZero: true,
        },
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Makes it a doughnut chart
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false }, // Often disable tooltips for gauges
        title: { display: false },
    },
};


// --- Main Component ---

function Dashboard() {
    // Sample Data (Replace with data fetched from your backend/API)
    const inventoryWeight = 125.5; // Tonnes
    const estimatedInventoryValue = 155000; // Example value
    const topSources = [
        { id: 1, name: 'Industrial Plant A', volume: '25 Tonnes/Month' },
        { id: 2, name: 'Construction Site B', volume: '18 Tonnes/Month' },
        { id: 3, name: 'City Recycling Program', volume: '15 Tonnes/Month' },
        { id: 4, name: 'Small Fabricator C', volume: '12 Tonnes/Month' },
    ];
    const recentShipments = [
        { id: 'SHP-0112', date: 'November 18', customer: 'Smelter Inc.', status: 'PAID', grade: 'UBC' },
        { id: 'SHP-0111', date: 'November 15', customer: 'Alloy Corp.', status: 'PAID', grade: '6063 Extrusion' },
        { id: 'SHP-0110', date: 'November 12', customer: 'Foundry Ltd.', status: 'PAID', grade: 'Castings' },
        { id: 'SHP-0109', date: 'November 08', customer: 'Smelter Inc.', status: 'PENDING', grade: 'UBC' },
        { id: 'SHP-0108', date: 'November 05', customer: 'Alloy Corp.', status: 'PAID', grade: 'Mixed' },
        { id: 'SHP-0107', date: 'November 02', customer: 'Export Co.', status: 'PAID', grade: 'Tense' },
    ];
    const operationalAlerts = [
        { id: 1, source: 'Route 03', type: '[High Contamination]', detail: 'Load from Site X flagged - 15% waste.' },
        { id: 2, source: 'Logistics', type: '[Maintenance]', detail: 'Truck T-05 scheduled downtime tomorrow.' },
        { id: 3, source: 'Yard Ops', type: '[Low Stock]', detail: 'Grade: Clean Sheet inventory below target.' },
        { id: 4, source: 'Route 01', type: '[Missed Pickup]', detail: 'Site Y reported missed collection today.' },
        { id: 5, source: 'Sales', type: '[Price Alert]', detail: 'Market price for UBC increased 5%.' },
        { id: 6, source: 'Quality Control', type: '[Grade Check]', detail: 'Bale #B456 requires secondary inspection.' },
    ];

    // Efficiency/Cost Percentages
    const collectionEfficiency = 85; // Example: % of scheduled pickups completed on time
    const processingYield = 92; // Example: % of clean aluminum recovered from gross weight
    const profitMargin = 18; // Example: Overall profit margin %

    return (
        <div className="dashboard-container">

            {/* --- Row 1 --- */}
            <div className="widget widget-income">
                <h2>Revenue Trend</h2>
                <div className="chart-container">
                    <Line options={chartOptions} data={revenueData} />
                </div>
            </div>

            <div className="widget widget-balance">
                <h2>Inventory Overview</h2>
                <div className="balance-value">
                    <span className="currency">$</span>
                    {estimatedInventoryValue.toLocaleString()}
                </div>
                <div className="balance-weight">
                    {inventoryWeight.toFixed(1)} Tonnes (Est. Value)
                </div>
                <button className="history-button">See Details</button>
            </div>

            {/* --- Row 2 --- */}
            <div className="widget widget-growth">
                <h2>Collection Volume</h2>
                 <div className="chart-container">
                    <Bar options={chartOptions} data={collectionVolumeData} />
                </div>
            </div>

            <div className="widget widget-expense">
                <h2>Key Metrics</h2>
                <div className="gauges-container">
                    <div className="gauge-item">
                        <div className="gauge-chart-container">
                             <Doughnut data={costRatioData('Collection Eff.', collectionEfficiency, 'rgb(53, 162, 235)')} options={doughnutOptions} />
                             <div className="gauge-percentage">{collectionEfficiency}%</div>
                        </div>
                        <span className="gauge-label">Collection Efficiency</span>
                    </div>
                     <div className="gauge-item">
                         <div className="gauge-chart-container">
                             <Doughnut data={costRatioData('Processing Yield', processingYield, 'rgb(75, 192, 192)')} options={doughnutOptions} />
                              <div className="gauge-percentage">{processingYield}%</div>
                         </div>
                        <span className="gauge-label">Processing Yield</span>
                    </div>
                     <div className="gauge-item">
                         <div className="gauge-chart-container">
                             <Doughnut data={costRatioData('Profit Margin', profitMargin, 'rgb(255, 159, 64)')} options={doughnutOptions} />
                              <div className="gauge-percentage">{profitMargin}%</div>
                         </div>
                        <span className="gauge-label">Profit Margin</span>
                    </div>
                </div>
            </div>

            <div className="widget widget-most-viewed">
                <h2>Top Sources (Volume)</h2>
                <ul className="item-list">
                    {topSources.map(source => (
                        <li key={source.id}>
                            <span>{source.name}</span>
                            <span className="item-detail">{source.volume}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- Row 3 --- */}
            <div className="widget widget-invoices">
                <h2>Recent Shipments</h2>
                <ul className="invoice-list">
                    {recentShipments.map(shipment => (
                        <li key={shipment.id}>
                            <span className="invoice-id">{shipment.id} / {shipment.date} / {shipment.customer} / Grade: {shipment.grade}</span>
                            <span className={`status-tag ${shipment.status === 'PAID' ? 'status-paid' : 'status-pending'}`}>
                                {shipment.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="widget widget-message">
                <h2>Operational Alerts</h2>
                <ul className="message-list">
                     {operationalAlerts.map(alert => (
                        <li key={alert.id}>
                            <span className="message-source">{alert.source}</span>
                            <span className="message-type">{alert.type}</span>
                            <span className="message-detail">{alert.detail}</span>
                        </li>
                     ))}
                </ul>
            </div>

        </div>
    );
}

export default Dashboard;