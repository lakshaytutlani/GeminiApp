import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../types';
import { CHART_COLORS } from '../constants';

interface PerformanceChartProps {
  data: ChartDataPoint[];
  tickers: string[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, tickers }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis dataKey="name" stroke="#a0aec0" tick={{ fill: '#a0aec0' }} />
          <YAxis stroke="#a0aec0" tick={{ fill: '#a0aec0' }} domain={[0, 'dataMax + 10']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a202c', 
              border: '1px solid #4a5568',
              color: '#e2e8f0'
            }} 
            itemStyle={{ color: '#e2e8f0' }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          {tickers.map((ticker, index) => (
            <Line
              key={ticker}
              type="monotone"
              dataKey={ticker}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
