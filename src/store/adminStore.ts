"use client";

import { create } from "zustand";

// ── Types ────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  slug: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  tintType: string;
  vlt: string;
  uvBlock: number;
  heatRejection: number;
  pricePerSqft: number;
  imageUrl: string;
  badge: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  contact: { name: string; email: string; phone: string };
  shippingAddress: { address: string; city: string; postalCode: string; country: string };
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
  serviceType: "shipping" | "installation";
  pricing: {
    subtotal: number;
    shipping: number;
    installation: number;
    taxLabel: string;
    tax: number;
    total: number;
  };
  paymentStatus: "unpaid" | "paid" | "refunded";
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  country: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "banned";
}

export interface TintPricing {
  id: string;
  name: string;
  pricePerSqft: number;
}

export interface ShippingRate {
  country: string;
  countryCode: string;
  baseRate: number;
  perKgRate: number;
  freeShippingThreshold: number;
}

export interface InstallationRate {
  carType: string;
  country: string;
  baseRate: number;
  perWindowRate: number;
}

export interface PricingConfig {
  tintPricing: TintPricing[];
  shippingRates: ShippingRate[];
  installationRates: InstallationRate[];
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
  revenueByMonth: { month: string; revenue: number }[];
}

// ── Filter states ────────────────────────────────────────────────────────

export type OrderStatusFilter = "all" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface AdminState {
  // Data
  products: AdminProduct[];
  orders: AdminOrder[];
  users: AdminUser[];
  pricing: PricingConfig;
  stats: DashboardStats;

  // Loading
  isLoading: boolean;
  error: string | null;

  // Filters
  orderStatusFilter: OrderStatusFilter;
  orderSearch: string;
  userSearch: string;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Actions - Products
  setProducts: (products: AdminProduct[]) => void;
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, data: Partial<AdminProduct>) => void;
  removeProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;

  // Actions - Orders
  setOrders: (orders: AdminOrder[]) => void;
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => void;
  addOrderNote: (id: string, note: string) => void;
  setOrderStatusFilter: (filter: OrderStatusFilter) => void;
  setOrderSearch: (search: string) => void;

  // Actions - Users
  setUsers: (users: AdminUser[]) => void;
  toggleUserStatus: (id: string) => void;
  setUserSearch: (search: string) => void;

  // Actions - Pricing
  setPricing: (pricing: PricingConfig) => void;
  updateTintPrice: (id: string, price: number) => void;
  updateShippingRate: (countryCode: string, data: Partial<ShippingRate>) => void;
  updateInstallationRate: (carType: string, country: string, data: Partial<InstallationRate>) => void;

  // Actions - Stats
  setStats: (stats: DashboardStats) => void;

  // Actions - General
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultPricing: PricingConfig = {
  tintPricing: [
    { id: "standard", name: "Standard", pricePerSqft: 3 },
    { id: "metallic", name: "Metallic", pricePerSqft: 5 },
    { id: "carbon", name: "Carbon", pricePerSqft: 6 },
    { id: "ceramic", name: "Ceramic", pricePerSqft: 8 },
    { id: "crystalline", name: "Crystalline", pricePerSqft: 10 },
    { id: "adaptive", name: "Adaptive", pricePerSqft: 12 },
  ],
  shippingRates: [
    { country: "Philippines", countryCode: "PH", baseRate: 15, perKgRate: 2.5, freeShippingThreshold: 200 },
    { country: "Australia", countryCode: "AU", baseRate: 25, perKgRate: 4, freeShippingThreshold: 300 },
  ],
  installationRates: [
    { carType: "Sedan", country: "PH", baseRate: 50, perWindowRate: 8 },
    { carType: "SUV", country: "PH", baseRate: 65, perWindowRate: 10 },
    { carType: "Van", country: "PH", baseRate: 70, perWindowRate: 10 },
    { carType: "Truck", country: "PH", baseRate: 60, perWindowRate: 9 },
    { carType: "Sedan", country: "AU", baseRate: 80, perWindowRate: 15 },
    { carType: "SUV", country: "AU", baseRate: 100, perWindowRate: 18 },
    { carType: "Van", country: "AU", baseRate: 110, perWindowRate: 18 },
    { carType: "Truck", country: "AU", baseRate: 90, perWindowRate: 16 },
  ],
};

const defaultStats: DashboardStats = {
  totalOrders: 0,
  revenue: 0,
  activeUsers: 0,
  pendingOrders: 0,
  revenueByMonth: [],
};

export const useAdminStore = create<AdminState>((set) => ({
  // Data
  products: [],
  orders: [],
  users: [],
  pricing: defaultPricing,
  stats: defaultStats,

  // Loading
  isLoading: false,
  error: null,

  // Filters
  orderStatusFilter: "all",
  orderSearch: "",
  userSearch: "",

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Products
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((s) => ({ products: [product, ...s.products] })),
  updateProduct: (id, data) =>
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removeProduct: (id) =>
    set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  toggleProductActive: (id) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      ),
    })),

  // Orders
  setOrders: (orders) => set({ orders }),
  updateOrderStatus: (id, status) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),
  addOrderNote: (id, note) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, notes: [...o.notes, note] } : o
      ),
    })),
  setOrderStatusFilter: (orderStatusFilter) => set({ orderStatusFilter }),
  setOrderSearch: (orderSearch) => set({ orderSearch }),

  // Users
  setUsers: (users) => set({ users }),
  toggleUserStatus: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u
      ),
    })),
  setUserSearch: (userSearch) => set({ userSearch }),

  // Pricing
  setPricing: (pricing) => set({ pricing }),
  updateTintPrice: (id, price) =>
    set((s) => ({
      pricing: {
        ...s.pricing,
        tintPricing: s.pricing.tintPricing.map((t) =>
          t.id === id ? { ...t, pricePerSqft: price } : t
        ),
      },
    })),
  updateShippingRate: (countryCode, data) =>
    set((s) => ({
      pricing: {
        ...s.pricing,
        shippingRates: s.pricing.shippingRates.map((r) =>
          r.countryCode === countryCode ? { ...r, ...data } : r
        ),
      },
    })),
  updateInstallationRate: (carType, country, data) =>
    set((s) => ({
      pricing: {
        ...s.pricing,
        installationRates: s.pricing.installationRates.map((r) =>
          r.carType === carType && r.country === country ? { ...r, ...data } : r
        ),
      },
    })),

  // Stats
  setStats: (stats) => set({ stats }),

  // General
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
