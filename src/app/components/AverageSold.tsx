'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface AverageSoldData {
  date: string;
  averageSold: number;
}

export default function AverageSold() {
  const [data, setData] = useState<AverageSoldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/summary/sold-products')
      .then(res => res.json())
      .then(json => {
        const formattedData = json.summary.map((item: AverageSoldData) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          averageSold: item.averageSold,
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading average sold data...</p>;
  if (!data.length) return <p>No average sold data available.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h2 className="text-xl font-semibold text-black mb-4">Average Sold Products Per Day (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}`} />
          <Bar dataKey="averageSold" fill="#10b981" /> {/* A green color */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
