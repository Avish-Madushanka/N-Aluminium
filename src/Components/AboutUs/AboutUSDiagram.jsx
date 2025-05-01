import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./AboutUSDiagram.css";

const data = [
  { year: "2020", usage: 1400, recycled: 1050 },
  { year: "2021", usage: 1600, recycled: 1250 },
  { year: "2022", usage: 1800, recycled: 1450 },
  { year: "2023", usage: 2000, recycled: 1700 },
  { year: "2024", usage: 2200, recycled: 2000 },
];

const AboutUSDiagram = () => {
  return (
    <div className="ABDiagram-container">
      <h2 className="ABDiagram-title">Aluminum Usage vs Recycling</h2>
      <p className="ABDiagram-subtitle">A visual representation of aluminum usage and recycling capacity over the past five years</p>
      <div className="ABDiagram-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#1f3b53" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recycled" fill="#5a748d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AboutUSDiagram;
