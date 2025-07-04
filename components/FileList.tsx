'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FileItem {
  id: string;
  filename: string;
  filepath: string;
  summary: string;
  keywords: string[];
  uploadDate: string;
}

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError(`Failed to load files: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);
  
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
  
  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm text-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Empty state
  if (files.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm text-center">
        <div className="mb-4">
          <Image 
            src="/window.svg" 
            alt="No files" 
            width={64} 
            height={64} 
            className="mx-auto"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No files uploaded yet</h3>
        <p className="text-gray-600">
          Upload your first file to get started with processing and search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files ({files.length})</h2>
      
      <ul className="space-y-4">
        {files.map((file) => (
          <li 
            key={file.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow transition-shadow duration-200 p-4"
          >
            <div className="flex items-start">
              <div className="w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center">
                <Image 
                  src="/file.svg" 
                  alt="File" 
                  width={24} 
                  height={24} 
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{file.filename}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {formatDate(file.uploadDate)}
                </p>
                
                <p className="text-gray-700 mt-2 line-clamp-2">{file.summary}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {file.keywords.slice(0, 5).map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {file.keywords.length > 5 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{file.keywords.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
