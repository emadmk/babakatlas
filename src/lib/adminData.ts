// =============================================================================
// Centralized In-Memory Data Store - SINGLE SOURCE OF TRUTH
// =============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface TintProduct {
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

export interface CarTypeConfig {
  id: string;
  slug: string;
  name: { en: string; tl: string };
  type: string;
  windowCount: number;
  imageUrl: string;
  active: boolean;
}

export interface WindowConfig {
  id: string;
  carType: string;
  position: string;
  label: { en: string; tl: string };
  defaultSqft: number;
  active: boolean;
}

export interface ServiceConfig {
  id: string;
  slug: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  features: { en: string[]; tl: string[] };
  active: boolean;
}

export interface ShippingRateConfig {
  id: string;
  country: string;
  countryName: { en: string; tl: string };
  flag: string;
  baseRate: number;
  perSqftRate: number;
  freeAbove: number;
  deliveryDays: { min: number; max: number };
  active: boolean;
}

export interface InstallationRateConfig {
  id: string;
  country: string;
  carType: string;
  baseRate: number;
  perWindowRate: number;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  taxRates: { PH: number; AU: number };
  currencies: { PH: string; AU: string };
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

const now = new Date().toISOString();

const seedProducts: TintProduct[] = [
  {
    id: "prod-standard",
    slug: "standard",
    name: { en: "Standard", tl: "Karaniwan" },
    description: {
      en: "Reliable dyed film with solid UV protection and classic appearance.",
      tl: "Maaasahang pelikulang tinina na may matibay na proteksyon sa UV at klasikong hitsura.",
    },
    tintType: "standard",
    vlt: "35%",
    uvBlock: 95,
    heatRejection: 35,
    pricePerSqft: 3,
    imageUrl: "/images/tints/standard.jpg",
    badge: null,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-ceramic",
    slug: "ceramic",
    name: { en: "Ceramic", tl: "Seramiko" },
    description: {
      en: "Nano-ceramic technology for maximum clarity and superior heat rejection.",
      tl: "Nano-ceramic na teknolohiya para sa pinakamataas na kalinawan at mahusay na pagtanggi sa init.",
    },
    tintType: "ceramic",
    vlt: "20-70%",
    uvBlock: 99,
    heatRejection: 60,
    pricePerSqft: 8,
    imageUrl: "/images/tints/ceramic.jpg",
    badge: "Most Popular",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-carbon",
    slug: "carbon",
    name: { en: "Carbon", tl: "Karbon" },
    description: {
      en: "Carbon-infused film with no signal interference and matte finish.",
      tl: "Pelikulang may halong carbon na walang signal interference at matte na tapusin.",
    },
    tintType: "carbon",
    vlt: "25-50%",
    uvBlock: 99,
    heatRejection: 50,
    pricePerSqft: 6,
    imageUrl: "/images/tints/carbon.jpg",
    badge: null,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-adaptive",
    slug: "adaptive",
    name: { en: "Adaptive", tl: "Adaptive" },
    description: {
      en: "Smart film that automatically adjusts tint based on light conditions.",
      tl: "Matalinong pelikula na awtomatikong nag-aayos ng tint batay sa kondisyon ng liwanag.",
    },
    tintType: "adaptive",
    vlt: "Auto-adjusting",
    uvBlock: 99,
    heatRejection: 65,
    pricePerSqft: 12,
    imageUrl: "/images/tints/adaptive.jpg",
    badge: "Premium",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-crystalline",
    slug: "crystalline",
    name: { en: "Crystalline", tl: "Kristalino" },
    description: {
      en: "Multi-layer optical film that keeps your windows virtually clear.",
      tl: "Multi-layer na optical na pelikula na nagpapanatiling malinaw ang iyong mga bintana.",
    },
    tintType: "crystalline",
    vlt: "40-90%",
    uvBlock: 99,
    heatRejection: 60,
    pricePerSqft: 10,
    imageUrl: "/images/tints/crystalline.jpg",
    badge: null,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-metallic",
    slug: "metallic",
    name: { en: "Metallic", tl: "Metaliko" },
    description: {
      en: "Reflective metallic particles for enhanced heat rejection and privacy.",
      tl: "Mga reflective metallic particle para sa pinahusay na pagtanggi sa init at privacy.",
    },
    tintType: "metallic",
    vlt: "15-35%",
    uvBlock: 97,
    heatRejection: 45,
    pricePerSqft: 5,
    imageUrl: "/images/tints/metallic.jpg",
    badge: null,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

const seedCarTypes: CarTypeConfig[] = [
  {
    id: "car-sedan",
    slug: "sedan",
    name: { en: "Sedan", tl: "Sedan" },
    type: "SEDAN",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-suv",
    slug: "suv",
    name: { en: "SUV", tl: "SUV" },
    type: "SUV",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-van",
    slug: "van",
    name: { en: "Van", tl: "Van" },
    type: "VAN",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-station-wagon",
    slug: "station_wagon",
    name: { en: "Station Wagon", tl: "Station Wagon" },
    type: "STATION_WAGON",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-hatchback",
    slug: "hatchback",
    name: { en: "Hatchback", tl: "Hatchback" },
    type: "HATCHBACK",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-coupe",
    slug: "coupe",
    name: { en: "Coupe", tl: "Coupe" },
    type: "COUPE",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-truck",
    slug: "truck",
    name: { en: "Truck", tl: "Trak" },
    type: "TRUCK",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop",
    active: true,
  },
  {
    id: "car-convertible",
    slug: "convertible",
    name: { en: "Convertible", tl: "Convertible" },
    type: "CONVERTIBLE",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=250&fit=crop",
    active: true,
  },
];

function windowId(carType: string, position: string): string {
  return `win-${carType.toLowerCase()}-${position.toLowerCase()}`;
}

function windowLabel(position: string): { en: string; tl: string } {
  const labels: Record<string, { en: string; tl: string }> = {
    FRONT_WINDSHIELD: { en: "Front Windshield", tl: "Harapang Windshield" },
    REAR_WINDSHIELD: { en: "Rear Windshield", tl: "Likurang Windshield" },
    FRONT_LEFT: { en: "Front Left", tl: "Harapang Kaliwa" },
    FRONT_RIGHT: { en: "Front Right", tl: "Harapang Kanan" },
    REAR_LEFT: { en: "Rear Left", tl: "Likurang Kaliwa" },
    REAR_RIGHT: { en: "Rear Right", tl: "Likurang Kanan" },
    REAR_QUARTER_LEFT: { en: "Rear Quarter Left", tl: "Likurang Quarter Kaliwa" },
    REAR_QUARTER_RIGHT: { en: "Rear Quarter Right", tl: "Likurang Quarter Kanan" },
    SUNROOF: { en: "Sunroof", tl: "Sunroof" },
  };
  return labels[position] ?? { en: position, tl: position };
}

interface WindowSeedEntry {
  position: string;
  sqft: number;
}

const windowSeedMap: Record<string, WindowSeedEntry[]> = {
  SEDAN: [
    { position: "FRONT_WINDSHIELD", sqft: 12 },
    { position: "REAR_WINDSHIELD", sqft: 10 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 4 },
    { position: "REAR_RIGHT", sqft: 4 },
  ],
  SUV: [
    { position: "FRONT_WINDSHIELD", sqft: 14 },
    { position: "REAR_WINDSHIELD", sqft: 12 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 5 },
    { position: "REAR_RIGHT", sqft: 5 },
    { position: "REAR_QUARTER_LEFT", sqft: 3 },
    { position: "REAR_QUARTER_RIGHT", sqft: 3 },
  ],
  VAN: [
    { position: "FRONT_WINDSHIELD", sqft: 16 },
    { position: "REAR_WINDSHIELD", sqft: 14 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 6 },
    { position: "REAR_RIGHT", sqft: 6 },
    { position: "REAR_QUARTER_LEFT", sqft: 4 },
    { position: "REAR_QUARTER_RIGHT", sqft: 4 },
  ],
  STATION_WAGON: [
    { position: "FRONT_WINDSHIELD", sqft: 13 },
    { position: "REAR_WINDSHIELD", sqft: 11 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 5 },
    { position: "REAR_RIGHT", sqft: 5 },
    { position: "REAR_QUARTER_LEFT", sqft: 3 },
    { position: "REAR_QUARTER_RIGHT", sqft: 3 },
  ],
  HATCHBACK: [
    { position: "FRONT_WINDSHIELD", sqft: 11 },
    { position: "REAR_WINDSHIELD", sqft: 9 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
  ],
  COUPE: [
    { position: "FRONT_WINDSHIELD", sqft: 11 },
    { position: "REAR_WINDSHIELD", sqft: 8 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
  ],
  TRUCK: [
    { position: "FRONT_WINDSHIELD", sqft: 14 },
    { position: "REAR_WINDSHIELD", sqft: 10 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
  ],
  CONVERTIBLE: [
    { position: "FRONT_WINDSHIELD", sqft: 10 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
    { position: "SUNROOF", sqft: 6 },
  ],
};

const seedWindowConfigs: WindowConfig[] = [];
for (const [carType, windows] of Object.entries(windowSeedMap)) {
  for (const w of windows) {
    seedWindowConfigs.push({
      id: windowId(carType, w.position),
      carType,
      position: w.position,
      label: windowLabel(w.position),
      defaultSqft: w.sqft,
      active: true,
    });
  }
}

const seedServiceConfigs: ServiceConfig[] = [
  {
    id: "svc-shipping",
    slug: "shipping_only",
    name: { en: "Shipping Only", tl: "Pagpapadala Lamang" },
    description: {
      en: "We ship the pre-cut tint film directly to your address. Perfect for DIY enthusiasts or if you have a preferred installer.",
      tl: "Ipapadala namin ang pre-cut na tint film direkta sa iyong address. Perpekto para sa mga DIY enthusiast o kung mayroon kang preferred installer.",
    },
    features: {
      en: [
        "Pre-cut to your exact window specifications",
        "Includes installation guide",
        "Ships with all necessary tools",
        "Free shipping on orders over threshold",
      ],
      tl: [
        "Pre-cut sa iyong eksaktong window specifications",
        "May kasamang installation guide",
        "Ipinapadala kasama ang lahat ng kinakailangang kasangkapan",
        "Libreng pagpapadala sa mga order na lampas sa threshold",
      ],
    },
    active: true,
  },
  {
    id: "svc-installation",
    slug: "installation",
    name: { en: "Professional Installation", tl: "Propesyonal na Pag-install" },
    description: {
      en: "Our certified technicians will install your tint film at a service center near you.",
      tl: "Ang aming mga sertipikadong technician ang mag-i-install ng iyong tint film sa isang service center malapit sa iyo.",
    },
    features: {
      en: [
        "Certified professional installers",
        "Lifetime warranty on installation",
        "Convenient scheduling",
        "Quality guaranteed finish",
      ],
      tl: [
        "Mga sertipikadong propesyonal na installer",
        "Lifetime warranty sa pag-install",
        "Maginhawang pag-schedule",
        "Garantisadong kalidad ng tapusin",
      ],
    },
    active: true,
  },
];

const seedShippingRates: ShippingRateConfig[] = [
  {
    id: "ship-ph",
    country: "PH",
    countryName: { en: "Philippines", tl: "Pilipinas" },
    flag: "\u{1F1F5}\u{1F1ED}",
    baseRate: 15,
    perSqftRate: 2,
    freeAbove: 200,
    deliveryDays: { min: 7, max: 14 },
    active: true,
  },
  {
    id: "ship-au",
    country: "AU",
    countryName: { en: "Australia", tl: "Australya" },
    flag: "\u{1F1E6}\u{1F1FA}",
    baseRate: 25,
    perSqftRate: 3,
    freeAbove: 300,
    deliveryDays: { min: 5, max: 10 },
    active: true,
  },
];

const seedInstallationRates: InstallationRateConfig[] = [
  { id: "inst-ph-sedan", country: "PH", carType: "SEDAN", baseRate: 50, perWindowRate: 8, active: true },
  { id: "inst-ph-suv", country: "PH", carType: "SUV", baseRate: 65, perWindowRate: 10, active: true },
  { id: "inst-ph-van", country: "PH", carType: "VAN", baseRate: 70, perWindowRate: 10, active: true },
  { id: "inst-ph-station-wagon", country: "PH", carType: "STATION_WAGON", baseRate: 60, perWindowRate: 9, active: true },
  { id: "inst-ph-hatchback", country: "PH", carType: "HATCHBACK", baseRate: 45, perWindowRate: 8, active: true },
  { id: "inst-ph-coupe", country: "PH", carType: "COUPE", baseRate: 45, perWindowRate: 8, active: true },
  { id: "inst-ph-truck", country: "PH", carType: "TRUCK", baseRate: 60, perWindowRate: 9, active: true },
  { id: "inst-ph-convertible", country: "PH", carType: "CONVERTIBLE", baseRate: 55, perWindowRate: 9, active: true },
  { id: "inst-au-sedan", country: "AU", carType: "SEDAN", baseRate: 80, perWindowRate: 15, active: true },
  { id: "inst-au-suv", country: "AU", carType: "SUV", baseRate: 100, perWindowRate: 18, active: true },
  { id: "inst-au-van", country: "AU", carType: "VAN", baseRate: 110, perWindowRate: 18, active: true },
  { id: "inst-au-station-wagon", country: "AU", carType: "STATION_WAGON", baseRate: 90, perWindowRate: 16, active: true },
  { id: "inst-au-hatchback", country: "AU", carType: "HATCHBACK", baseRate: 75, perWindowRate: 14, active: true },
  { id: "inst-au-coupe", country: "AU", carType: "COUPE", baseRate: 75, perWindowRate: 14, active: true },
  { id: "inst-au-truck", country: "AU", carType: "TRUCK", baseRate: 90, perWindowRate: 16, active: true },
  { id: "inst-au-convertible", country: "AU", carType: "CONVERTIBLE", baseRate: 85, perWindowRate: 15, active: true },
];

const seedSiteSettings: SiteSettings = {
  siteName: "BabakAtlas Tint Configurator",
  description: "Premium automotive window tinting solutions for Philippines and Australia",
  contactEmail: "support@babakatlas.com",
  contactPhone: "+63 917 000 0000",
  taxRates: { PH: 0.12, AU: 0.10 },
  currencies: { PH: "PHP", AU: "AUD" },
};

// ---------------------------------------------------------------------------
// File-based persistence
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

interface StoreData {
  products: TintProduct[];
  carTypes: CarTypeConfig[];
  windowConfigs: WindowConfig[];
  serviceConfigs: ServiceConfig[];
  shippingRates: ShippingRateConfig[];
  installationRates: InstallationRateConfig[];
  siteSettings: SiteSettings;
}

function loadFromFile(): StoreData | null {
  try {
    if (existsSync(DATA_FILE)) {
      const raw = readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw) as StoreData;
    }
  } catch {
    console.warn("Failed to load data from file, using defaults");
  }
  return null;
}

function saveToFile(): void {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const data: StoreData = {
      products: Array.from(products.values()),
      carTypes: Array.from(carTypes.values()),
      windowConfigs: Array.from(windowConfigs.values()),
      serviceConfigs: Array.from(serviceConfigs.values()),
      shippingRates: Array.from(shippingRates.values()),
      installationRates: Array.from(installationRates.values()),
      siteSettings,
    };
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save data to file:", err);
  }
}

// ---------------------------------------------------------------------------
// In-Memory Maps (loaded from file or seed data)
// ---------------------------------------------------------------------------

const saved = loadFromFile();

const products = new Map<string, TintProduct>(
  (saved?.products || seedProducts).map((p) => [p.id, p])
);

const carTypes = new Map<string, CarTypeConfig>(
  (saved?.carTypes || seedCarTypes).map((c) => [c.id, c])
);

const windowConfigs = new Map<string, WindowConfig>(
  (saved?.windowConfigs || seedWindowConfigs).map((w) => [w.id, w])
);

const serviceConfigs = new Map<string, ServiceConfig>(
  (saved?.serviceConfigs || seedServiceConfigs).map((s) => [s.id, s])
);

const shippingRates = new Map<string, ShippingRateConfig>(
  (saved?.shippingRates || seedShippingRates).map((r) => [r.id, r])
);

const installationRates = new Map<string, InstallationRateConfig>(
  (saved?.installationRates || seedInstallationRates).map((r) => [r.id, r])
);

let siteSettings: SiteSettings = saved?.siteSettings || { ...seedSiteSettings };

// ---------------------------------------------------------------------------
// Product helpers
// ---------------------------------------------------------------------------

export function getProducts(): TintProduct[] {
  return Array.from(products.values());
}

export function getProduct(id: string): TintProduct | undefined {
  return products.get(id);
}

export function createProduct(data: Omit<TintProduct, "id" | "createdAt" | "updatedAt">): TintProduct {
  const id = `prod-${crypto.randomUUID()}`;
  const ts = new Date().toISOString();
  const product: TintProduct = { ...data, id, createdAt: ts, updatedAt: ts };
  products.set(id, product);
  saveToFile();
  return product;
}

export function updateProduct(id: string, data: Partial<TintProduct>): TintProduct | null {
  const existing = products.get(id);
  if (!existing) return null;
  const updated: TintProduct = { ...existing, ...data, id: existing.id, updatedAt: new Date().toISOString() };
  products.set(id, updated);
  saveToFile();
  return updated;
}

export function deleteProduct(id: string): boolean {
  const result = products.delete(id);
  if (result) saveToFile();
  return result;
}

// ---------------------------------------------------------------------------
// CarType helpers
// ---------------------------------------------------------------------------

export function getCarTypes(): CarTypeConfig[] {
  return Array.from(carTypes.values());
}

export function getCarType(id: string): CarTypeConfig | undefined {
  return carTypes.get(id);
}

export function createCarType(data: Omit<CarTypeConfig, "id">): CarTypeConfig {
  const id = `car-${crypto.randomUUID()}`;
  const carType: CarTypeConfig = { ...data, id };
  carTypes.set(id, carType);
  saveToFile();
  return carType;
}

export function updateCarType(id: string, data: Partial<CarTypeConfig>): CarTypeConfig | null {
  const existing = carTypes.get(id);
  if (!existing) return null;
  const updated: CarTypeConfig = { ...existing, ...data, id: existing.id };
  carTypes.set(id, updated);
  saveToFile();
  return updated;
}

export function deleteCarType(id: string): boolean {
  const result = carTypes.delete(id);
  if (result) saveToFile();
  return result;
}

// ---------------------------------------------------------------------------
// WindowConfig helpers
// ---------------------------------------------------------------------------

export function getWindowConfigs(carType?: string): WindowConfig[] {
  const all = Array.from(windowConfigs.values());
  if (carType) return all.filter((w) => w.carType === carType);
  return all;
}

export function getWindowConfig(id: string): WindowConfig | undefined {
  return windowConfigs.get(id);
}

export function updateWindowConfig(id: string, data: Partial<WindowConfig>): WindowConfig | null {
  const existing = windowConfigs.get(id);
  if (!existing) return null;
  const updated: WindowConfig = { ...existing, ...data, id: existing.id };
  windowConfigs.set(id, updated);
  saveToFile();
  return updated;
}

// ---------------------------------------------------------------------------
// ServiceConfig helpers
// ---------------------------------------------------------------------------

export function getServiceConfigs(): ServiceConfig[] {
  return Array.from(serviceConfigs.values());
}

export function getServiceConfig(id: string): ServiceConfig | undefined {
  return serviceConfigs.get(id);
}

export function updateServiceConfig(id: string, data: Partial<ServiceConfig>): ServiceConfig | null {
  const existing = serviceConfigs.get(id);
  if (!existing) return null;
  const updated: ServiceConfig = { ...existing, ...data, id: existing.id };
  serviceConfigs.set(id, updated);
  saveToFile();
  return updated;
}

// ---------------------------------------------------------------------------
// ShippingRate helpers
// ---------------------------------------------------------------------------

export function getShippingRates(): ShippingRateConfig[] {
  return Array.from(shippingRates.values());
}

export function getShippingRate(id: string): ShippingRateConfig | undefined {
  return shippingRates.get(id);
}

export function updateShippingRate(id: string, data: Partial<ShippingRateConfig>): ShippingRateConfig | null {
  const existing = shippingRates.get(id);
  if (!existing) return null;
  const updated: ShippingRateConfig = { ...existing, ...data, id: existing.id };
  shippingRates.set(id, updated);
  saveToFile();
  return updated;
}

// ---------------------------------------------------------------------------
// InstallationRate helpers
// ---------------------------------------------------------------------------

export function getInstallationRates(country?: string, carType?: string): InstallationRateConfig[] {
  let all = Array.from(installationRates.values());
  if (country) all = all.filter((r) => r.country === country);
  if (carType) all = all.filter((r) => r.carType === carType);
  return all;
}

export function getInstallationRate(id: string): InstallationRateConfig | undefined {
  return installationRates.get(id);
}

export function updateInstallationRate(id: string, data: Partial<InstallationRateConfig>): InstallationRateConfig | null {
  const existing = installationRates.get(id);
  if (!existing) return null;
  const updated: InstallationRateConfig = { ...existing, ...data, id: existing.id };
  installationRates.set(id, updated);
  saveToFile();
  return updated;
}

// ---------------------------------------------------------------------------
// SiteSettings helpers
// ---------------------------------------------------------------------------

export function getSiteSettings(): SiteSettings {
  return { ...siteSettings };
}

export function updateSiteSettings(data: Partial<SiteSettings>): SiteSettings {
  siteSettings = { ...siteSettings, ...data };
  saveToFile();
  return { ...siteSettings };
}
