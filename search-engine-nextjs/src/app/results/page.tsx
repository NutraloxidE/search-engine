"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type SearchResult = {
  id: number;
  name: string;
};

const ResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchterm = searchParams?.get('searchterm');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (searchterm) {
      fetch(`/api/search?searchterm=${encodeURIComponent(searchterm)}`)
        .then((response) => response.json())
        .then((data) => setResults(data));
    }
  }, [searchterm]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{searchterm}&quot;</h1>
        {results.length > 0 ? (
          <ul>
            {results.map((result) => (
              <li key={result.id} className="mb-4 p-4 bg-white shadow rounded">
                <h3 className="text-lg font-bold">{result.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
