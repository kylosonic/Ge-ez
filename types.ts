export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ReceiptAnalysisResult {
  isValid: boolean;
  detectedAmount?: string;
  summary: string;
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Verified' | 'Pending';
  receiptSummary?: string;
  shippingMethod?: string;
  shippingCost?: number;
}