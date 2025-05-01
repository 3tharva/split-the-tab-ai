
import React from 'react';
import { AppStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StepsIndicatorProps {
  currentStep: AppStep;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep }) => {
  const steps: { key: AppStep, label: string }[] = [
    { key: 'upload', label: 'Upload Bill' },
    { key: 'items', label: 'Assign Items' },
    { key: 'results', label: 'View Results' }
  ];

  const getStepStatus = (step: AppStep) => {
    if (step === 'upload' && currentStep === 'upload') return 'current';
    if (step === 'items' && currentStep === 'items') return 'current';
    if (step === 'results' && currentStep === 'results') return 'current';
    if (step === 'upload' && (currentStep === 'items' || currentStep === 'results')) return 'completed';
    if (step === 'items' && currentStep === 'results') return 'completed';
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step indicator */}
            <div className="flex flex-col items-center relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                getStepStatus(step.key) === 'completed' ? "bg-primary text-primary-foreground" : 
                getStepStatus(step.key) === 'current' ? "border-2 border-primary text-primary" : 
                "border-2 border-muted text-muted-foreground"
              )}>
                {getStepStatus(step.key) === 'completed' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (index + 1)}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium",
                getStepStatus(step.key) === 'completed' ? "text-primary" : 
                getStepStatus(step.key) === 'current' ? "text-foreground" : 
                "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                getStepStatus(steps[index + 1].key) === 'completed' || 
                getStepStatus(steps[index + 1].key) === 'current' 
                  ? "bg-primary" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepsIndicator;
