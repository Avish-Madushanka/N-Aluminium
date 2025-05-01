import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";
import "./AboutUSDiagram.css";

const usageData = [
  { year: "2020", usage: 72000, recycled: 36000 },
  { year: "2021", usage: 74000, recycled: 38540 },
  { year: "2022", usage: 75500, recycled: 40210 },
  { year: "2023", usage: 96600, recycled: 50500 },
  { year: "2024", usage: 100200, recycled: 57395 },
];

const scrapValueData = [
  { year: "2020", value: 0.90 },
  { year: "2021", value: 1.05 },
  { year: "2022", value: 1.12 },
  { year: "2023", value: 1.18 },
  { year: "2024", value: 1.25 },
];

const pieData = [
  { name: "Transport", value: 40 },
  { name: "Construction", value: 25 },
  { name: "Packaging", value: 15 },
  { name: "Electronics", value: 10 },
  { name: "Other", value: 10 },
];

const COLORS = ["#1f3b53", "#5a748d", "#82ca9d", "#a0d8ef", "#c1e1c1"];

const AboutUSDiagram = () => {
  return (
    <div className="ABDiagram-container">

      <h2 className="ABDiagram-title">Aluminum Usage vs Recycling</h2>
      <p className="ABDiagram-subtitle">Visualizing the growing gap between aluminum usage and recycling</p>
      <div className="ABDiagram-chart-wrapper ABDiagram-area">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={usageData}>
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1f3b53" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1f3b53" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5a748d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#5a748d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="usage" stroke="#1f3b53" fill="url(#colorUsage)" />
            <Area type="monotone" dataKey="recycled" stroke="#5a748d" fill="url(#colorRecycled)" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="ABDiagram-description">
          This area chart presents a year-over-year comparison of total aluminum consumption versus the amount recycled.
          Over the past five years, while overall usage has significantly increased—from 72,000 tons in 2020 to over 100,000 tons in 2024—the recycling rates have not kept pace.
          This widening gap suggests growing pressure on raw material extraction, energy consumption, and environmental impact.
          The rising trend in usage without proportionate recycling highlights the urgent need for better waste collection systems,
          improved recycling infrastructure, and increased public awareness of sustainable aluminum consumption.
        </p>
      </div>

      <h2 className="ABDiagram-title">Sector-wise Aluminum Usage (2023)</h2>
      <p className="ABDiagram-subtitle">Distribution of aluminum usage across key sectors</p>
      <div className="ABDiagram-chart-wrapper ABDiagram-pie">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="ABDiagram-description">
          This pie chart showcases how aluminum was distributed across major industrial sectors in 2023.
          Transportation leads the chart with 40% usage, underscoring the metal’s vital role in automotive and aerospace industries where lightweight and corrosion-resistant materials are essential.
          Construction follows at 25%, where aluminum is used extensively for doors, windows, and structural elements.
          Packaging (15%), electronics (10%), and miscellaneous uses (10%) round out the remainder.
          Understanding sectoral demand helps policy makers and recyclers prioritize their strategies for collection, reuse, and circular economy initiatives.
        </p>
      </div>

      <h2 className="ABDiagram-title">Aluminum Scrap Value per Kg</h2>
      <p className="ABDiagram-subtitle">Estimated market value of 1kg of aluminum scrap (in USD)</p>
      <div className="ABDiagram-chart-wrapper ABDiagram-bar">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={scrapValueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 1.5]} tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Price per Kg" />
          </BarChart>
        </ResponsiveContainer>
        <p className="ABDiagram-description">
          This bar chart reflects the fluctuating but steadily increasing market price of aluminum scrap between 2020 and 2024.
          The price has risen from $0.90/kg to $1.25/kg, highlighting the growing economic value of recycled materials.
          These price increases may be driven by multiple factors such as rising global demand, limited availability of virgin ore, and increased production costs.
          The data also underscores the financial incentives for recycling operations and scrap collectors.
          Encouraging scrap collection not only supports environmental sustainability but also provides economic opportunities, especially in developing regions.
        </p>
      </div>
    </div>
  );
};

export default AboutUSDiagram;
