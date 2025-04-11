
import React, { useState, useRef } from 'react';
import { FileUp, Trash2, X, File as FileIcon, Image, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormField from './FormField';

interface MultiFileUploadProps {
  label: string;
  value: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  description?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
}

const MultiFileUpload = ({
  label,
  value = [],
  onChange,
  required = false,
  description,
  error,
  accept = '*',
  maxSize = 5, // Default 5MB
  maxFiles = 5, // Default max 5 files
}: MultiFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileErrors, setFileErrors] = useState<Map<string, string>>(new Map());
  
  // Preview URLs for images
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  
  React.useEffect(() => {
    // Create and store preview URLs for images
    const newPreviewUrls = new Map<string, string>();
    
    value.forEach(file => {
      if (file.type.startsWith('image/')) {
        const existingUrl = previewUrls.get(file.name);
        if (!existingUrl) {
          newPreviewUrls.set(file.name, URL.createObjectURL(file));
        } else {
          newPreviewUrls.set(file.name, existingUrl);
        }
      }
    });
    
    // Clean up any URLs for files that were removed
    previewUrls.forEach((url, name) => {
      if (!value.some(file => file.name === name)) {
        URL.revokeObjectURL(url);
      }
    });
    
    setPreviewUrls(new Map([...previewUrls, ...newPreviewUrls]));
    
    return () => {
      // Clean up all preview URLs on unmount
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);
  
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
      setFileErrors(prev => new Map(prev.set(file.name, `File is too large. Maximum size is ${maxSize}MB.`)));
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
        setFileErrors(prev => new Map(prev.set(file.name, 'File type not accepted.')));
        return false;
      }
    }
    
    // Clear error for this file if it exists
    if (fileErrors.has(file.name)) {
      const newErrors = new Map(fileErrors);
      newErrors.delete(file.name);
      setFileErrors(newErrors);
    }
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };
  
  const addFiles = (filesToAdd: File[]) => {
    // Check if adding these files would exceed the max
    if (value.length + filesToAdd.length > maxFiles) {
      const remainingSlots = Math.max(0, maxFiles - value.length);
      filesToAdd = filesToAdd.slice(0, remainingSlots);
    }
    
    // Validate and add new files
    const validFiles = filesToAdd.filter(validateFile);
    
    // Check for duplicate file names
    const newFiles = validFiles.filter(
      file => !value.some(existingFile => existingFile.name === file.name)
    );
    
    onChange([...value, ...newFiles]);
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
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
  
  const handleRemoveFile = (fileToRemove: File) => {
    // Remove file from value
    onChange(value.filter(file => file !== fileToRemove));
    
    // Remove any errors for this file
    if (fileErrors.has(fileToRemove.name)) {
      const newErrors = new Map(fileErrors);
      newErrors.delete(fileToRemove.name);
      setFileErrors(newErrors);
    }
  };
  
  const handleAddMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };
  
  return (
    <FormField 
      label={label} 
      required={required}
      description={description}
      error={error}
    >
      <div className="space-y-3">
        {value.length > 0 && (
          <div className="space-y-2">
            {value.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const previewUrl = previewUrls.get(file.name);
              const fileError = fileErrors.get(file.name);
              
              return (
                <div key={`${file.name}-${index}`} className={cn(
                  "file-preview",
                  fileError && "border-form-red bg-red-50"
                )}>
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
                    <p className="file-preview-name">{file.name}</p>
                    <p className="file-preview-size">
                      {formatFileSize(file.size)}
                      {fileError && (
                        <span className="text-form-red ml-2">{fileError}</span>
                      )}
                    </p>
                  </div>
                  
                  <button 
                    className="file-preview-remove" 
                    onClick={() => handleRemoveFile(file)}
                    aria-label="Remove file"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {value.length < maxFiles && (
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
            <p className="text-sm font-medium mb-1">
              {value.length > 0 ? "Add more files" : "Click or drop files"}
            </p>
            <p className="text-xs text-form-gray">
              {accept === '*' 
                ? 'Any file type up to ' 
                : `Accepted formats: ${accept.split(',').join(', ')} up to `}
              {maxSize}MB ({value.length}/{maxFiles} files)
            </p>
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
              multiple
            />
          </div>
        )}
        
        {value.length > 0 && value.length < maxFiles && (
          <button
            type="button"
            className="flex items-center justify-center w-full p-2 text-sm text-form-purple border border-form-purple-light rounded-md hover:bg-form-purple-light transition-colors"
            onClick={handleAddMoreClick}
          >
            <Plus size={16} className="mr-1" />
            Add more files ({value.length}/{maxFiles})
          </button>
        )}
      </div>
    </FormField>
  );
};

export default MultiFileUpload;
