"use client";

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/results?searchterm=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent" style={{ transform: 'translateY(-10vh)' }}>
      <h1 className="text-4xl font-bold mb-8">GEKIYABA SEARCH</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
