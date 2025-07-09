'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2, Image, Video, File, Link } from 'lucide-react';
import { MediaItem } from '@/types/media';

interface MediaUploaderProps {
  onClose: () => void;
  onSuccess: (media: MediaItem) => void;
}

export function MediaUploader({ onClose, onSuccess }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('alt', file.name); // Use filename as alt text

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Upload failed. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          } else if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (jsonErr) {
          // Not JSON, keep default errorMsg
        }
        setErrorMessage(errorMsg);
        return;
      }

      const result = await response.json();
      onSuccess(result.media);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onSuccess, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.json']
    },
    maxFiles: 1
  } as any);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={uploading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-sm">
              {errorMessage}
            </div>
          )}
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} disabled={uploading} />
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="text-blue-600 font-medium">Uploading...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait</p>
                </div>
                {/* Upload Progress */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop your file here</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      Images, videos, and documents supported
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        <span>Images</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        <span>Videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        <span>Files</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alternative Upload Options */}
          {!uploading && (
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Or upload via</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setErrorMessage('URL upload feature coming soon!');
                    }}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setErrorMessage('Bulk upload feature coming soon!');
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!uploading && (
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 