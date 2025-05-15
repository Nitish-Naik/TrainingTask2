'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SoldProduct {
  date: string;
  totalItems: number;
}

export default function SoldProductsChart() {
  const [data, setData] = useState<SoldProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoldData = async () => {
      try {
        const res = await fetch('/api/sold-products-per-day'); 
        const json = await res.json();
        const formatted = json.soldPerDay.map((item: SoldProduct) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        }));
        setData(formatted);
      } catch (err) {
        console.error('Error fetching sold products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold mb-2 text-black">Sold Products per Day</h2>
      <p className="text-sm text-gray-500 mb-4 text-black">Last 30 Days · Trxns / day</p>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalItems"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
