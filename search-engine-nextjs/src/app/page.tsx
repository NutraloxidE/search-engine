// page.tsx
import React from 'react';
import SearchBar from '../components/SearchBar';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent" style={{ transform: 'translateY(-10vh)' }}>
      <h1 className="text-4xl font-bold mb-8">GEKIYABA SEARCH</h1>
      <SearchBar />
    </div>
  );
}