'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface Category {
  category: string;
  revenue: number;
  transactions: number;
}

export default function CategoryTransactionsChart() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/category'); 
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json.categories); 
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-4 rounded shadow-md w-full h-96">
      <h2 className="text-xl font-semibold mb-4 text-black">Category Transactions & Revenue</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
