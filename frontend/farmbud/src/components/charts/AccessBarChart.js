import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'With Tech Access', value: 65, color: '#2dd4bf' },
  { name: 'Limited Digital Access', value: 35, color: '#f59e0b' },
];

const AccessBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#a1a1aa" />
        <YAxis stroke="#a1a1aa" />
        <Tooltip
          formatter={(value) => `${value}%`}
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid #4a4a4a',
            borderRadius: '0.5rem'
          }}
        />
        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
           {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AccessBarChart;