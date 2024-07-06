// src/context/SearchContext.tsx

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchComplete: boolean;
  setIsSearchComplete: (status: boolean) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchComplete, setIsSearchComplete] = useState(true);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, isSearchComplete, setIsSearchComplete }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
