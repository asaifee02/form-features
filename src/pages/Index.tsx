
import React, { useState } from 'react';
import SingleSelect from '@/components/SingleSelect';
import MultiSelect from '@/components/MultiSelect';
import FileUpload from '@/components/FileUpload';
import MultiFileUpload from '@/components/MultiFileUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  // Define state for form values
  const [singleSelectValue, setSingleSelectValue] = useState<string | null>(null);
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [multiFileValue, setMultiFileValue] = useState<File[]>([]);
  const [richTextValue, setRichTextValue] = useState('');
  
  // Define options for select inputs
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
  ];
  
  const interestOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'science', label: 'Science' },
    { value: 'art', label: 'Art' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create form data object
    const formData = {
      country: singleSelectValue,
      interests: multiSelectValue,
      document: fileValue ? {
        name: fileValue.name,
        type: fileValue.type,
        size: fileValue.size
      } : null,
      gallery: multiFileValue.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      description: richTextValue
    };
    
    console.log('Form submitted:', formData);
    
    // Show success toast
    toast.success("Form submitted successfully!", {
      description: "Your data has been received.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="form-flow-container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-form-gray-dark mb-2">Form Flow</h1>
          <p className="text-form-gray">A beautiful form with multiple input types</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <SingleSelect
            label="Country"
            options={countryOptions}
            value={singleSelectValue}
            onChange={setSingleSelectValue}
            placeholder="Select your country"
            required
            description="Please select the country where you currently reside."
          />
          
          <MultiSelect
            label="Interests"
            options={interestOptions}
            value={multiSelectValue}
            onChange={setMultiSelectValue}
            placeholder="Select your interests"
            description="Choose up to 5 topics you're interested in."
            max={5}
          />
          
          <FileUpload
            label="Profile Document"
            value={fileValue}
            onChange={setFileValue}
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            description="Please upload your CV or resume (PDF or Word document only)."
          />
          
          <MultiFileUpload
            label="Image Gallery"
            value={multiFileValue}
            onChange={setMultiFileValue}
            accept="image/*"
            description="Upload up to 5 images (JPG, PNG, or GIF)."
            maxFiles={5}
          />
          
          <RichTextEditor
            label="Description"
            value={richTextValue}
            onChange={setRichTextValue}
            placeholder="Describe yourself..."
            description="Use the toolbar to format your text."
          />
          
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              size="lg"
              className="bg-form-purple hover:bg-form-purple-dark"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Submit Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
