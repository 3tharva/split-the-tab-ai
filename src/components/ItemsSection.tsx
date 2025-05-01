
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bill, BillItem, Person } from '@/lib/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ItemsSectionProps {
  bill: Bill;
  onUpdateBill: (updatedBill: Bill) => void;
  onNext: () => void;
  onBack: () => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({ 
  bill, 
  onUpdateBill,
  onNext,
  onBack 
}) => {
  const [newPersonName, setNewPersonName] = useState('');
  const [tipPercentage, setTipPercentage] = useState(
    bill.subtotal > 0 ? Math.round((bill.tip / bill.subtotal) * 100) : 20
  );
  
  const handleAddPerson = () => {
    if (newPersonName.trim() === '') {
      toast.error('Please enter a name');
      return;
    }
    
    // Check for duplicate names
    if (bill.people.some(p => p.name.toLowerCase() === newPersonName.trim().toLowerCase())) {
      toast.error('This name is already added');
      return;
    }
    
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim()
    };
    
    onUpdateBill({
      ...bill,
      people: [...bill.people, newPerson]
    });
    
    setNewPersonName('');
    toast.success(`Added ${newPersonName}`);
  };
  
  const handleRemovePerson = (personId: string) => {
    // Remove person from people array
    const updatedPeople = bill.people.filter(p => p.id !== personId);
    
    // Remove person from all item assignments
    const updatedItems = bill.items.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(id => id !== personId)
    }));
    
    onUpdateBill({
      ...bill,
      people: updatedPeople,
      items: updatedItems
    });
    
    toast.info('Person removed');
  };
  
  const handleAssignItem = (itemId: string, personId: string) => {
    const updatedItems = bill.items.map(item => {
      if (item.id === itemId) {
        // If already assigned, remove assignment, otherwise add
        const isAssigned = item.assignedTo.includes(personId);
        const updatedAssignedTo = isAssigned
          ? item.assignedTo.filter(id => id !== personId)
          : [...item.assignedTo, personId];
        
        return {
          ...item,
          assignedTo: updatedAssignedTo
        };
      }
      return item;
    });
    
    onUpdateBill({
      ...bill,
      items: updatedItems
    });
  };
  
  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTipPercentage = parseInt(e.target.value) || 0;
    setTipPercentage(newTipPercentage);
    
    // Update bill with new tip amount
    const newTipAmount = (bill.subtotal * newTipPercentage) / 100;
    onUpdateBill({
      ...bill,
      tip: newTipAmount,
      total: bill.subtotal + bill.tax + newTipAmount
    });
  };
  
  const handleContinue = () => {
    // Check if all items are assigned to at least one person
    const unassignedItems = bill.items.filter(item => item.assignedTo.length === 0);
    if (unassignedItems.length > 0) {
      toast.warning(`${unassignedItems.length} items are not assigned to anyone`);
      return;
    }
    
    // Proceed to next step
    onNext();
  };
  
  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* People Management Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">People</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add person" 
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPerson();
                  }}
                />
                <Button onClick={handleAddPerson}>Add</Button>
              </div>
              
              <div className="mt-4 space-y-2">
                {bill.people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Add people to split the bill with
                  </p>
                ) : (
                  bill.people.map((person) => (
                    <div 
                      key={person.id} 
                      className="flex items-center justify-between bg-secondary p-2 rounded"
                    >
                      <span>{person.name}</span>
                      <button 
                        onClick={() => handleRemovePerson(person.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bill Items Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Receipt Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="receipt-paper">
              <div className="mb-2 text-center">
                <h3 className="text-lg font-semibold">Restaurant Receipt</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-4 space-y-1">
                <div className="flex text-xs text-muted-foreground border-b pb-1">
                  <div className="w-1/2">Item</div>
                  <div className="w-1/4 text-right">Price</div>
                  <div className="w-1/4">Assigned To</div>
                </div>
                
                {bill.items.map((item) => (
                  <div key={item.id} className="receipt-item-row flex py-2 border-b border-dashed">
                    <div className="w-1/2">
                      <div>{item.name}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.price)}
                        </div>
                      )}
                    </div>
                    <div className="w-1/4 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="w-1/4">
                      <div className="flex flex-wrap gap-1">
                        {bill.people.map((person) => (
                          <button
                            key={person.id}
                            onClick={() => handleAssignItem(item.id, person.id)}
                            className={`px-1 py-0.5 text-xs rounded ${
                              item.assignedTo.includes(person.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {person.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(bill.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(bill.tax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Tip</span>
                      <Input
                        type="number"
                        value={tipPercentage}
                        onChange={handleTipChange}
                        className="w-16 h-6 text-sm px-2"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm">%</span>
                    </div>
                    <span>{formatCurrency(bill.tip)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(bill.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {bill.people.length === 0 && (
              <div className="mt-4 text-center text-amber-600 bg-amber-50 p-2 rounded">
                <p>Please add at least one person to split the bill.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={bill.people.length === 0}
        >
          Calculate Split
        </Button>
      </div>
    </div>
  );
};

export default ItemsSection;
