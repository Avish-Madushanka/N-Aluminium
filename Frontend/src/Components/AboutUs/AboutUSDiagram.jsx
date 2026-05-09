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
  { metric: "CO₂", value: 92 },
  { metric: "Energy", value: 88 },
  { metric: "Reuse", value: 95 },
  { metric: "Collection", value: 86 },
  { metric: "Efficiency", value: 93 },
  { metric: "Sustainability", value: 97 }
];

const COLORS = [
  "#1B5E3F",
  "#1565C0",
  "#E65100",
  "#6A1B9A",
  "#C2185B"
];

const AboutUSDiagram = () => {
  return (
    <div className="ABDiagram-container">

      <div className="ABDiagram-header">
        <h1>ALUX Aluminum Recycling Intelligence Dashboard</h1>

        <p className="ABDiagram-subtitle">
          AI-Powered Recycling Analytics & Forecasting Platform (2020–2030)
        </p>

        <p className="ABDiagram-description">
          This intelligent dashboard analyzes aluminum recycling performance,
          sustainability metrics, environmental impact, smart collection
          analytics, and AI-driven future predictions for the global circular
          economy ecosystem.
        </p>
      </div>

      <div className="ABDiagram-stats">

        <div className="stat-card">
          <h2>95.5%</h2>
          <p>AI Predicted Recycling Efficiency</p>
        </div>

        <div className="stat-card">
          <h2>225K</h2>
          <p>Projected Aluminum Usage</p>
        </div>

        <div className="stat-card">
          <h2>215K</h2>
          <p>Recovered Recyclable Material</p>
        </div>

        <div className="stat-card">
          <h2>$2.6</h2>
          <p>Predicted Scrap Value / KG</p>
        </div>

      </div>

      <div className="ai-banner">
        <h3>AI Forecasting Active After 2026</h3>
        <p>
          Predictive machine-learning simulations estimate aluminum demand,
          recycling efficiency, carbon reduction, and smart collection growth
          between 2027–2030.
        </p>
      </div>

      <div className="ABDiagram-grid">

        <div className="ABDiagram-card large">
          <h3>Material Flow Analysis</h3>
          <p>
            Total aluminum usage versus recycled material volume across the
            global recycling ecosystem.
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="usage"
                stroke="#1565C0"
                fill="#1565C0"
                fillOpacity={0.25}
                name="Usage"
              />

              <Area
                type="monotone"
                dataKey="recycled"
                stroke="#1B5E3F"
                fill="#1B5E3F"
                fillOpacity={0.35}
                name="Recycled"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card">
          <h3>Recycling Efficiency Forecast</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[40, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#E65100"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card">
          <h3>Scrap Source Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card large">
          <h3>Secondary Material Market Value</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="value"
                fill="#1565C0"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card large">
          <h3>Regional Recycling Performance</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line dataKey="asia" stroke="#C2185B" strokeWidth={3} />
              <Line dataKey="europe" stroke="#1565C0" strokeWidth={3} />
              <Line dataKey="america" stroke="#1B5E3F" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card large">
          <h3>Smart Pickup Analytics</h3>

          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={pickupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="requests" fill="#1565C0" />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#1B5E3F"
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card">
          <h3>Sustainability Score</h3>

          <ResponsiveContainer width="100%" height={320}>
            <RadarChart outerRadius={90} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                dataKey="value"
                stroke="#1B5E3F"
                fill="#1B5E3F"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card">
          <h3>Environmental Impact</h3>

          <div className="impact-list">
            <div>
              <span>CO₂ Reduction</span>
              <strong>143 Tons</strong>
            </div>

            <div>
              <span>Energy Saved</span>
              <strong>208 MWh</strong>
            </div>

            <div>
              <span>Landfill Reduction</span>
              <strong>88%</strong>
            </div>

            <div>
              <span>Reuse Efficiency</span>
              <strong>95%</strong>
            </div>
          </div>
        </div>

        <div className="ABDiagram-card full">
          <h3>AI Recycling Demand Forecast</h3>

          <p>
            Machine-learning models predict exponential recycling demand growth
            after 2026 driven by smart-city adoption and sustainability
            regulations.
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="usage"
                stroke="#0F2B3D"
                fill="#0F2B3D"
                fillOpacity={0.15}
              />

              <Area
                type="monotone"
                dataKey="recycled"
                stroke="#1B5E3F"
                fill="#1B5E3F"
                fillOpacity={0.25}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="ai-insights">
        <h2>AI Sustainability Insights</h2>

        <div className="insight-grid">

          <div className="insight-card">
            AI predicts recycling efficiency may exceed 95% by 2030.
          </div>

          <div className="insight-card">
            Household aluminum waste expected to increase by 24%.
          </div>

          <div className="insight-card">
            Asia-Pacific projected to dominate global recycling markets.
          </div>

          <div className="insight-card">
            Smart pickup systems reduce operational waste significantly.
          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutUSDiagram;