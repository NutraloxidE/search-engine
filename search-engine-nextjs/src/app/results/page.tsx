"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

type SearchResult = {
  id: number;
  title: string;
  about: string;
  textSnippet: string;
  url: string;
};

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchterm = searchParams?.get('searchterm');
  const [searchTerm, setSearchTerm] = useState('' + searchterm);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/results?searchterm=${encodeURIComponent(searchTerm)}`);
  };

  useEffect(() => {
    if (searchterm) {
      fetch(`/api/search?searchterm=${encodeURIComponent(searchterm)}`)
        .then((response) => response.json())
        .then((data) => setResults(data));
    }
  }, [searchterm]);

return (
    <>
        <div className="flex flex-col items-center justify-start min-h-screen bg-transparent mb-0" style={{ transform: 'translateY(vh0)', marginTop: '20px' }}>
            <form onSubmit={handleSubmit} className="w-full max-w-md mb-2">
                <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        placeholder="Search..."
                    />
                    <button type="submit" className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">Search</button>
                </div>
            </form>

            <p className="text-sm text-gray-500 text-left" >Search Results for &quot;{searchterm}&quot;</p>

            {/* Results */}
            <ul className="space-y-6">
              {results.map((result) => (
                <li key={result.id} className="px-4 py-4 border rounded-md shadow hover:shadow-lg transition-shadow duration-200">
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                  </h2>
                  <p className="text-gray-600">{result.about.length > 100 ? result.about.substring(0, 100) + '...' : result.about}</p>
                  <p className="text-gray-800">{result.textSnippet.length > 100 ? result.textSnippet.substring(0, 100) + '...' : result.textSnippet}</p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Read more</a>
                </li>
              ))}
            </ul>


        </div>

        <div>
            
        </div>
    
    </>
);
};

export default ResultsPage;