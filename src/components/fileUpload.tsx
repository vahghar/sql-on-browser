'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileLoad: (file: File) => void;
  loading?: boolean;
}

export default function FileUpload({ onFileLoad, loading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && (files[0].name.endsWith('.csv') || files[0].name.endsWith('.xlsx'))) {
      setSelectedFile(files[0]);
      onFileLoad(files[0]);
    }
  }, [onFileLoad]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      onFileLoad(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${loading ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700">
              Upload your CSV or Excel file
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports .csv, .xlsx, .xls files
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={loading}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-gray-600">Processing file...</p>
        </div>
      )}
    </div>
  );
}