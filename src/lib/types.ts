
export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo: string[];
}

export interface Person {
  id: string;
  name: string;
}

export interface Bill {
  items: BillItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  people: Person[];
}

export interface Share {
  personId: string;
  personName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sharedWith: number;
    shareAmount: number;
  }[];
  itemsTotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
}

export type AppStep = "upload" | "items" | "results";
