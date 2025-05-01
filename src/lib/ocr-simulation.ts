
import { Bill, BillItem } from "./types";

// This simulates OCR processing by returning a predefined bill structure
// In a real implementation, this would process an image using an OCR API
export const processReceipt = (imageFile: File): Promise<Bill> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // Generate random ID for each item
      const generateId = () => Math.random().toString(36).substring(2, 10);
      
      // Sample bill data (in a real app, this would come from OCR)
      const bill: Bill = {
        items: [
          {
            id: generateId(),
            name: "Chicken Pad Thai",
            price: 14.95,
            quantity: 1,
            assignedTo: []
          },
          {
            id: generateId(),
            name: "Garden Salad",
            price: 8.95,
            quantity: 1,
            assignedTo: []
          },
          {
            id: generateId(),
            name: "Margherita Pizza",
            price: 15.50,
            quantity: 1,
            assignedTo: []
          },
          {
            id: generateId(),
            name: "Iced Tea",
            price: 3.50,
            quantity: 2,
            assignedTo: []
          },
          {
            id: generateId(),
            name: "Chocolate Cake",
            price: 7.95,
            quantity: 1,
            assignedTo: []
          }
        ],
        subtotal: 54.35,
        tax: 4.89,
        tip: 10.87,
        total: 70.11,
        people: []
      };
      
      resolve(bill);
    }, 2000); // 2-second delay to simulate processing
  });
};
