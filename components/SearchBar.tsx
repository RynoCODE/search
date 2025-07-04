'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SearchResultItem {
  id: string;
  filename: string;
  summary: string;
  snippet: string;
  keywords: string[];
  uploadDate: string;
}

interface SearchProps {
  onSearchResults: (results: SearchResultItem[]) => void;
}

export default function SearchBar({ onSearchResults }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }
      
      const data = await response.json();
      onSearchResults(data.results);
    } catch (error) {
      setError(`Search failed: ${(error as Error).message}`);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center border rounded-full shadow-sm overflow-hidden">
          <div className="pl-4">
            <Image 
              src="/globe.svg" 
              alt="Search" 
              width={20} 
              height={20} 
              className="text-gray-400"
            />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your uploaded files..."
            className="w-full py-3 px-4 focus:outline-none"
          />
          
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-3 font-medium transition-colors ${
              isSearching ? 'bg-blue-400' : 'hover:bg-blue-600'
            }`}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
