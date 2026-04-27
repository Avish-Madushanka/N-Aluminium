import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  LineChart, Line
} from "recharts";
import "./AboutUSDiagram.css";

const usageData = [
  { year: "2020", usage: 72000, recycled: 36000 },
  { year: "2021", usage: 78000, recycled: 40000 },
  { year: "2022", usage: 86000, recycled: 48000 },
  { year: "2023", usage: 96000, recycled: 58000 },
  { year: "2024", usage: 110000, recycled: 70000 },
  { year: "2025", usage: 125000, recycled: 90000 },
  { year: "2026", usage: 140000, recycled: 110000 },
  { year: "2027", usage: 160000, recycled: 130000 },
  { year: "2028", usage: 180000, recycled: 155000 },
  { year: "2029", usage: 200000, recycled: 180000 },
  { year: "2030", usage: 220000, recycled: 210000 }
];

const efficiencyData = usageData.map(item => ({
  year: item.year,
  efficiency: (item.recycled / item.usage) * 100
}));

const scrapValueData = [
  { year: "2020", value: 0.90 },
  { year: "2021", value: 1.05 },
  { year: "2022", value: 1.12 },
  { year: "2023", value: 1.18 },
  { year: "2024", value: 1.25 },
  { year: "2025", value: 1.35 },
  { year: "2026", value: 1.45 },
  { year: "2027", value: 1.60 },
  { year: "2028", value: 1.75 },
  { year: "2029", value: 1.90 },
  { year: "2030", value: 2.10 }
];

const pieData = [
  { name: "Households", value: 30 },
  { name: "Construction", value: 25 },
  { name: "Factories", value: 20 },
  { name: "Shops", value: 15 },
  { name: "Other", value: 10 }
];

const COLORS = ["#1f3b53", "#5a748d", "#82ca9d", "#a0d8ef", "#c1e1c1"];

const AboutUSDiagram = () => {
  return (
    <div className="ABDiagram-container">

      <div className="ABDiagram-header">
        <h2>Aluminum Recycling Intelligence Dashboard (2020–2030)</h2>
        <p>
          A data-driven visualization of aluminum usage, recycling efficiency, source distribution,
          and market value trends shaping the future of sustainable waste management.
        </p>
      </div>

      <div className="ABDiagram-grid">

        <div className="ABDiagram-card large">
          <h3>Usage vs Recycling Growth</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="u" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1f3b53" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1f3b53" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area dataKey="usage" stroke="#1f3b53" fill="url(#u)" />
              <Area dataKey="recycled" stroke="#82ca9d" fill="url(#r)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card small">
          <h3>Efficiency Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={efficiencyData}>
              <XAxis dataKey="year" />
              <YAxis unit="%" />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#e67e22" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card small">
          <h3>Scrap Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ABDiagram-card full">
          <h3>Market Value Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scrapValueData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#27ae60" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default AboutUSDiagram;