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

interface SearchResultsProps {
  results: SearchResultItem[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Toggle expanded state for a result
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // No results state
  if (results.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm text-center">
        <p className="text-gray-600">No results found. Try a different search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Search Results ({results.length})</h2>
      
      <ul className="space-y-4">
        {results.map((result) => (
          <li 
            key={result.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow transition-shadow duration-200"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(result.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center">
                    <Image 
                      src="/file.svg" 
                      alt="File" 
                      width={24} 
                      height={24} 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{result.filename}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDate(result.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transform transition-transform ${expandedId === result.id ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-gray-700 line-clamp-2">{result.summary}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {result.keywords.slice(0, 5).map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
                {result.keywords.length > 5 && (
                  <span className="px-2 py-1 text-gray-500 text-xs">
                    +{result.keywords.length - 5} more
                  </span>
                )}
              </div>
            </div>
            
            {expandedId === result.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="mb-3">
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Matched Content</h4>
                  <p className="text-gray-800 whitespace-pre-line">{result.snippet}</p>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Summary</h4>
                  <p className="text-gray-800">{result.summary}</p>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">All Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
