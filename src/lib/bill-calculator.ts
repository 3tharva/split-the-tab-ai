
import { Bill, Share } from "./types";

// Calculate each person's share based on assigned items, including tax and tip
export const calculateShares = (bill: Bill): Share[] => {
  const { items, subtotal, tax, tip, people } = bill;
  
  // Initialize shares for each person
  const shares: Share[] = people.map(person => ({
    personId: person.id,
    personName: person.name,
    items: [],
    itemsTotal: 0,
    taxShare: 0,
    tipShare: 0,
    total: 0
  }));

  // Calculate shares for each item
  items.forEach(item => {
    const assignedCount = item.assignedTo.length;
    if (assignedCount === 0) return; // Skip unassigned items
    
    const pricePerPerson = (item.price * item.quantity) / assignedCount;
    
    // Add this item's share to each assigned person
    item.assignedTo.forEach(personId => {
      const personShare = shares.find(share => share.personId === personId);
      if (personShare) {
        personShare.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sharedWith: assignedCount,
          shareAmount: pricePerPerson
        });
        personShare.itemsTotal += pricePerPerson;
      }
    });
  });
  
  // Calculate tax and tip proportionally
  shares.forEach(share => {
    if (subtotal > 0) {
      const proportion = share.itemsTotal / subtotal;
      share.taxShare = tax * proportion;
      share.tipShare = tip * proportion;
      share.total = share.itemsTotal + share.taxShare + share.tipShare;
    }
  });
  
  return shares;
};
