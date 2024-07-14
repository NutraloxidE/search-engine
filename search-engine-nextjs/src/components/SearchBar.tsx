// src/components/SearchBar.tsx

'use client';

import React, { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../app/context/SearchContext';
import { FaSpinner, FaCheck } from 'react-icons/fa'; 

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
    console.log('Enterkey or Search button clicked');
    event.preventDefault();
    setIsSearchComplete(false); // 検索の開始時に完了フラグをリセット

    //if search term is same as previous search term, set isSearchComplete to true
    const searchParams = new URLSearchParams(window.location.search);
    const previousSearchTerm = searchParams.get('searchterm');
    if (searchTerm === previousSearchTerm) {
      setIsSearchComplete(true);
      return;
    }

    const timestamp = Date.now(); // <-- get the current timestamp
    router.push(`/results?searchterm=${encodeURIComponent(searchTerm)}&timestamp=${timestamp}`); // <-- add the timestamp to the URL
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg ml-5 mr-5 mt-2 pl-2 pr-2">
      <div className="flex items-center py-2 shadow-neumorphism rounded-md bg-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
          placeholder="Search..."
        />
        <button
          type="submit"
          className="fuwafuwa flex-shrink-0 bg-pastel-blue hover:bg-pastel-blue-dark text-sm text-white py-2 px-2 rounded-md shadow-neumorphism-button border-none"
        >
          Search
        </button>
        {!isSearchComplete ? (
          <FaSpinner className="animate-spin ml-3 mr-3" /> // <-- show a spinning icon while searching
        ) : (
          <FaCheck className="ml-3 mr-3" /> // <-- show a checkmark when the search is complete
        )}
      </div>
    </form>
  );
  
}
