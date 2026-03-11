'use client';

import { useState, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import FileList from '@/components/FileList';

interface SearchResultItem {
  id: string;
  filename: string;
  summary: string;
  snippet: string;
  keywords: string[];
  uploadDate: string;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [fileListKey, setFileListKey] = useState(0);

  const handleFileUploaded = useCallback(() => {
    // Refresh file list by changing key
    setFileListKey(prev => prev + 1);
  }, []);

  const handleSearchResults = useCallback((results: SearchResultItem[]) => {
    setSearchResults(results);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Local Document Search Engine
          </h1>
          <p className="text-gray-600">
            Upload files, extract content, and search across your documents
          </p>
        </header>

        <FileUpload onFileUploaded={handleFileUploaded} />

        <SearchBar onSearchResults={handleSearchResults} />

        {searchResults !== null ? (
          <SearchResults results={searchResults} />
        ) : (
          <FileList key={fileListKey} />
        )}
      </div>
    </main>
  );
}
