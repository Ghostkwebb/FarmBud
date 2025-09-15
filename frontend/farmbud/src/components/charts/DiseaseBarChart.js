import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Healthy Crops', value: 75, color: '#16a34a' },
  { name: 'Lost to Disease/Pests', value: 25, color: '#dc2626' },
];

const DiseaseBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" stroke="#a1a1aa" width={120} />
        <Tooltip
          formatter={(value) => `${value}%`}
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid #4a4a4a',
            borderRadius: '0.5rem'
          }}
        />
        <Bar dataKey="value" barSize={40} radius={[0, 10, 10, 0]}>
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DiseaseBarChart;