
import React, { useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormField from './FormField';

export interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  searchable?: boolean;
  clearable?: boolean;
}

const SingleSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  description,
  error,
  searchable = true,
  clearable = true,
}: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable && searchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;
    
  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchValue('');
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchValue('');
  };
  
  return (
    <FormField 
      label={label} 
      required={required}
      description={description}
      error={error}
    >
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-between w-full p-2 px-3 text-sm border rounded-md cursor-pointer",
            isOpen ? "ring-2 ring-form-purple/30 border-form-purple" : "border-input",
            error && "border-form-red"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 flex items-center truncate">
            {isOpen && searchable ? (
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full focus:outline-none bg-transparent"
                placeholder="Search..."
                autoFocus
              />
            ) : selectedOption ? (
              <span>{selectedOption.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {selectedOption && clearable && (
              <button
                onClick={handleClear}
                className="p-1 text-form-gray hover:text-form-red rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
            <span className="text-muted-foreground">
              <ChevronDown size={18} className={cn(isOpen && "rotate-180 transition-transform")} />
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="sticky top-0 z-10 px-3 py-2 bg-white border-b flex items-center">
                <Search size={16} className="text-muted-foreground mr-2" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full focus:outline-none bg-transparent"
                  placeholder="Search..."
                  autoFocus
                />
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer flex items-center hover:bg-muted transition-colors",
                    option.value === value && "bg-form-purple-light text-form-purple-dark font-medium"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && <Check size={16} className="text-form-purple" />}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </FormField>
  );
};

export default SingleSelect;
