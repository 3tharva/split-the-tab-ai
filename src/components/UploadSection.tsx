
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { processReceipt } from '@/lib/ocr-simulation';
import { Bill } from '@/lib/types';
import { toast } from 'sonner';

interface UploadSectionProps {
  onBillProcessed: (bill: Bill) => void;
  onNext: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onBillProcessed, onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if it's an image file
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file (JPEG, PNG)');
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleProcess = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const processedBill = await processReceipt(selectedFile);
      onBillProcessed(processedBill);
      toast.success('Bill processed successfully!');
      onNext();
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error('Failed to process the receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Split your bill in seconds
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Upload your receipt, let our AI extract items, and easily split expenses among friends.
        </p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-12 transition-all ${
          isDragging ? 'border-primary bg-accent/50' : 'border-muted'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="bg-accent p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {selectedFile ? selectedFile.name : 'Drag & drop your receipt'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PNG, JPG up to 10MB'}
            </p>
          </div>
          <div className="flex gap-4">
            {!selectedFile && (
              <Button
                variant="outline"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Choose file
              </Button>
            )}
            {selectedFile && (
              <>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  Change file
                </Button>
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Process Receipt'}
                </Button>
              </>
            )}
            <input 
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have a receipt? Use our{" "}
          <button 
            className="text-primary hover:underline"
            onClick={handleProcess}
            disabled={isProcessing}
          >
            sample receipt
          </button>
          {" "}to see how it works.
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
