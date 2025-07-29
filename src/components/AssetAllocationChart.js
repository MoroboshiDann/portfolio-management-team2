import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllocationFromRisk } from '../utils/assetAllocation';

// Define a color palette to make the chart visually attractive
const COLOR_PALETTE = [
  '#FF6384', // Red
  '#36A2EB', // Blue
  '#FFCE56', // Yellow
  '#FF9F40', // Orange
  '#4BC0C0', // Green
];

// Function to create gradient effects for the pie chart segments
const createGradients = () => (
  <defs>
    {COLOR_PALETTE.map((color, index) => (
      <linearGradient id={`grad-${index}`} key={index} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={1} />
      </linearGradient>
    ))}
  </defs>
);

const AssetAllocationChart = ({ riskTolerance }) => {
  let allocation;

  riskTolerance = 10;

  try {
    // Validate risk tolerance and fetch allocation data
    if (typeof riskTolerance !== 'number' || riskTolerance < 1 || riskTolerance > 20) {
      throw new Error('Risk tolerance must be a number between 1 and 20.');
    }

    allocation = getAllocationFromRisk(riskTolerance);

    if (!Array.isArray(allocation) || allocation.length === 0) {
      throw new Error('No valid allocation data available.');
    }

    return (
      <div
        className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
        role="region"
        aria-label="Asset Allocation Chart"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Asset Allocation</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            {createGradients()}
            <Pie
              data={allocation}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              innerRadius={70}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              labelLine={false}
              isAnimationActive
              onMouseEnter={(data, index) => {
                const chart = document.querySelector(`#cell-${index}`);
                if (chart) {
                  chart.style.transform = 'scale(1.1)'; // Expand on hover
                }
              }}
              onMouseLeave={(data, index) => {
                const chart = document.querySelector(`#cell-${index}`);
                if (chart) {
                  chart.style.transform = 'scale(1)'; // Reset on hover out
                }
              }}
            >
              {allocation.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#grad-${index})`}
                  stroke="white"
                  strokeWidth={2}
                  style={{ transition: 'transform 0.2s, fill 0.3s' }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px' }}
              itemStyle={{ color: '#000' }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              iconType="circle"
              iconSize={20}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    return (
      <div
        className="bg-red-100 p-4 rounded-lg text-red-700"
        role="alert"
        aria-live="assertive"
      >
        <strong>Error:</strong> {error.message}
      </div>
    );
  }
};

export default AssetAllocationChart;