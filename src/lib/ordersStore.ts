// Shared in-memory orders store (replace with DB later)

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    carType: string;
    carModel: string | null;
    tintType: string;
    tintName: string;
    selectedWindows: string[];
    totalSqft: number;
    unitPrice: number;
    subtotal: number;
  };
  serviceType: 'shipping' | 'installation';
  pricing: {
    subtotal: number;
    shipping: number;
    installation: number;
    taxLabel: string;
    tax: number;
    total: number;
  };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const orders: Map<string, Order> = new Map();
