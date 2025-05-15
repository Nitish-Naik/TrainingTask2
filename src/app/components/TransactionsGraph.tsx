'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface TransactionData {
  date: string;
  count: number;
}

export default function TransactionsChart() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transaction')
      .then(res => res.json())
      .then(json => {
        const formattedData = json.transactions.map((item: TransactionData) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          count: item.count,
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (!data.length) return <p>No transaction data available.</p>;

  return (
    <div className="bg-white p-4 rounded shadow-md w-full h-96">
      <h2 className="text-xl font-semibold mb-4 text-black">Transactions Over Time</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6" // nice blue color
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
