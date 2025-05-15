'use client';

import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';

import CategoryTable from './CategoryTable';
import TransactionsGraph from './TransactionsGraph';
import ProductsPerDay from './ProductsPerDay';
import Navbar from './Navbar';

interface ApiResponse {
  totalRevenue?: number;
  medianSpending?: number;
  averageSold?: number;
  revenueByCategory?: { category: string; total: number }[];
  revenueOverTime?: { date: string; revenue: number }[];
  transactionsPerDay?: { date: string; transactions: number }[];
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          revenueRes,
          medianRes,

          categoryRes,
          revenueOverTimeRes,
          transactionsRes,
        ] = await Promise.all([
          fetch('/api/total-revenue'),
          fetch('/api/median-spending'),
          fetch('/api/sold-products-per-day'),
          fetch('/api/category'),
          fetch('/api/revenue-over-time'),
          fetch('/api/transaction'),
        ]);

        const [
          revenueData,
          medianData,

          categoryData,
          revenueTimeData,
          transactionData,
        ] = await Promise.all([
          revenueRes.json(),
          medianRes.json(),
          categoryRes.json(),
          revenueOverTimeRes.json(),
          transactionsRes.json(),
        ]);

   

        setData({
          totalRevenue: revenueData.totalRevenue,
          medianSpending: medianData.medianSpending,

          revenueByCategory: categoryData,
          revenueOverTime: revenueTimeData,
          transactionsPerDay: transactionData,
        });
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`$${data.totalRevenue?.toFixed(2) || '0.00'}`} />
        <StatCard title="Median Spending" value={`$${data.medianSpending?.toFixed(2) || '0.00'}`} />
        
      </div>

      <RevenueChart data={data.revenueOverTime || []} />
      <TransactionsGraph data={data.transactionsPerDay || []} />
      <CategoryTable categories={data.revenueByCategory || []} />
      <ProductsPerDay />
    </div>
  );
}
