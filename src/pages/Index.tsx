
import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadSection from '@/components/UploadSection';
import ItemsSection from '@/components/ItemsSection';
import ResultsSection from '@/components/ResultsSection';
import StepsIndicator from '@/components/StepsIndicator';
import { AppStep, Bill } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';

const initialBill: Bill = {
  items: [],
  subtotal: 0,
  tax: 0,
  tip: 0,
  total: 0,
  people: []
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [bill, setBill] = useState<Bill>(initialBill);
  
  const handleBillProcessed = (processedBill: Bill) => {
    setBill(processedBill);
  };
  
  const handleNext = () => {
    if (currentStep === 'upload') setCurrentStep('items');
    else if (currentStep === 'items') setCurrentStep('results');
  };
  
  const handleBack = () => {
    if (currentStep === 'items') setCurrentStep('upload');
    else if (currentStep === 'results') setCurrentStep('items');
  };
  
  const handleReset = () => {
    setBill(initialBill);
    setCurrentStep('upload');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <StepsIndicator currentStep={currentStep} />
        
        {currentStep === 'upload' && (
          <UploadSection 
            onBillProcessed={handleBillProcessed} 
            onNext={handleNext}
          />
        )}
        
        {currentStep === 'items' && (
          <ItemsSection 
            bill={bill}
            onUpdateBill={setBill}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'results' && (
          <ResultsSection 
            bill={bill}
            onBack={handleBack}
            onReset={handleReset}
          />
        )}
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SplitTab - AI-Powered Bill Splitting</p>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
