'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../../components/SearchBar'; 
import { useSearch } from '../../app/context/SearchContext';

type SearchResult = {
  _id: string;
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
  const pageParam = searchParams?.get('page');
  const [searchTerm, setSearchTerm] = useState(searchterm || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const limit = 15;
  const [favicons, setFavicons] = useState<{ [id: string]: string }>({});

  const { isSearchComplete, setIsSearchComplete } = useSearch(); 
  const [searchTime, setSearchTime] = useState(0);

  //favicon fetch
  useEffect(() => {
    results.forEach((result) => {
      fetch(`/api/loadFaviconFromDB?id=${result._id}`)
        .then((response) => response.json())
        .then((data) => {
          setFavicons((prevFavicons) => ({ ...prevFavicons, [result._id]: data.favicon }));
        })
        .catch((error) => {
          console.error('Error fetching favicon:', error);
        });
    });
  }, [results]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (searchterm) {
      const startTime = Date.now();

      timeoutId = setTimeout(() => {

        setIsSearchComplete(false);
        console.log(`Fetching results for: ${searchterm} with limit: ${limit} and page: ${page}`);
        fetch(`/api/search?searchterm=${encodeURIComponent(searchterm)}&limit=${limit}&page=${page}`)
          .then((response) => response.json())
          .then((data) => {
            console.log('API response:', data);
            setResults(data.results || []);
            setTotalResults(data.totalResults || 0);
            setIsSearchComplete(true);

            const endTime = Date.now(); // Record the end time
            setSearchTime((endTime - startTime) / 1000); // Calculate the search time in seconds
          })
          .catch((error) => {
            console.error('Error fetching search results:', error);
          });
      }, 1500);
    } else {
      setIsSearchComplete(true);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    
  }, [searchterm, page, setIsSearchComplete]);

  useEffect(() => {
    // 検索ワードが変更されたときにページを1にリセット
    setPage(1);
  }, [searchterm]);

  const handlePageChange = (newPage: number) => {
    //turn on loading spinner
    setIsSearchComplete(false);

    //clear the results and update the page
    setResults([]);
    setTotalResults(0);

    // Update the page state
    setPage(newPage);
    window.scrollTo(0, 0);

    // Update the URL
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const generatePageNumbers = (totalPages: number, currentPage: number) => {
    const delta = 2;
    const range: (number | string)[] = [];
    let l: number | null = null;
  
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
  
    const rangeWithDots: (number | string)[] = [];
    for (let i of range) {
      let numI = Number(i);
      let numL = Number(l);
      if (l) {
        if (numI - numL === 2) {
          rangeWithDots.push(numL + 1);
        } else if (numI - numL !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(numI);
      l = numI;
    }
  
    return rangeWithDots;
  };

  return (
    <>
      {/* Search Form */}
      <SearchBar />

      <p className="text-sm text-gray-500 text-left mt-4 mb-4 pl-2 pr-2">Search Results for &quot;{searchterm}&quot; ({totalResults} results, took {searchTime} seconds)</p>

      {/* Results */}
      <ul className="space-y-6 w-full max-w-7xl">
        {results.length > 0 ? (
          results.map((result) => (
            <li key={result._id} className="ml-2 mr-2 px-4 py-4 bg-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-md shadow-neumorphism hover:shadow-neumorphism-hover transition-shadow duration-200"> 
              {/* title and favicon */}
              <div className="flex items-center">
                {favicons[result._id]?.startsWith('data:image/png;base64,') && 
                  <img src={favicons[result._id]} alt="favicon" className="mr-2 rounded-md border-2 border-gray-300" />}
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                </h2>
              </div>

              <p className="text-gray-600 mt-2">{result.about.length > 100 ? result.about.substring(0, 100) + '...' : result.about}</p>
              <p className="text-gray-800 mt-2">{result.textSnippet.length > 100 ? result.textSnippet.substring(0, 100) + '...' : result.textSnippet}</p>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">Read more</a>
            </li>
          ))
        ) : (
          //if isSearchComplete is false, show loading text instead of no results found
          isSearchComplete ? (
            <p className="text-gray-500 text-center">No results found.</p>
          ) : (
            <p className="text-gray-500 text-center">Loading...</p>
          )
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8 mb-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="mr-2 w-18 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-neumorphism-button disabled:bg-gray-300"
        >
        ←
        </button>
      <div className="flex space-x-2 overflow-x-auto">
      {generatePageNumbers(Math.ceil(totalResults / limit), page).map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`dots-${index}`} className="px-4 py-2 text-gray-500" style={{ minWidth: '36px', textAlign: 'center' }}>
            ...
          </span>
        ) : (
          <a
            key={`page-${pageNum}`}
            onClick={() => handlePageChange(pageNum as number)}
            className={`cursor-pointer px-4 py-2 border ${pageNum === page ? 'bg-blue-500 text-white shadow-neumorphism-button' : 'bg-gray-200 text-gray-700 shadow-neumorphism-button'} rounded-md`}
            style={{ minWidth: '36px', textAlign: 'center' }} // 影が適切に表示されるように最小幅を設定
          >
            {pageNum}
          </a>
        )
      )}
      </div>
      <span className="ml-2 mr-2 text-gray-700">{`${((page - 1) * limit) + 1}-${Math.min(page * limit, totalResults)} of ${totalResults}`}</span>
      <button
      onClick={() => handlePageChange(page + 1)}
      disabled={page * limit >= totalResults}
      className="ml-2 w-18 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-neumorphism-button disabled:bg-gray-300"
      >
      →
      </button>
      </div>


    </>
  );
  
  
  
};

export default ResultsPage;
