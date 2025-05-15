
'use client';

interface SummaryCardProps {
  title: string;
  value: string;
}

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div className="p-4 bg-white shadow rounded-xl hover:scale-105 transition-transform">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}