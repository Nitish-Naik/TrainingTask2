'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/revenue-over-time')
      .then(res => res.json())
      .then(json => {
        const formattedData = json.trend.map((item: RevenueData) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          revenue: item.revenue,
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading revenue data...</p>;
  if (!data.length) return <p>No revenue data available.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h2 className="text-xl font-semibold text-black mb-4">Revenue Over Time (May 2025)</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
