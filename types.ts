// Shared types for the Ge'ez Digital storefront.
// The store sells downloadable PDF playbooks, so a "product" carries a file,
// a page count and the chapter list instead of sizes and shipping.

export const CATEGORIES = [
  'Start Here',
  'Freelance & Remote',
  'AI & Design',
  'Content & Social',
  'Products & Services',
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export interface Product {
  id: number;
  slug: string;
  /** Public Whop product page used for checkout and fulfilment. */
  checkoutUrl: string;
  /** Whop price plan used by the embedded checkout. */
  planId: string;
  name: string;
  tagline: string;
  /** Selling price in USD. */
  price: number;
  /** Original price, only used by the bundle. */
  compareAt?: number;
  category: ProductCategory;
  /** Cover artwork (SVG served from /public). */
  image: string;
  /** Public sample path, or an empty value for a protected paid PDF. */
  file: string;
  pages: number;
  description: string;
  /** Concrete things the reader can do after finishing. */
  outcomes: string[];
  /** Chapter list, taken from the guide's own outline. */
  chapters: string[];
  /** What is inside the download, for the detail panel. */
  includes: string[];
  tags: string[];
  badge?: string;
  isBundle?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

/** Every product is a single-user digital licence, so quantity is always 1. */
export type DownloadFormat = 'PDF';

export interface Order {
  id: string;
  date: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  receiptSummary?: string;
  paymentRef?: string;
}

export type OrderStatus = 'Pending' | 'Delivered' | 'Refunded' | 'Cancelled';

export type PaymentStatus = 'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR';

export interface ReceiptAnalysisResult {
  isValid: boolean;
  summary: string;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

/** A file the signed-in reader is entitled to download. */
export interface Entitlement {
  product: Product;
  orderId: string;
  date: string;
}
