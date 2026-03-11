'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onFileUploaded: (fileData: Record<string, unknown>) => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Upload the file to the server
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onFileUploaded(response.file);
          setIsUploading(false);
        } else {
          setError(`Upload failed: ${xhr.statusText}`);
          setIsUploading(false);
        }
      };

      xhr.onerror = function() {
        setError('Upload failed due to network error');
        setIsUploading(false);
      };

      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);
    } catch (error) {
      setError(`Upload failed: ${(error as Error).message}`);
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 text-gray-400">
            <Image 
              src="/file.svg" 
              alt="Upload" 
              width={64} 
              height={64} 
            />
          </div>
          
          <div className="text-lg text-gray-600">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div>Uploading and processing file...</div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">{uploadProgress}%</div>
              </div>
            ) : (
              <div>
                <p className="font-medium">
                  Drag and drop your file here, or <span className="text-blue-500 cursor-pointer" onClick={handleButtonClick}>browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDFs, Word documents, text files, images, audio, and video supported
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.rtf,.md,.jpg,.jpeg,.png,.gif,.bmp,.mp3,.wav,.ogg,.mp4,.avi,.mov"
          />
        </div>
      </div>
    </div>
  );
}
