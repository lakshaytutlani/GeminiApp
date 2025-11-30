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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#718096" tick={{ fill: '#718096' }} />
          <YAxis stroke="#718096" tick={{ fill: '#718096' }} domain={[0, 'dataMax + 10']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              color: '#1a202c',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }} 
            itemStyle={{ color: '#4a5568' }}
            cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }}
          />
          <Legend wrapperStyle={{ color: '#4a5568' }} />
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