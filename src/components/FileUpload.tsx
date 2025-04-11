
import React, { useState, useRef } from 'react';
import { FileUp, Trash2, X, File as FileIcon, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormField from './FormField';

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  description?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({
  label,
  value,
  onChange,
  required = false,
  description,
  error,
  accept = '*',
  maxSize = 5, // Default 5MB
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Check if the file is an image
  const isImage = value && value.type.startsWith('image/');
  
  // Preview URL for images
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (isImage && value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return () => {};
  }, [value, isImage]);
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      
      // Handle special cases like image/* or application/*
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      });
      
      if (!isAccepted) {
        setFileError('File type not accepted.');
        return false;
      }
    }
    
    setFileError(null);
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onChange(file);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onChange(file);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleRemoveFile = () => {
    onChange(null);
    setPreviewUrl(null);
    setFileError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const displayError = fileError || error;
  
  return (
    <FormField 
      label={label} 
      required={required}
      description={description}
      error={displayError}
    >
      {!value ? (
        <div
          className={cn(
            "file-upload-area",
            dragActive && "dragging"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="w-10 h-10 text-form-gray mb-2" />
          <p className="text-sm font-medium mb-1">Click or drop a file</p>
          <p className="text-xs text-form-gray">
            {accept === '*' 
              ? 'Any file type up to ' 
              : `Accepted formats: ${accept.split(',').join(', ')} up to `}
            {maxSize}MB
          </p>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="file-preview">
          {isImage && previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="file-preview-image" 
            />
          ) : (
            <div className="file-preview-image bg-gray-200 flex items-center justify-center">
              {isImage ? (
                <Image size={20} className="text-form-gray" />
              ) : (
                <FileIcon size={20} className="text-form-gray" />
              )}
            </div>
          )}
          
          <div className="file-preview-info">
            <p className="file-preview-name">{value.name}</p>
            <p className="file-preview-size">{formatFileSize(value.size)}</p>
          </div>
          
          <button 
            className="file-preview-remove" 
            onClick={handleRemoveFile}
            aria-label="Remove file"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </FormField>
  );
};

export default FileUpload;
