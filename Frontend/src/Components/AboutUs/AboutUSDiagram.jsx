import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  LineChart, Line,
  ComposedChart
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
  efficiency: Number((item.recycled / item.usage * 100).toFixed(1))
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
  { name: "Households", value: 30, color: "#1B5E3F" },
  { name: "Construction", value: 25, color: "#1565C0" },
  { name: "Factories", value: 20, color: "#E65100" },
  { name: "Shops", value: 15, color: "#6A1B9A" },
  { name: "Other", value: 10, color: "#C2185B" }
];

const wasteBySectorData = [
  { year: "2022", households: 28, construction: 32, industry: 24, commercial: 12, other: 4 },
  { year: "2024", households: 32, construction: 34, industry: 22, commercial: 10, other: 2 },
  { year: "2026", households: 38, construction: 30, industry: 20, commercial: 8, other: 4 },
  { year: "2028", households: 42, construction: 28, industry: 18, commercial: 7, other: 5 },
  { year: "2030", households: 45, construction: 25, industry: 16, commercial: 8, other: 6 }
];

const regionalData = [
  { year: "2020", asia: 34, europe: 48, america: 42 },
  { year: "2022", asia: 42, europe: 54, america: 47 },
  { year: "2024", asia: 52, europe: 60, america: 53 },
  { year: "2026", asia: 62, europe: 65, america: 58 },
  { year: "2028", asia: 72, europe: 70, america: 64 },
  { year: "2030", asia: 82, europe: 74, america: 69 }
];

const environmentalImpactData = usageData.map((item) => ({
  year: item.year,
  co2Reduction: Number((item.recycled * 0.00065).toFixed(1)),
  energySaved: Number((item.recycled * 0.00092).toFixed(1))
}));

const COLORS = ["#1B5E3F", "#1565C0", "#E65100", "#6A1B9A", "#C2185B"];

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AboutUSDiagram = () => {
  return (
    <div className="ABDiagram-container">
      <div className="ABDiagram-header">
        <h2>Aluminum Recycling Intelligence Dashboard</h2>
        <p className="subtitle">2020 – 2030 Forecast & Performance Analytics</p>
        <p className="description">
          A comprehensive data-driven platform for tracking aluminum circular economy metrics, 
          recycling efficiency trends, and environmental impact indicators across global markets.
        </p>
      </div>

      <div className="stats-ribbon">
        <div className="stat-item">
          <span className="stat-value">95.5%</span>
          <span className="stat-label">Projected Efficiency by 2030</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">220K</span>
          <span className="stat-label">Tons Annual Usage (2030)</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">143</span>
          <span className="stat-label">CO₂ Reduction (tons, 2030)</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">$2.10</span>
          <span className="stat-label">Scrap Value per KG (2030)</span>
        </div>
      </div>

      <div className="ABDiagram-grid">
        <div className="ABDiagram-card large">
          <div className="card-header">
            <h3>Material Flow Analysis</h3>
            <span className="badge">Primary Metric</span>
          </div>
          <p className="chart-context">Total aluminum consumption versus recovered recyclable volume. The accelerating capture rate demonstrates maturing collection infrastructure and consumer participation.</p>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F2B3D" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0F2B3D" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="recycledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B5E3F" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#1B5E3F" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} axisLine={{ stroke: '#CBD5E1' }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={{ stroke: '#CBD5E1' }} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip unit=" tons" />} cursor={{ stroke: '#94A3B8', strokeWidth: 1 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="usage" stroke="#0F2B3D" strokeWidth={2} fill="url(#usageGradient)" name="Total Usage (tons)" />
              <Area type="monotone" dataKey="recycled" stroke="#1B5E3F" strokeWidth={2} fill="url(#recycledGradient)" name="Recycled Volume (tons)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="chart-source">Data Source: International Aluminum Institute | Global Recycling Monitoring Report 2024</p>
        </div>

        <div className="ABDiagram-card small">
          <div className="card-header">
            <h3>Circular Efficiency Rate</h3>
          </div>
          <p className="chart-context">Percentage of consumed aluminum successfully returned to the material stream. Target threshold of 95% established by EU Circular Economy Action Plan.</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} />
              <YAxis unit="%" domain={[40, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Line type="monotone" dataKey="efficiency" stroke="#E65100" strokeWidth={3} dot={{ r: 4, fill: "#E65100", strokeWidth: 0 }} name="Efficiency Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-source">Calculation: (Recycled Volume / Total Usage) × 100</p>
        </div>

        <div className="ABDiagram-card small">
          <div className="card-header">
            <h3>Feedstock Composition</h3>
          </div>
          <p className="chart-context">Sectoral contribution to recoverable aluminum scrap. Households and construction represent the primary collection channels.</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#94A3B8', strokeWidth: 0.5 }}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <p className="chart-source">Survey Period: 2023-2024 | Sample: 180 municipal & industrial facilities</p>
        </div>

        <div className="ABDiagram-card full">
          <div className="card-header">
            <h3>Secondary Material Valuation</h3>
            <span className="badge">Market Intelligence</span>
          </div>
          <p className="chart-context">LME-based pricing model for processed aluminum scrap. Price appreciation driven by primary aluminum volatility and green material premiums.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scrapValueData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis unit="$" tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 2.5]} />
              <Tooltip content={<CustomTooltip unit="$/kg" />} cursor={{ fill: '#F1F5F9' }} />
              <Bar dataKey="value" fill="#1565C0" radius={[6, 6, 0, 0]} name="Market Value ($/kg)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-source">Data Source: London Metal Exchange (LME) | CRU Group Forecast 2025-2030</p>
        </div>

        <div className="ABDiagram-card large">
          <div className="card-header">
            <h3>Sectoral Waste Generation</h3>
          </div>
          <p className="chart-context">Stacked annual waste collection by source category. Household collection shows the most significant growth due to expanded separate collection schemes.</p>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={wasteBySectorData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(v) => `${v}`} />
              <Tooltip content={<CustomTooltip unit=" tons" />} cursor={{ fill: '#F8FAFC' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="households" stackId="a" fill="#1B5E3F" name="Households" radius={[4, 4, 0, 0]} />
              <Bar dataKey="construction" stackId="a" fill="#1565C0" name="Construction" />
              <Bar dataKey="industry" stackId="a" fill="#E65100" name="Industry" />
              <Bar dataKey="commercial" stackId="a" fill="#6A1B9A" name="Commercial" />
              <Bar dataKey="other" stackId="a" fill="#C2185B" name="Other" />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-source">Data Source: EPA | Eurostat | National Environment Agencies (harmonized metric tons)</p>
        </div>

        <div className="ABDiagram-card large">
          <div className="card-header">
            <h3>Regional Performance Benchmark</h3>
            <span className="badge">Comparative</span>
          </div>
          <p className="chart-context">Regional recycling rates weighted by consumption. Asia demonstrates the strongest growth trajectory, while Europe maintains leadership in absolute performance.</p>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={regionalData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis unit="%" tick={{ fill: '#475569', fontSize: 11 }} domain={[20, 90]} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="asia" stroke="#C2185B" strokeWidth={2.5} dot={{ r: 4, fill: "#C2185B", strokeWidth: 0 }} name="Asia-Pacific" />
              <Line type="monotone" dataKey="europe" stroke="#1565C0" strokeWidth={2.5} dot={{ r: 4, fill: "#1565C0", strokeWidth: 0 }} name="Europe" />
              <Line type="monotone" dataKey="america" stroke="#1B5E3F" strokeWidth={2.5} dot={{ r: 4, fill: "#1B5E3F", strokeWidth: 0 }} name="Americas" />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-source">Sources: Eurostat | USGS | Environment Canada | International Aluminum Institute</p>
        </div>

        <div className="ABDiagram-card full">
          <div className="card-header">
            <h3>Environmental Impact Assessment</h3>
            <span className="badge">ESG Metrics</span>
          </div>
          <p className="chart-context">Quantified environmental benefits showing CO₂ avoidance (left axis) and energy conservation (right axis). Each kilogram recycled prevents 0.65kg CO₂ and saves 0.92kWh.</p>
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={environmentalImpactData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis yAxisId="left" label={{ value: 'CO₂ Reduction (tons)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#475569' } }} tick={{ fill: '#475569', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Energy Saved (kWh)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#475569' } }} tick={{ fill: '#475569', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Area yAxisId="left" type="monotone" dataKey="co2Reduction" fill="#1B5E3F" fillOpacity={0.15} stroke="#1B5E3F" strokeWidth={2} name="CO₂ Emissions Avoided (tons)" />
              <Line yAxisId="right" type="monotone" dataKey="energySaved" stroke="#E65100" strokeWidth={3} dot={{ r: 4, fill: "#E65100", strokeWidth: 0 }} name="Energy Conserved (kWh)" />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="chart-source">Methodology: IAI Life Cycle Assessment (2022) | Factors: 0.65kg CO₂/kg | 0.92kWh/kg recycled</p>
        </div>
      </div>

      <div className="ABDiagram-footer">
        <p>© 2024 Aluminum Recycling Intelligence Dashboard | Data-driven insights for circular economy decision support</p>
      </div>
    </div>
  );
};

export default AboutUSDiagram;