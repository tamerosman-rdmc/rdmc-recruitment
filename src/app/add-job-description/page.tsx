'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default function AddJobDescriptionPage() {
    const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadResult(null);
    } else if (file) {
      setUploadResult({
        success: false,
        error: 'Please select a PDF file only.'
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async (action: 'upload' | 'fetch') => {
    if (!selectedFile) {
      setUploadResult({
        success: false,
        error: 'Please select a PDF file first.'
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('data', selectedFile);

      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/5bc7c8c0-4eeb-462a-a41f-1780113484c9', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      await response.json();
      setUploadResult({
        success: true,
        message: 'Job description uploaded successfully!'
      });

      // Clear the selected file after successful upload
      setSelectedFile(null);
        if (action === 'fetch') {
          // Fetch the talent after successful upload
          router.push('/fetch')
        }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload job description. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Job Description</h1>
          <p className="text-gray-600">Upload PDF files containing job descriptions for the talent search system</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                Upload Job Description PDF
              </Label>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                  aria-label="Upload PDF file"
                  title="Click to select a PDF file"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileText className="h-16 w-16 text-green-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFile}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="h-16 w-16 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag and drop your PDF file here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse files
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Only PDF files are supported
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => handleUpload('upload')}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                size="lg"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Job Description
                  </>
                )}
              </Button>  
              <Button
                onClick={() => handleUpload('fetch')}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                size="lg"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Job Description then fetch talent
                  </>
                )}
              </Button>
            </div>

            {/* Result Message */}
            {uploadResult && (
              <div className={`rounded-lg p-4 ${
                uploadResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {uploadResult.success ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <p className={`font-medium ${
                    uploadResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadResult.success ? uploadResult.message : uploadResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <p>Select or drag and drop a PDF file containing the job description</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <p>Only PDF files are accepted for processing</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
              <p>Click &ldquo;Upload Job Description&rdquo; to send the file to the system</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium text-blue-600">4</span>
              </div>
              <p>The uploaded job descriptions will be available in the talent search system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
