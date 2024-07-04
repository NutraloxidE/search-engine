// src/components/SearchBar.tsx

'use client';

import React, { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../app/context/SearchContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm, setIsSearchComplete, isSearchComplete } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchterm = searchParams.get('searchterm');
    if (searchterm) {
      setSearchTerm(searchterm);
    }
  }, [setSearchTerm]);

  

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSearchComplete(false); // 検索の開始時に完了フラグをリセット
    router.push(`/results?searchterm=${encodeURIComponent(searchTerm)}`);
  };

  return (
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
  );
}
