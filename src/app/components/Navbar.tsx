'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Demo Dashboard</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Summary
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Reports
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
