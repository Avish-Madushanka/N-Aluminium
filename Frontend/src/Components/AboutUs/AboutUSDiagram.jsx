import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart
} from "recharts";
import "./AboutUSDiagram.css";

const usageData = [
  { year: "2020", usage: 72000, recycled: 36000, ai: false },
  { year: "2021", usage: 78000, recycled: 42000, ai: false },
  { year: "2022", usage: 86000, recycled: 50000, ai: false },
  { year: "2023", usage: 97000, recycled: 62000, ai: false },
  { year: "2024", usage: 110000, recycled: 76000, ai: false },
  { year: "2025", usage: 126000, recycled: 92000, ai: false },
  { year: "2026", usage: 140000, recycled: 112000, ai: false },
  { year: "2027", usage: 158000, recycled: 135000, ai: true },
  { year: "2028", usage: 178000, recycled: 160000, ai: true },
  { year: "2029", usage: 200000, recycled: 188000, ai: true },
  { year: "2030", usage: 225000, recycled: 215000, ai: true }
];

const efficiencyData = usageData.map((item) => ({
  year: item.year,
  efficiency: ((item.recycled / item.usage) * 100).toFixed(1),
  ai: item.ai
}));

const marketData = [
  { year: "2020", value: 0.8 },
  { year: "2021", value: 1.0 },
  { year: "2022", value: 1.1 },
  { year: "2023", value: 1.2 },
  { year: "2024", value: 1.35 },
  { year: "2025", value: 1.5 },
  { year: "2026", value: 1.7 },
  { year: "2027", value: 1.9 },
  { year: "2028", value: 2.1 },
  { year: "2029", value: 2.3 },
  { year: "2030", value: 2.6 }
];

const pieData = [
  { name: "Households", value: 35 },
  { name: "Construction", value: 25 },
  { name: "Industry", value: 20 },
  { name: "Commercial", value: 12 },
  { name: "Other", value: 8 }
];

const regionalData = [
  { year: "2020", asia: 35, europe: 50, america: 40 },
  { year: "2022", asia: 42, europe: 55, america: 46 },
  { year: "2024", asia: 52, europe: 61, america: 52 },
  { year: "2026", asia: 64, europe: 67, america: 60 },
  { year: "2028", asia: 76, europe: 72, america: 66 },
  { year: "2030", asia: 86, europe: 78, america: 73 }
];

const pickupData = [
  { year: "2020", requests: 1200, completed: 900 },
  { year: "2022", requests: 2200, completed: 1800 },
  { year: "2024", requests: 3500, completed: 3000 },
  { year: "2026", requests: 5200, completed: 4700 },
  { year: "2028", requests: 7200, completed: 6800 },
  { year: "2030", requests: 9800, completed: 9400 }
];

const radarData = [
  { metric: "CO₂ Reduction", value: 92 },
  { metric: "Energy Savings", value: 88 },
  { metric: "Material Reuse", value: 95 },
  { metric: "Collection Rate", value: 86 },
  { metric: "Process Efficiency", value: 93 },
  { metric: "Sustainability", value: 97 }
];

const COLORS = ["#2E7D32", "#1976D2", "#F57C00", "#7B1FA2", "#C2185B"];

const AboutUSDiagram = () => {
  return (
    <div className="ab-diagram">
      {/* Hero Section */}
      <div className="ab-hero">
        <div className="ab-hero-content">
          <div className="ab-badge">AI-POWERED ANALYTICS</div>
          <h1 className="ab-title">
            ALUX Aluminum Recycling <span className="ab-highlight">Intelligence</span> Dashboard
          </h1>
          <p className="ab-subtitle">
            Predictive Analytics & Sustainability Forecasting Platform (2020–2030)
          </p>
          <p className="ab-description">
            This intelligent dashboard analyzes aluminum recycling performance, sustainability metrics,
            environmental impact, smart collection analytics, and AI-driven future predictions for the
            global circular economy ecosystem.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="ab-stats">
        <div className="ab-stat-card">
          <div className="ab-stat-value">95.5%</div>
          <div className="ab-stat-label">AI Predicted Recycling Efficiency</div>
          <div className="ab-stat-trend positive">+12.3% vs 2025</div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-value">225K</div>
          <div className="ab-stat-label">Projected Aluminum Usage (tons)</div>
          <div className="ab-stat-trend positive">+8.7% YoY</div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-value">215K</div>
          <div className="ab-stat-label">Recovered Recyclable Material</div>
          <div className="ab-stat-trend positive">95.6% recovery rate</div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-value">$2.60</div>
          <div className="ab-stat-label">Predicted Scrap Value / KG</div>
          <div className="ab-stat-trend positive">+73% growth</div>
        </div>
      </div>

      {/* AI Banner */}
      <div className="ab-ai-banner">
        <div className="ab-ai-icon">🤖</div>
        <div className="ab-ai-content">
          <h3>AI Forecasting Active After 2026</h3>
          <p>
            Predictive machine-learning simulations estimate aluminum demand, recycling efficiency,
            carbon reduction, and smart collection growth between 2027–2030.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="ab-grid">
        {/* Material Flow Analysis */}
        <div className="ab-card large">
          <div className="ab-card-header">
            <h3>Material Flow Analysis</h3>
            <p>Total aluminum usage versus recycled material volume across the global recycling ecosystem.</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976D2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recycledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Area type="monotone" dataKey="usage" stroke="#1976D2" fill="url(#usageGradient)" name="Total Usage" />
              <Area type="monotone" dataKey="recycled" stroke="#2E7D32" fill="url(#recycledGradient)" name="Recycled Volume" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recycling Efficiency */}
        <div className="ab-card">
          <div className="ab-card-header">
            <h3>Recycling Efficiency Forecast</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis domain={[40, 100]} tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Line type="monotone" dataKey="efficiency" stroke="#F57C00" strokeWidth={3} dot={{ r: 4, fill: "#F57C00" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Source Distribution */}
        <div className="ab-card">
          <div className="ab-card-header">
            <h3>Scrap Source Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={85} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Market Value */}
        <div className="ab-card large">
          <div className="ab-card-header">
            <h3>Secondary Material Market Value</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Bar dataKey="value" fill="#1976D2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Performance */}
        <div className="ab-card large">
          <div className="ab-card-header">
            <h3>Regional Recycling Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Legend />
              <Line dataKey="asia" stroke="#C2185B" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line dataKey="europe" stroke="#1976D2" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line dataKey="america" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Smart Pickup */}
        <div className="ab-card large">
          <div className="ab-card-header">
            <h3>Smart Pickup Analytics</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={pickupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Legend />
              <Bar dataKey="requests" fill="#1976D2" radius={[4, 4, 0, 0]} name="Pickup Requests" />
              <Line type="monotone" dataKey="completed" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} name="Completed Pickups" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Sustainability Radar */}
        <div className="ab-card">
          <div className="ab-card-header">
            <h3>Sustainability Scorecard</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={85} data={radarData}>
              <PolarGrid stroke="#ccc" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#666", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#666" }} />
              <Radar dataKey="value" stroke="#2E7D32" fill="#2E7D32" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Environmental Impact */}
        <div className="ab-card">
          <div className="ab-card-header">
            <h3>Environmental Impact</h3>
          </div>
          <div className="ab-impact-list">
            <div className="ab-impact-item">
              <span className="ab-impact-label">🌍 CO₂ Reduction</span>
              <strong className="ab-impact-value">143 Tons</strong>
            </div>
            <div className="ab-impact-item">
              <span className="ab-impact-label">⚡ Energy Saved</span>
              <strong className="ab-impact-value">208 MWh</strong>
            </div>
            <div className="ab-impact-item">
              <span className="ab-impact-label">🗑️ Landfill Reduction</span>
              <strong className="ab-impact-value">88%</strong>
            </div>
            <div className="ab-impact-item">
              <span className="ab-impact-label">🔄 Reuse Efficiency</span>
              <strong className="ab-impact-value">95%</strong>
            </div>
          </div>
        </div>

        {/* AI Forecast */}
        <div className="ab-card full">
          <div className="ab-card-header">
            <h3>🤖 AI Recycling Demand Forecast</h3>
            <p>
              Machine-learning models predict exponential recycling demand growth after 2026 driven by
              smart-city adoption and sustainability regulations.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="aiUsageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a237e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a237e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Legend />
              <Area type="monotone" dataKey="usage" stroke="#1a237e" fill="url(#aiUsageGradient)" name="Forecasted Demand" />
              <Area type="monotone" dataKey="recycled" stroke="#2E7D32" fill="none" strokeDasharray="6 4" name="Projected Recovery" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="ab-insights">
        <h2>AI Sustainability Insights</h2>
        <div className="ab-insight-grid">
          <div className="ab-insight-card">
            <span className="ab-insight-icon">📈</span>
            <p>AI predicts recycling efficiency may exceed 95% by 2030.</p>
          </div>
          <div className="ab-insight-card">
            <span className="ab-insight-icon">🏠</span>
            <p>Household aluminum waste expected to increase by 24%.</p>
          </div>
          <div className="ab-insight-card">
            <span className="ab-insight-icon">🌏</span>
            <p>Asia-Pacific projected to dominate global recycling markets.</p>
          </div>
          <div className="ab-insight-card">
            <span className="ab-insight-icon">🚛</span>
            <p>Smart pickup systems reduce operational waste significantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUSDiagram;