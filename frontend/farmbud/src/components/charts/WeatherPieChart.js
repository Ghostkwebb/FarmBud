import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Crop Loss due to Drought', value: 41 },
  { name: 'Crop Loss due to Irregular Rain', value: 32 },
  { name: 'Other Climate Events', value: 27 },
];

const COLORS = ['#d97706', '#f59e0b', '#fbbf24'];

const WeatherPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid #4a4a4a',
            borderRadius: '0.5rem'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WeatherPieChart;