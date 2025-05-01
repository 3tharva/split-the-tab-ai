
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bill, Share } from '@/lib/types';
import { calculateShares } from '@/lib/bill-calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ResultsSectionProps {
  bill: Bill;
  onBack: () => void;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ bill, onBack, onReset }) => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  // Calculate shares
  const shares = calculateShares(bill);
  
  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleCopyResults = () => {
    // Create text representation of the splits
    let resultText = `Split The Tab - Bill Breakdown\n`;
    resultText += `Total: ${formatCurrency(bill.total)}\n\n`;
    
    shares.forEach(share => {
      resultText += `${share.personName}: ${formatCurrency(share.total)}\n`;
      resultText += `Items: ${formatCurrency(share.itemsTotal)}\n`;
      resultText += `Tax: ${formatCurrency(share.taxShare)}\n`;
      resultText += `Tip: ${formatCurrency(share.tipShare)}\n\n`;
    });
    
    navigator.clipboard.writeText(resultText)
      .then(() => toast.success('Results copied to clipboard'))
      .catch(() => toast.error('Failed to copy results'));
  };
  
  const handleShareResults = () => {
    // In a real app, this would open a share dialog or generate a shareable link
    toast.info('Sharing functionality would be implemented here');
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Bill Split Results</h2>
        <p className="text-muted-foreground">
          Here's how the bill should be split between everyone
        </p>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="summary" onClick={() => setActiveTab('summary')}>
            Summary
          </TabsTrigger>
          <TabsTrigger value="details" onClick={() => setActiveTab('details')}>
            Detailed Breakdown
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shares.map((share) => (
              <Card key={share.personId} className="overflow-hidden">
                <div className="bg-primary px-4 py-2 text-primary-foreground">
                  <h3 className="font-medium">{share.personName}</h3>
                </div>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold mb-2">
                    {formatCurrency(share.total)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{formatCurrency(share.itemsTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>{formatCurrency(share.taxShare)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip:</span>
                      <span>{formatCurrency(share.tipShare)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="mt-0">
          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="space-y-4">
                {shares.map((share) => (
                  <div key={share.personId} className="border rounded-lg overflow-hidden">
                    <div className="bg-primary px-4 py-2 text-primary-foreground">
                      <h3 className="font-medium">{share.personName}</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Items</h4>
                        <div className="space-y-2">
                          {share.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <div>
                                <span>{item.name}</span>
                                {item.sharedWith > 1 && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (shared with {item.sharedWith - 1} {item.sharedWith - 1 === 1 ? 'other' : 'others'})
                                  </span>
                                )}
                              </div>
                              <span>{formatCurrency(item.shareAmount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Items Subtotal:</span>
                          <span>{formatCurrency(share.itemsTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>{formatCurrency(share.taxShare)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tip:</span>
                          <span>{formatCurrency(share.tipShare)}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1">
                          <span>Total:</span>
                          <span>{formatCurrency(share.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCopyResults}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Copy Results
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShareResults}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share Results
          </Button>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="default" onClick={onReset}>
            Split Another Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
