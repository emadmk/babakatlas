// =============================================================================
// Centralized In-Memory Data Store - SINGLE SOURCE OF TRUTH
// =============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface TintShade {
  id: string;
  name: string;
  vlt: number;
  priceMultiplier: number;
}

export interface TintProduct {
  id: string;
  slug: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  tintType: string;
  category: string; // "nano-ceramic" | "adaptive"
  vlt: string;
  uvBlock: number;
  heatRejection: number;
  irrRejection: number; // IR rejection %
  pricePerSqft: number; // kept for backward compat
  rollWidth: number; // meters (1.52)
  rollLength: number; // meters (30)
  rollPrice: number; // price per roll in PHP
  pricePerMeter: number; // rollPrice / rollLength
  currency: string; // "PHP"
  imageUrl: string;
  badge: string | null;
  shades: TintShade[];
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
  // Glass area data from Excel (sq meters)
  glassArea?: {
    frontWindshield: number;
    rearWindshield: number;
    totalSideWindows: number;
    totalArea: number;
  };
  // Tint usage in meters of 1.52m roll
  rollUsage?: {
    windshield: number;
    rear: number;
    sides: number;
    total: number;
  };
  // Vehicle size group for package pricing
  sizeGroup: string; // "small" (coupe/sedan/pickup) | "medium" (mpv/suv) | "large" (van)
}

export interface TintPackage {
  id: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  coverage: string; // "windshield" | "half" | "semi-full" | "full-wrap" | "combo"
  metersUsed: Record<string, number>; // { "small": 1, "medium": 1.5, "large": 2 }
  applicableTintTypes: string[]; // ["nano-ceramic", "adaptive", "all"]
  order: number;
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
  shippingMarkup: number;
  shippingMarkupType: 'flat' | 'percentage';
  shippoFromAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
  serviceType: 'shipping' | 'installation';
  pricing: { subtotal: number; shipping: number; installation: number; taxLabel: string; tax: number; total: number };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'banned';
  joinedAt: string;
  lastActive: string;
  password?: string; // hashed in production, plain for demo
}

export interface FaqItem {
  id: string;
  question: { en: string; tl: string };
  answer: { en: string; tl: string };
  order: number;
  active: boolean;
}

export interface AboutContent {
  story: { en: string; tl: string };
  mission: { en: string; tl: string };
  values: Array<{ icon: string; title: { en: string; tl: string }; description: { en: string; tl: string } }>;
  stats: Array<{ value: string; label: { en: string; tl: string }; icon: string }>;
  team: Array<{ name: string; role: { en: string; tl: string }; bio: { en: string; tl: string }; imageUrl: string }>;
}

export interface ContactInfo {
  email: string;
  phone: string;
  businessHours: Array<{ day: { en: string; tl: string }; hours: string }>;
  regions: Array<{ country: string; flag: string; name: { en: string; tl: string }; detail: { en: string; tl: string } }>;
  subjects: Array<{ en: string; tl: string }>;
}

export interface HomepageContent {
  hero: {
    title: { en: string; tl: string };
    subtitle: { en: string; tl: string };
    cta: { en: string; tl: string };
    backgroundImage: string;
  };
  benefits: Array<{
    id: string;
    icon: string;
    title: { en: string; tl: string };
    description: { en: string; tl: string };
    stat: string;
  }>;
  howItWorks: Array<{
    step: number;
    title: { en: string; tl: string };
    description: { en: string; tl: string };
    icon: string;
  }>;
  stats: Array<{
    value: string;
    label: { en: string; tl: string };
    suffix: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    car: string;
    quote: { en: string; tl: string };
    rating: number;
    avatar: string;
  }>;
  cta: {
    title: { en: string; tl: string };
    subtitle: { en: string; tl: string };
    button: { en: string; tl: string };
    badges: Array<{ en: string; tl: string }>;
  };
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

const now = new Date().toISOString();

const defaultShades: TintShade[] = [
  { id: "default", name: "Default", vlt: 0, priceMultiplier: 1.0 },
];

const seedProducts: TintProduct[] = [
  {
    id: "prod-adaptive-light",
    slug: "adaptive-light",
    name: { en: "Adaptive Light", tl: "Adaptive Light" },
    description: {
      en: "Smart photochromic film that auto-adjusts from 70% to 35% VLT. Premium heat and UV rejection.",
      tl: "Matalinong photochromic film na awtomatikong nag-aayos mula 70% hanggang 35% VLT. Premium na pagtanggi sa init at UV.",
    },
    tintType: "adaptive-light",
    category: "adaptive",
    vlt: "70-35%",
    uvBlock: 99,
    heatRejection: 65,
    irrRejection: 95,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 200000,
    pricePerMeter: 6666.67,
    currency: "PHP",
    imageUrl: "/images/tints/adaptive-light.jpg",
    badge: "Premium",
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-adaptive-dark",
    slug: "adaptive-dark",
    name: { en: "Adaptive Dark", tl: "Adaptive Dark" },
    description: {
      en: "Smart photochromic film that auto-adjusts from 17% to 35% VLT. Maximum privacy with premium performance.",
      tl: "Matalinong photochromic film na awtomatikong nag-aayos mula 17% hanggang 35% VLT. Pinakamataas na privacy na may premium na performance.",
    },
    tintType: "adaptive-dark",
    category: "adaptive",
    vlt: "17-35%",
    uvBlock: 99,
    heatRejection: 65,
    irrRejection: 95,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 200000,
    pricePerMeter: 6666.67,
    currency: "PHP",
    imageUrl: "/images/tints/adaptive-dark.jpg",
    badge: "Premium",
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-3",
    slug: "nano-ceramic-3",
    name: { en: "Nano Ceramic 3%", tl: "Nano Ceramic 3%" },
    description: {
      en: "Ultra-dark nano ceramic film with 3% VLT. Maximum privacy and 99% infrared heat rejection.",
      tl: "Ultra-dark nano ceramic film na may 3% VLT. Pinakamataas na privacy at 99% infrared heat rejection.",
    },
    tintType: "nano-ceramic-3",
    category: "nano-ceramic",
    vlt: "3%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: null,
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-5",
    slug: "nano-ceramic-5",
    name: { en: "Nano Ceramic 5%", tl: "Nano Ceramic 5%" },
    description: {
      en: "Very dark nano ceramic film with 5% VLT. Excellent privacy and 99% infrared heat rejection.",
      tl: "Napakadilim na nano ceramic film na may 5% VLT. Mahusay na privacy at 99% infrared heat rejection.",
    },
    tintType: "nano-ceramic-5",
    category: "nano-ceramic",
    vlt: "5%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: null,
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-21",
    slug: "nano-ceramic-21",
    name: { en: "Nano Ceramic 21%", tl: "Nano Ceramic 21%" },
    description: {
      en: "Dark nano ceramic film with 21% VLT. Great balance of privacy and visibility with 99% IR rejection.",
      tl: "Madilim na nano ceramic film na may 21% VLT. Magandang balanse ng privacy at visibility na may 99% IR rejection.",
    },
    tintType: "nano-ceramic-21",
    category: "nano-ceramic",
    vlt: "21%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: "Most Popular",
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-35",
    slug: "nano-ceramic-35",
    name: { en: "Nano Ceramic 35%", tl: "Nano Ceramic 35%" },
    description: {
      en: "Medium nano ceramic film with 35% VLT. Balanced privacy and visibility with 99% IR rejection.",
      tl: "Medium nano ceramic film na may 35% VLT. Balanseng privacy at visibility na may 99% IR rejection.",
    },
    tintType: "nano-ceramic-35",
    category: "nano-ceramic",
    vlt: "35%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: null,
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-45",
    slug: "nano-ceramic-45",
    name: { en: "Nano Ceramic 45%", tl: "Nano Ceramic 45%" },
    description: {
      en: "Light-medium nano ceramic film with 45% VLT. Good visibility with solid heat rejection.",
      tl: "Light-medium nano ceramic film na may 45% VLT. Magandang visibility na may matibay na heat rejection.",
    },
    tintType: "nano-ceramic-45",
    category: "nano-ceramic",
    vlt: "45%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: null,
    shades: [...defaultShades],
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-nano-ceramic-70",
    slug: "nano-ceramic-70",
    name: { en: "Nano Ceramic 70%", tl: "Nano Ceramic 70%" },
    description: {
      en: "Nearly clear nano ceramic film with 70% VLT. Maximum visibility with full heat and UV rejection.",
      tl: "Halos malinaw na nano ceramic film na may 70% VLT. Pinakamataas na visibility na may buong heat at UV rejection.",
    },
    tintType: "nano-ceramic-70",
    category: "nano-ceramic",
    vlt: "70%",
    uvBlock: 99,
    heatRejection: 60,
    irrRejection: 99,
    pricePerSqft: 0,
    rollWidth: 1.52,
    rollLength: 30,
    rollPrice: 50000,
    pricePerMeter: 1666.67,
    currency: "PHP",
    imageUrl: "/images/tints/nano-ceramic.jpg",
    badge: null,
    shades: [...defaultShades],
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
    glassArea: { frontWindshield: 1.4, rearWindshield: 1.0, totalSideWindows: 1.3, totalArea: 3.7 },
    rollUsage: { windshield: 0.93, rear: 0.67, sides: 0.87, total: 2.47 },
    sizeGroup: "small",
  },
  {
    id: "car-mpv",
    slug: "mpv",
    name: { en: "MPV", tl: "MPV" },
    type: "MPV",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop",
    active: true,
    glassArea: { frontWindshield: 1.7, rearWindshield: 1.3, totalSideWindows: 1.8, totalArea: 4.8 },
    rollUsage: { windshield: 1.13, rear: 0.87, sides: 1.20, total: 3.20 },
    sizeGroup: "medium",
  },
  {
    id: "car-suv",
    slug: "suv",
    name: { en: "SUV", tl: "SUV" },
    type: "SUV",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
    active: true,
    glassArea: { frontWindshield: 1.6, rearWindshield: 1.2, totalSideWindows: 1.5, totalArea: 4.3 },
    rollUsage: { windshield: 1.07, rear: 0.80, sides: 1.00, total: 2.87 },
    sizeGroup: "medium",
  },
  {
    id: "car-coupe",
    slug: "coupe",
    name: { en: "Coupe", tl: "Coupe" },
    type: "COUPE",
    windowCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
    active: true,
    glassArea: { frontWindshield: 1.2, rearWindshield: 0.9, totalSideWindows: 1.0, totalArea: 3.1 },
    rollUsage: { windshield: 0.80, rear: 0.60, sides: 0.67, total: 2.07 },
    sizeGroup: "small",
  },
  {
    id: "car-pickup",
    slug: "pickup",
    name: { en: "Pickup Truck", tl: "Pickup Truck" },
    type: "PICKUP",
    windowCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop",
    active: true,
    glassArea: { frontWindshield: 1.5, rearWindshield: 1.0, totalSideWindows: 1.4, totalArea: 3.9 },
    rollUsage: { windshield: 1.00, rear: 0.67, sides: 0.93, total: 2.60 },
    sizeGroup: "small",
  },
  {
    id: "car-van",
    slug: "van",
    name: { en: "Van", tl: "Van" },
    type: "VAN",
    windowCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop",
    active: true,
    glassArea: { frontWindshield: 2.0, rearWindshield: 1.5, totalSideWindows: 2.0, totalArea: 5.5 },
    rollUsage: { windshield: 1.33, rear: 1.00, sides: 1.33, total: 4.00 },
    sizeGroup: "large",
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
    { position: "FRONT_WINDSHIELD", sqft: 15 },
    { position: "REAR_WINDSHIELD", sqft: 11 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
  ],
  MPV: [
    { position: "FRONT_WINDSHIELD", sqft: 18 },
    { position: "REAR_WINDSHIELD", sqft: 14 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 5 },
    { position: "REAR_RIGHT", sqft: 5 },
    { position: "REAR_QUARTER_LEFT", sqft: 3 },
    { position: "REAR_QUARTER_RIGHT", sqft: 3 },
  ],
  SUV: [
    { position: "FRONT_WINDSHIELD", sqft: 17 },
    { position: "REAR_WINDSHIELD", sqft: 13 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 4 },
    { position: "REAR_RIGHT", sqft: 4 },
    { position: "REAR_QUARTER_LEFT", sqft: 3 },
    { position: "REAR_QUARTER_RIGHT", sqft: 3 },
  ],
  COUPE: [
    { position: "FRONT_WINDSHIELD", sqft: 13 },
    { position: "REAR_WINDSHIELD", sqft: 10 },
    { position: "FRONT_LEFT", sqft: 4 },
    { position: "FRONT_RIGHT", sqft: 4 },
  ],
  PICKUP: [
    { position: "FRONT_WINDSHIELD", sqft: 16 },
    { position: "REAR_WINDSHIELD", sqft: 11 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 3 },
    { position: "REAR_RIGHT", sqft: 3 },
  ],
  VAN: [
    { position: "FRONT_WINDSHIELD", sqft: 22 },
    { position: "REAR_WINDSHIELD", sqft: 16 },
    { position: "FRONT_LEFT", sqft: 5 },
    { position: "FRONT_RIGHT", sqft: 5 },
    { position: "REAR_LEFT", sqft: 5 },
    { position: "REAR_RIGHT", sqft: 5 },
    { position: "REAR_QUARTER_LEFT", sqft: 4 },
    { position: "REAR_QUARTER_RIGHT", sqft: 4 },
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

const seedTintPackages: TintPackage[] = [
  {
    id: "pkg-windshield",
    name: { en: "Windshield Only", tl: "Windshield Lamang" },
    description: {
      en: "Front windshield tint only. Great for reducing glare and heat.",
      tl: "Harapang windshield tint lamang. Mahusay para sa pagbawas ng glare at init.",
    },
    coverage: "windshield",
    metersUsed: { small: 1, medium: 1.5, large: 2 },
    applicableTintTypes: ["nano-ceramic", "adaptive"],
    order: 1,
    active: true,
  },
  {
    id: "pkg-half",
    name: { en: "Windshield & Front Windows (Half Unit)", tl: "Windshield at Harapang Bintana (Kalahating Unit)" },
    description: {
      en: "Front windshield plus front side windows. Covers the driver area.",
      tl: "Harapang windshield at harapang side windows. Saklaw ang driver area.",
    },
    coverage: "half",
    metersUsed: { small: 2.5, medium: 3, large: 3.5 },
    applicableTintTypes: ["nano-ceramic", "adaptive"],
    order: 2,
    active: true,
  },
  {
    id: "pkg-semi-full",
    name: { en: "All Windows & Rear (Semi Full)", tl: "Lahat ng Bintana at Likuran (Semi Full)" },
    description: {
      en: "All side windows plus rear windshield. Everything except front windshield.",
      tl: "Lahat ng side windows at likurang windshield. Lahat maliban sa harapang windshield.",
    },
    coverage: "semi-full",
    metersUsed: { small: 2.5, medium: 3, large: 4.5 },
    applicableTintTypes: ["nano-ceramic", "adaptive"],
    order: 3,
    active: true,
  },
  {
    id: "pkg-full-wrap",
    name: { en: "Full Wrap", tl: "Full Wrap" },
    description: {
      en: "Complete vehicle coverage including front windshield, all windows, and rear windshield.",
      tl: "Kumpletong saklaw ng sasakyan kasama ang harapang windshield, lahat ng bintana, at likurang windshield.",
    },
    coverage: "full-wrap",
    metersUsed: { small: 3.5, medium: 4.5, large: 6 },
    applicableTintTypes: ["nano-ceramic", "adaptive"],
    order: 4,
    active: true,
  },
  {
    id: "pkg-combo",
    name: { en: "Combo (Adaptive + Ceramic)", tl: "Combo (Adaptive + Ceramic)" },
    description: {
      en: "Adaptive film on windshield, Nano Ceramic on all other windows. Best of both worlds.",
      tl: "Adaptive film sa windshield, Nano Ceramic sa lahat ng ibang bintana. Pinakamahusay na kombinasyon.",
    },
    coverage: "combo",
    metersUsed: { small: 3.5, medium: 4.5, large: 6 },
    applicableTintTypes: ["adaptive"],
    order: 5,
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
  { id: "inst-ph-sedan", country: "PH", carType: "SEDAN", baseRate: 2000, perWindowRate: 500, active: true },
  { id: "inst-ph-mpv", country: "PH", carType: "MPV", baseRate: 2500, perWindowRate: 500, active: true },
  { id: "inst-ph-suv", country: "PH", carType: "SUV", baseRate: 2500, perWindowRate: 500, active: true },
  { id: "inst-ph-coupe", country: "PH", carType: "COUPE", baseRate: 1800, perWindowRate: 500, active: true },
  { id: "inst-ph-pickup", country: "PH", carType: "PICKUP", baseRate: 2200, perWindowRate: 500, active: true },
  { id: "inst-ph-van", country: "PH", carType: "VAN", baseRate: 3000, perWindowRate: 500, active: true },
  { id: "inst-au-sedan", country: "AU", carType: "SEDAN", baseRate: 80, perWindowRate: 15, active: true },
  { id: "inst-au-mpv", country: "AU", carType: "MPV", baseRate: 100, perWindowRate: 18, active: true },
  { id: "inst-au-suv", country: "AU", carType: "SUV", baseRate: 100, perWindowRate: 18, active: true },
  { id: "inst-au-coupe", country: "AU", carType: "COUPE", baseRate: 75, perWindowRate: 14, active: true },
  { id: "inst-au-pickup", country: "AU", carType: "PICKUP", baseRate: 90, perWindowRate: 16, active: true },
  { id: "inst-au-van", country: "AU", carType: "VAN", baseRate: 110, perWindowRate: 18, active: true },
];

const seedSiteSettings: SiteSettings = {
  siteName: "BabakAtlas Tint Configurator",
  description: "Premium automotive window tinting solutions for Philippines and Australia",
  contactEmail: "support@babakatlas.com",
  contactPhone: "+63 917 000 0000",
  taxRates: { PH: 0.12, AU: 0.10 },
  currencies: { PH: "PHP", AU: "AUD" },
  shippingMarkup: 0,
  shippingMarkupType: 'flat',
  shippoFromAddress: {
    name: 'AtlasAdaptive',
    street1: '123 Main Street',
    city: 'Manila',
    state: 'Metro Manila',
    zip: '1000',
    country: 'PH',
  },
};

const seedFaqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: {
      en: "What is window tinting?",
      tl: "Ano ang window tinting?",
    },
    answer: {
      en: "Window tinting is the process of applying a thin film to the interior or exterior of glass surfaces in vehicles or buildings. The film is made from polyester and can contain layers of metals, dyes, ceramics, or carbon to reduce the amount of visible light, UV rays, and infrared heat that passes through the glass. It enhances privacy, reduces glare, protects your interior from sun damage, and keeps your vehicle cooler.",
      tl: "Ang window tinting ay ang proseso ng paglalagay ng manipis na pelikula sa loob o labas ng mga salaming ibabaw ng mga sasakyan o gusali. Ang pelikula ay gawa sa polyester at maaaring maglaman ng mga layer ng metal, tina, ceramic, o carbon upang mabawasan ang dami ng nakikitang liwanag, UV rays, at infrared heat na dumadaan sa salamin.",
    },
    order: 1,
    active: true,
  },
  {
    id: "faq-2",
    question: {
      en: "Is window tinting legal in the Philippines and Australia?",
      tl: "Legal ba ang window tinting sa Pilipinas at Australia?",
    },
    answer: {
      en: "Yes, window tinting is legal in both countries, but there are specific regulations. In the Philippines, the Land Transportation Office (LTO) allows tinting with a minimum of 20% VLT (Visible Light Transmission) for side and rear windows. Windshields must allow at least 70% VLT. In Australia, laws vary by state. Generally, front side windows must allow at least 35% VLT, while rear windows can be darker. Always check your local regulations before installation to ensure compliance.",
      tl: "Oo, legal ang window tinting sa parehong bansa, ngunit may mga partikular na regulasyon. Sa Pilipinas, pinapayagan ng Land Transportation Office (LTO) ang tinting na may minimum na 20% VLT para sa mga side at rear window. Ang mga windshield ay dapat payagan ang hindi bababa sa 70% VLT. Sa Australia, iba-iba ang batas sa bawat estado.",
    },
    order: 2,
    active: true,
  },
  {
    id: "faq-3",
    question: {
      en: "How long does window tint last?",
      tl: "Gaano katagal ang window tint?",
    },
    answer: {
      en: "High-quality window tint films, like the ceramic and carbon options we offer at AtlasAdaptive, typically last 5 to 10 years with proper care. The lifespan depends on the type of film, quality of installation, and how well you maintain it. Ceramic tints tend to last the longest due to their superior material composition. To maximize longevity, avoid rolling down freshly tinted windows for at least 3 days and clean with non-ammonia-based products.",
      tl: "Ang mataas na kalidad na window tint films, tulad ng ceramic at carbon na mga opsyon na inaalok namin sa AtlasAdaptive, karaniwang tumatagal ng 5 hanggang 10 taon na may wastong pag-aalaga. Ang buhay ng pelikula ay depende sa uri ng film, kalidad ng pag-install, at kung paano mo ito pinapanatili.",
    },
    order: 3,
    active: true,
  },
  {
    id: "faq-4",
    question: {
      en: "Can I install the tint myself?",
      tl: "Maaari ko bang i-install ang tint sa sarili ko?",
    },
    answer: {
      en: "While DIY installation is possible with our films and we provide detailed instructions, we highly recommend professional installation for the best results. Professional installers have the tools, controlled environment, and experience to ensure a bubble-free, perfectly aligned application. Improper installation can lead to bubbling, peeling, and uneven coverage. If you are in the Philippines or Australia, we can connect you with certified installation partners in your area.",
      tl: "Bagama't posible ang DIY installation gamit ang aming mga film at nagbibigay kami ng detalyadong mga tagubilin, lubos naming inirerekomenda ang professional installation para sa pinakamahusay na resulta. Ang mga professional installer ay may mga kasangkapan, kontroladong kapaligiran, at karanasan upang matiyak ang walang bula at perpektong pagkakalagay.",
    },
    order: 4,
    active: true,
  },
  {
    id: "faq-5",
    question: {
      en: "What's the difference between ceramic and carbon tint?",
      tl: "Ano ang pagkakaiba ng ceramic at carbon tint?",
    },
    answer: {
      en: "Ceramic tint uses nano-ceramic particles that are non-conductive and non-metallic, offering superior heat rejection (up to 80%), excellent UV protection (99.9%), and no signal interference. Carbon tint uses carbon fiber particles that provide good heat rejection (up to 60%), UV protection, and a distinctive matte finish. Ceramic is the premium option with better performance, while carbon offers excellent value at a lower price point. Both are far superior to traditional dyed films.",
      tl: "Ang ceramic tint ay gumagamit ng nano-ceramic na mga particle na hindi konduktor at hindi metaliko, na nag-aalok ng mahusay na pagtanggi sa init (hanggang 80%), mahusay na proteksyon sa UV (99.9%), at walang signal interference. Ang carbon tint ay gumagamit ng mga carbon fiber particle na nagbibigay ng magandang pagtanggi sa init (hanggang 60%), proteksyon sa UV, at natatanging matte finish.",
    },
    order: 5,
    active: true,
  },
  {
    id: "faq-6",
    question: {
      en: "How long does installation take?",
      tl: "Gaano katagal ang pag-install?",
    },
    answer: {
      en: "Professional installation typically takes 2 to 4 hours depending on the vehicle type and how many windows are being tinted. A standard sedan with all side windows and rear window takes about 2-3 hours. SUVs and larger vehicles may take 3-4 hours. Full vehicle wraps including the windshield can take up to 5 hours. We recommend scheduling an appointment and allowing enough time for the process.",
      tl: "Ang professional installation ay karaniwang tumatagal ng 2 hanggang 4 na oras depende sa uri ng sasakyan at kung ilang bintana ang tinitint. Ang isang standard na sedan na may lahat ng side windows at rear window ay tumatagal ng mga 2-3 oras. Ang mga SUV at mas malalaking sasakyan ay maaaring tumagal ng 3-4 na oras.",
    },
    order: 6,
    active: true,
  },
  {
    id: "faq-7",
    question: {
      en: "Will window tint affect my visibility at night?",
      tl: "Makakaapekto ba ang window tint sa aking visibility sa gabi?",
    },
    answer: {
      en: "It depends on the VLT (Visible Light Transmission) percentage you choose. Higher VLT percentages like 50-70% will have minimal impact on night visibility, while darker tints (5-20%) will reduce visibility more noticeably. We recommend lighter tints for front side windows to maintain safe driving visibility at night, and you can go darker on rear windows. Our configurator tool helps you preview different VLT levels so you can make an informed choice.",
      tl: "Depende ito sa porsyento ng VLT (Visible Light Transmission) na pipiliin mo. Ang mas mataas na porsyento ng VLT tulad ng 50-70% ay magkakaroon ng minimal na epekto sa visibility sa gabi, habang ang mas madilim na tint (5-20%) ay mas kapansin-pansing magbabawas ng visibility.",
    },
    order: 7,
    active: true,
  },
  {
    id: "faq-8",
    question: {
      en: "Do you ship internationally?",
      tl: "Nagpapadala ba kayo sa ibang bansa?",
    },
    answer: {
      en: "Currently, we ship to the Philippines and Australia. These are our primary markets, and we have optimized our logistics for fast, reliable delivery to both countries. We are working on expanding to other Southeast Asian and Oceanian markets in the near future. Sign up for our newsletter to be the first to know when we launch in new regions.",
      tl: "Sa kasalukuyan, nagpapadala kami sa Pilipinas at Australia. Ito ang aming mga pangunahing merkado, at in-optimize namin ang aming logistics para sa mabilis at maaasahang paghahatid sa parehong bansa. Nagtatrabaho kami sa pagpapalawak sa iba pang mga merkado sa Southeast Asia at Oceania sa malapit na hinaharap.",
    },
    order: 8,
    active: true,
  },
  {
    id: "faq-9",
    question: {
      en: "What is your return policy?",
      tl: "Ano ang inyong patakaran sa pagbabalik?",
    },
    answer: {
      en: "We offer a 30-day satisfaction guarantee on all our products. If you are not completely satisfied with your purchase, you can return unused and unopened films within 30 days of delivery for a full refund. For defective products, we offer free replacements. If the film has been installed and you experience issues due to manufacturing defects, please contact our support team with photos and we will arrange a replacement.",
      tl: "Nag-aalok kami ng 30-araw na satisfaction guarantee sa lahat ng aming mga produkto. Kung hindi ka ganap na nasiyahan sa iyong binili, maaari mong ibalik ang hindi nagamit at hindi nabuksan na mga film sa loob ng 30 araw pagkatapos ng paghahatid para sa buong refund.",
    },
    order: 9,
    active: true,
  },
  {
    id: "faq-10",
    question: {
      en: "How do I track my order?",
      tl: "Paano ko masusubaybayan ang aking order?",
    },
    answer: {
      en: "Once your order is shipped, you will receive a tracking number via email. You can also track your order directly through your AtlasAdaptive dashboard. Simply log in and navigate to the Orders section to see real-time tracking information, estimated delivery dates, and order history.",
      tl: "Kapag naipadala na ang iyong order, makakatanggap ka ng tracking number sa pamamagitan ng email. Maaari mo ring subaybayan ang iyong order nang direkta sa iyong AtlasAdaptive dashboard. Mag-log in lang at pumunta sa Orders section upang makita ang real-time tracking information.",
    },
    order: 10,
    active: true,
  },
];

const seedAboutContent: AboutContent = {
  story: {
    en: "AtlasAdaptive was founded with a simple belief: everyone deserves access to professional-grade window tinting, regardless of where they are. Starting from a small workshop in Metro Manila, we spent years perfecting our craft and sourcing the finest materials from around the world.\n\nToday, we serve thousands of customers across the Philippines and Australia, offering cutting-edge ceramic, carbon, and adaptive tint films through our innovative online platform. Our proprietary configurator lets you visualize exactly how your vehicle will look before you buy, taking the guesswork out of window tinting.\n\nWe are not just a tint company. We are a technology-driven brand committed to transforming the way people protect and personalize their vehicles. From our nano-ceramic formulations to our seamless e-commerce experience, every detail is engineered for perfection.",
    tl: "Ang AtlasAdaptive ay itinatag na may simpleng paniniwala: lahat ay nararapat na magkaroon ng access sa professional-grade na window tinting, kahit saan sila naroroon. Simula sa isang maliit na workshop sa Metro Manila, gumugol kami ng mga taon sa pagpeperpekto ng aming gawa at paghahanap ng mga pinakamagandang materyales mula sa buong mundo.\n\nSa kasalukuyan, naglilingkod kami sa libu-libong customer sa Pilipinas at Australia, na nag-aalok ng cutting-edge na ceramic, carbon, at adaptive tint films sa pamamagitan ng aming makabagong online platform.\n\nHindi lang kami isang tint company. Kami ay isang technology-driven na brand na nakatuon sa pagbabago ng paraan ng pagprotekta at pag-personalize ng mga tao sa kanilang mga sasakyan.",
  },
  mission: {
    en: "Making premium window tinting accessible across Southeast Asia and Oceania",
    tl: "Ginagawang accessible ang premium window tinting sa buong Southeast Asia at Oceania",
  },
  values: [
    {
      icon: "Award",
      title: { en: "Quality", tl: "Kalidad" },
      description: {
        en: "We source and develop only the highest grade materials, ensuring every film meets rigorous performance standards.",
        tl: "Naghahanap at nagde-develop lang kami ng pinakamataas na kalidad na materyales, tinitiyak na ang bawat film ay nakakatugon sa mahigpit na pamantayan ng pagganap.",
      },
    },
    {
      icon: "Lightbulb",
      title: { en: "Innovation", tl: "Inobasyon" },
      description: {
        en: "From adaptive nano-ceramic technology to our online configurator, we push boundaries in the window tinting industry.",
        tl: "Mula sa adaptive nano-ceramic na teknolohiya hanggang sa aming online configurator, tinutulak namin ang mga hangganan sa industriya ng window tinting.",
      },
    },
    {
      icon: "Heart",
      title: { en: "Customer Service", tl: "Serbisyo sa Customer" },
      description: {
        en: "Every customer interaction matters. We provide expert guidance from selection through installation and beyond.",
        tl: "Mahalaga ang bawat pakikipag-ugnayan sa customer. Nagbibigay kami ng ekspertong gabay mula sa pagpili hanggang sa pag-install at higit pa.",
      },
    },
    {
      icon: "Leaf",
      title: { en: "Sustainability", tl: "Sustainability" },
      description: {
        en: "Our films reduce vehicle energy consumption and we are committed to eco-friendly manufacturing and packaging.",
        tl: "Binabawasan ng aming mga film ang paggamit ng enerhiya ng sasakyan at kami ay nakatuon sa eco-friendly na pagmamanupaktura at packaging.",
      },
    },
  ],
  stats: [
    { value: "8+", label: { en: "Years in Business", tl: "Taon sa Negosyo" }, icon: "Clock" },
    { value: "50K+", label: { en: "Cars Tinted", tl: "Mga Kotse na Na-tint" }, icon: "Car" },
    { value: "99%", label: { en: "Customer Satisfaction", tl: "Kasiyahan ng Customer" }, icon: "Star" },
    { value: "2", label: { en: "Countries Served", tl: "Mga Bansang Pinaglilingkuran" }, icon: "Users" },
  ],
  team: [
    {
      name: "Marco Reyes",
      role: { en: "Founder & CEO", tl: "Tagapagtatag at CEO" },
      bio: {
        en: "Automotive enthusiast with 15 years in the tinting industry.",
        tl: "Automotive enthusiast na may 15 taon sa industriya ng tinting.",
      },
      imageUrl: "",
    },
    {
      name: "Sarah Chen",
      role: { en: "Head of Product", tl: "Pinuno ng Produkto" },
      bio: {
        en: "Materials engineer driving our next-gen film technology.",
        tl: "Materials engineer na nagpapagalaw ng aming next-gen film technology.",
      },
      imageUrl: "",
    },
    {
      name: "James Villanueva",
      role: { en: "Operations Director", tl: "Direktor ng Operasyon" },
      bio: {
        en: "Logistics expert ensuring fast delivery across the region.",
        tl: "Logistics expert na tinitiyak ang mabilis na paghahatid sa buong rehiyon.",
      },
      imageUrl: "",
    },
    {
      name: "Ava Thompson",
      role: { en: "Customer Experience", tl: "Karanasan ng Customer" },
      bio: {
        en: "Dedicated to making every customer journey exceptional.",
        tl: "Nakatuon sa paggawa ng bawat customer journey na pambihira.",
      },
      imageUrl: "",
    },
  ],
};

const seedContactInfo: ContactInfo = {
  email: "hello@atlasadaptive.com",
  phone: "+63 2 8123 4567",
  businessHours: [
    { day: { en: "Mon - Fri", tl: "Lun - Biy" }, hours: "9:00 AM - 6:00 PM" },
    { day: { en: "Saturday", tl: "Sabado" }, hours: "10:00 AM - 4:00 PM" },
    { day: { en: "Sunday", tl: "Linggo" }, hours: "Closed" },
  ],
  regions: [
    {
      country: "PH",
      flag: "\u{1F1F5}\u{1F1ED}",
      name: { en: "Philippines", tl: "Pilipinas" },
      detail: { en: "Metro Manila & nationwide", tl: "Metro Manila at buong bansa" },
    },
    {
      country: "AU",
      flag: "\u{1F1E6}\u{1F1FA}",
      name: { en: "Australia", tl: "Australya" },
      detail: { en: "All states & territories", tl: "Lahat ng estado at teritoryo" },
    },
  ],
  subjects: [
    { en: "General Inquiry", tl: "Pangkalahatang Pagtatanong" },
    { en: "Product Question", tl: "Tanong sa Produkto" },
    { en: "Order Support", tl: "Suporta sa Order" },
    { en: "Installation Help", tl: "Tulong sa Pag-install" },
    { en: "Shipping Question", tl: "Tanong sa Pagpapadala" },
    { en: "Returns & Refunds", tl: "Pagbabalik at Refund" },
    { en: "Partnership Opportunity", tl: "Oportunidad sa Partnership" },
    { en: "Other", tl: "Iba pa" },
  ],
};

const seedHomepageContent: HomepageContent = {
  hero: {
    title: { en: "Premium Window Tint Films", tl: "Premium na Window Tint Films" },
    subtitle: {
      en: "Professional-grade ceramic and carbon tint films for ultimate UV protection, heat reduction, and style. Engineered for perfection.",
      tl: "Professional-grade na ceramic at carbon tint films para sa ultimate na UV protection, heat reduction, at istilo. Engineered para sa perpeksyon.",
    },
    cta: { en: "Configure Your Tint", tl: "I-configure ang Iyong Tint" },
    backgroundImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&h=1080&fit=crop",
  },
  benefits: [
    {
      id: "benefit-uv",
      icon: "Shield",
      title: { en: "UV Protection", tl: "Proteksyon sa UV" },
      description: {
        en: "Block up to 99% of harmful ultraviolet rays, protecting your skin and your vehicle's interior from sun damage.",
        tl: "Harangin ang hanggang 99% ng mapaminsalang ultraviolet na sinag, na pinoprotektahan ang iyong balat at interior ng sasakyan mula sa pinsala ng araw.",
      },
      stat: "99%",
    },
    {
      id: "benefit-heat",
      icon: "Thermometer",
      title: { en: "Heat Reduction", tl: "Pagbawas ng Init" },
      description: {
        en: "Significantly reduce cabin temperature by rejecting solar heat, keeping your car cool even in tropical climates.",
        tl: "Malaki ang mababawas sa temperatura ng loob ng sasakyan sa pamamagitan ng pagtanggi sa init ng araw, na pinapanatiling malamig ang iyong kotse kahit sa tropikal na klima.",
      },
      stat: "60%",
    },
    {
      id: "benefit-privacy",
      icon: "Eye",
      title: { en: "Privacy", tl: "Privacy" },
      description: {
        en: "Enhance your personal privacy and security by limiting visibility into your vehicle from the outside.",
        tl: "Palakasin ang iyong personal na privacy at seguridad sa pamamagitan ng paglimita sa kakayahang makita ang loob ng iyong sasakyan mula sa labas.",
      },
      stat: "",
    },
    {
      id: "benefit-glare",
      icon: "Zap",
      title: { en: "Glare Reduction", tl: "Pagbawas ng Glare" },
      description: {
        en: "Reduce blinding glare from the sun and oncoming headlights for safer, more comfortable driving.",
        tl: "Bawasan ang nakakabulag na sikat ng araw at ilaw ng mga kasalubong na sasakyan para sa mas ligtas at mas komportableng pagmamaneho.",
      },
      stat: "",
    },
    {
      id: "benefit-interior",
      icon: "Palette",
      title: { en: "Interior Protection", tl: "Proteksyon ng Interior" },
      description: {
        en: "Prevent cracking, fading, and discoloration of your dashboard, seats, and upholstery caused by prolonged sun exposure.",
        tl: "Pigilan ang pag-crack, pagkupas, at pagbabago ng kulay ng iyong dashboard, upuan, at upholstery na dulot ng matagal na pagkakalantad sa araw.",
      },
      stat: "",
    },
    {
      id: "benefit-energy",
      icon: "Sun",
      title: { en: "Energy Saving", tl: "Pagtitipid ng Enerhiya" },
      description: {
        en: "Lower your air conditioning usage and save fuel by keeping your car naturally cooler with heat-rejecting tint films.",
        tl: "Bawasan ang paggamit ng air conditioning at makatipid ng gasolina sa pamamagitan ng natural na pagpapalamig sa iyong kotse gamit ang heat-rejecting na tint film.",
      },
      stat: "",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: { en: "Choose Your Car", tl: "Piliin ang Iyong Kotse" },
      description: {
        en: "Select your car make, model, and year from our extensive database.",
        tl: "Piliin ang make, model, at taon ng iyong kotse.",
      },
      icon: "Car",
    },
    {
      step: 2,
      title: { en: "Select Windows", tl: "Piliin ang mga Bintana" },
      description: {
        en: "Pick exactly which windows you want tinted with our interactive configurator.",
        tl: "Piliin kung aling mga bintana ang gusto mong i-tint.",
      },
      icon: "MousePointer2",
    },
    {
      step: 3,
      title: { en: "Pick Your Tint", tl: "Pumili ng Tint" },
      description: {
        en: "Choose from our range of premium ceramic, carbon, and specialty films.",
        tl: "Pumili mula sa aming range ng premium films.",
      },
      icon: "Layers",
    },
    {
      step: 4,
      title: { en: "Order & Install", tl: "Mag-order at Mag-install" },
      description: {
        en: "Place your order and get pre-cut films delivered or professionally installed.",
        tl: "Mag-order at makakuha ng pre-cut films o professional installation.",
      },
      icon: "Package",
    },
  ],
  stats: [
    { value: "10000", label: { en: "Cars Tinted", tl: "Mga Kotse na Na-tint" }, suffix: "+" },
    { value: "99", label: { en: "UV Block", tl: "UV Block" }, suffix: "%" },
    { value: "50", label: { en: "Car Models", tl: "Mga Modelo ng Kotse" }, suffix: "+" },
    { value: "2", label: { en: "Countries", tl: "Mga Bansa" }, suffix: "" },
  ],
  testimonials: [
    {
      id: "testimonial-1",
      name: "Miguel Santos",
      car: "Toyota Fortuner 2024",
      quote: {
        en: "The ceramic tint completely transformed my driving experience. My cabin stays cool even in Manila traffic. Absolutely worth every peso.",
        tl: "Ang ceramic tint ay ganap na nagbago ng aking karanasan sa pagmamaneho. Ang loob ng aking sasakyan ay nananatiling malamig kahit sa trapik ng Manila. Talagang sulit ang bawat piso.",
      },
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: "testimonial-2",
      name: "Sarah Chen",
      car: "Tesla Model 3 2023",
      quote: {
        en: "Crystal clear visibility with incredible heat rejection. The installation was flawless and the pre-cut fit was perfect.",
        tl: "Crystal clear na visibility na may kamangha-manghang pagtanggi sa init. Ang pag-install ay walang kapintasan at ang pre-cut fit ay perpekto.",
      },
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: "testimonial-3",
      name: "James Rivera",
      car: "Ford Ranger 2024",
      quote: {
        en: "Best investment for my truck. The UV protection is noticeable immediately. My leather seats look brand new after 6 months.",
        tl: "Pinakamahusay na investment para sa aking truck. Ang UV protection ay kapansin-pansin agad. Ang aking leather seats ay mukhang bago pa rin pagkatapos ng 6 na buwan.",
      },
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
  ],
  cta: {
    title: { en: "Ready to Transform Your Ride?", tl: "Handa ka na bang I-transform ang Iyong Sasakyan?" },
    subtitle: {
      en: "Get started with our interactive configurator and find the perfect tint for your vehicle.",
      tl: "Magsimula sa aming interactive configurator.",
    },
    button: { en: "Start Configuring", tl: "Simulan ang Pag-configure" },
    badges: [
      { en: "Free shipping over $99", tl: "Libreng shipping sa $99+" },
      { en: "Professional grade", tl: "Professional grade" },
      { en: "Warranty included", tl: "May warranty" },
    ],
  },
};

const seedAdminOrders: AdminOrder[] = [
  {
    id: "ord-001",
    orderNumber: "TG-20260401-A1B2",
    userId: "usr-001",
    status: "pending",
    contact: { name: "Juan Dela Cruz", email: "juan@example.com", phone: "+63 917 123 4567" },
    shippingAddress: { address: "123 Rizal Ave", city: "Manila", postalCode: "1000", country: "PH" },
    items: { carType: "sedan", carModel: "Toyota Corolla", tintType: "ceramic", tintName: "Ceramic", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 16, unitPrice: 8, subtotal: 128 },
    serviceType: "shipping",
    pricing: { subtotal: 128, shipping: 0, installation: 0, taxLabel: "VAT 12%", tax: 15.36, total: 143.36 },
    paymentStatus: "paid",
    notes: [],
    createdAt: "2026-04-01T10:30:00Z",
    updatedAt: "2026-04-01T10:30:00Z",
  },
  {
    id: "ord-002",
    orderNumber: "TG-20260402-C3D4",
    userId: "usr-002",
    status: "processing",
    contact: { name: "Sarah Thompson", email: "sarah@example.com", phone: "+61 412 345 678" },
    shippingAddress: { address: "45 George St", city: "Sydney", postalCode: "2000", country: "AU" },
    items: { carType: "suv", carModel: "Toyota RAV4", tintType: "carbon", tintName: "Carbon", selectedWindows: ["front_windshield", "rear_windshield", "front_left", "front_right", "rear_left", "rear_right"], totalSqft: 46, unitPrice: 6, subtotal: 276 },
    serviceType: "installation",
    pricing: { subtotal: 276, shipping: 0, installation: 184, taxLabel: "GST 10%", tax: 46, total: 506 },
    paymentStatus: "paid",
    notes: ["Customer requested morning installation"],
    createdAt: "2026-04-02T14:15:00Z",
    updatedAt: "2026-04-03T09:00:00Z",
  },
  {
    id: "ord-003",
    orderNumber: "TG-20260403-E5F6",
    userId: "usr-003",
    status: "shipped",
    contact: { name: "Maria Santos", email: "maria@example.com", phone: "+63 918 987 6543" },
    shippingAddress: { address: "789 EDSA", city: "Quezon City", postalCode: "1100", country: "PH" },
    items: { carType: "hatchback", carModel: "Honda Jazz", tintType: "adaptive", tintName: "Adaptive", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right", "rear_windshield"], totalSqft: 23, unitPrice: 12, subtotal: 276 },
    serviceType: "shipping",
    pricing: { subtotal: 276, shipping: 0, installation: 0, taxLabel: "VAT 12%", tax: 33.12, total: 309.12 },
    paymentStatus: "paid",
    notes: [],
    createdAt: "2026-04-03T08:45:00Z",
    updatedAt: "2026-04-03T16:00:00Z",
  },
  {
    id: "ord-004",
    orderNumber: "TG-20260403-G7H8",
    userId: "usr-004",
    status: "delivered",
    contact: { name: "James Wilson", email: "james@example.com", phone: "+61 423 456 789" },
    shippingAddress: { address: "12 Collins St", city: "Melbourne", postalCode: "3000", country: "AU" },
    items: { carType: "sedan", carModel: "BMW 3 Series", tintType: "crystalline", tintName: "Crystalline", selectedWindows: ["front_windshield", "rear_windshield", "front_left", "front_right", "rear_left", "rear_right"], totalSqft: 38, unitPrice: 10, subtotal: 380 },
    serviceType: "shipping",
    pricing: { subtotal: 380, shipping: 0, installation: 0, taxLabel: "GST 10%", tax: 38, total: 418 },
    paymentStatus: "paid",
    notes: ["Delivered to reception"],
    createdAt: "2026-03-28T11:20:00Z",
    updatedAt: "2026-04-02T14:30:00Z",
  },
  {
    id: "ord-005",
    orderNumber: "TG-20260404-I9J0",
    userId: null,
    status: "pending",
    contact: { name: "Ana Reyes", email: "ana@example.com", phone: "+63 919 111 2222" },
    shippingAddress: { address: "456 Ayala Ave", city: "Makati", postalCode: "1226", country: "PH" },
    items: { carType: "coupe", carModel: "Mazda MX-5", tintType: "metallic", tintName: "Metallic", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 14, unitPrice: 5, subtotal: 70 },
    serviceType: "installation",
    pricing: { subtotal: 70, shipping: 0, installation: 56, taxLabel: "VAT 12%", tax: 15.12, total: 141.12 },
    paymentStatus: "unpaid",
    notes: [],
    createdAt: "2026-04-04T06:00:00Z",
    updatedAt: "2026-04-04T06:00:00Z",
  },
  {
    id: "ord-006",
    orderNumber: "TG-20260330-K1L2",
    userId: "usr-005",
    status: "cancelled",
    contact: { name: "David Chen", email: "david@example.com", phone: "+61 434 567 890" },
    shippingAddress: { address: "88 Pitt St", city: "Sydney", postalCode: "2000", country: "AU" },
    items: { carType: "truck", carModel: "Ford Ranger", tintType: "standard", tintName: "Standard", selectedWindows: ["front_left", "front_right", "rear_left", "rear_right"], totalSqft: 16, unitPrice: 3, subtotal: 48 },
    serviceType: "shipping",
    pricing: { subtotal: 48, shipping: 25, installation: 0, taxLabel: "GST 10%", tax: 4.8, total: 77.8 },
    paymentStatus: "refunded",
    notes: ["Customer cancelled - wrong vehicle selected"],
    createdAt: "2026-03-30T09:10:00Z",
    updatedAt: "2026-03-31T10:00:00Z",
  },
];

const seedAdminUsers: AdminUser[] = [
  { id: "usr-001", name: "Juan Dela Cruz", email: "juan@example.com", phone: "+63 917 123 4567", country: "PH", city: "Manila", ordersCount: 3, totalSpent: 456.72, status: "active", joinedAt: "2025-11-15T08:00:00Z", lastActive: "2026-04-01T10:30:00Z", password: "demo1234" },
  { id: "usr-002", name: "Sarah Thompson", email: "sarah@example.com", phone: "+61 412 345 678", country: "AU", city: "Sydney", ordersCount: 5, totalSpent: 1240.00, status: "active", joinedAt: "2025-10-20T14:30:00Z", lastActive: "2026-04-02T14:15:00Z", password: "demo1234" },
  { id: "usr-003", name: "Maria Santos", email: "maria@example.com", phone: "+63 918 987 6543", country: "PH", city: "Quezon City", ordersCount: 2, totalSpent: 618.24, status: "active", joinedAt: "2026-01-05T10:00:00Z", lastActive: "2026-04-03T08:45:00Z", password: "demo1234" },
  { id: "usr-004", name: "James Wilson", email: "james@example.com", phone: "+61 423 456 789", country: "AU", city: "Melbourne", ordersCount: 7, totalSpent: 2890.50, status: "active", joinedAt: "2025-09-10T12:00:00Z", lastActive: "2026-03-28T11:20:00Z", password: "demo1234" },
  { id: "usr-005", name: "David Chen", email: "david@example.com", phone: "+61 434 567 890", country: "AU", city: "Sydney", ordersCount: 1, totalSpent: 0, status: "active", joinedAt: "2026-03-25T16:45:00Z", lastActive: "2026-03-30T09:10:00Z", password: "demo1234" },
  { id: "usr-006", name: "Pedro Garcia", email: "pedro@example.com", phone: "+63 920 333 4444", country: "PH", city: "Cebu", ordersCount: 0, totalSpent: 0, status: "banned", joinedAt: "2026-04-01T09:00:00Z", lastActive: "2026-04-01T09:00:00Z", password: "demo1234" },
  { id: "usr-007", name: "Emma Brown", email: "emma@example.com", phone: "+61 445 678 901", country: "AU", city: "Brisbane", ordersCount: 4, totalSpent: 1560.00, status: "active", joinedAt: "2025-12-18T11:30:00Z", lastActive: "2026-03-20T15:00:00Z", password: "demo1234" },
  { id: "usr-008", name: "Rico Magsaysay", email: "rico@example.com", phone: "+63 921 555 6666", country: "PH", city: "Davao", ordersCount: 6, totalSpent: 890.40, status: "active", joinedAt: "2025-08-22T07:15:00Z", lastActive: "2026-04-04T12:00:00Z", password: "demo1234" },
];

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
  tintPackages: TintPackage[];
  siteSettings: SiteSettings;
  faqItems: FaqItem[];
  aboutContent: AboutContent;
  contactInfo: ContactInfo;
  homepageContent: HomepageContent;
  adminOrders: AdminOrder[];
  adminUsers: AdminUser[];
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
      tintPackages: Array.from(tintPackages.values()),
      siteSettings,
      faqItems: Array.from(faqItems.values()),
      aboutContent,
      contactInfo,
      homepageContent,
      adminOrders: Array.from(adminOrders.values()),
      adminUsers: Array.from(adminUsers.values()),
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

const tintPackages = new Map<string, TintPackage>(
  (saved?.tintPackages || seedTintPackages).map((p) => [p.id, p])
);

let siteSettings: SiteSettings = saved?.siteSettings || { ...seedSiteSettings };

const faqItems = new Map<string, FaqItem>(
  (saved?.faqItems || seedFaqItems).map((f) => [f.id, f])
);

let aboutContent: AboutContent = saved?.aboutContent || { ...seedAboutContent };

let contactInfo: ContactInfo = saved?.contactInfo || { ...seedContactInfo };

let homepageContent: HomepageContent = saved?.homepageContent || { ...seedHomepageContent };

const adminOrders = new Map<string, AdminOrder>(
  (saved?.adminOrders || seedAdminOrders).map((o) => [o.id, o])
);

const adminUsers = new Map<string, AdminUser>(
  (saved?.adminUsers || seedAdminUsers).map((u) => [u.id, u])
);

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

// ---------------------------------------------------------------------------
// FaqItem helpers
// ---------------------------------------------------------------------------

export function getFaqItems(): FaqItem[] {
  return Array.from(faqItems.values()).sort((a, b) => a.order - b.order);
}

export function getFaqItem(id: string): FaqItem | undefined {
  return faqItems.get(id);
}

export function createFaqItem(data: Omit<FaqItem, "id">): FaqItem {
  const id = `faq-${crypto.randomUUID()}`;
  const item: FaqItem = { ...data, id };
  faqItems.set(id, item);
  saveToFile();
  return item;
}

export function updateFaqItem(id: string, data: Partial<FaqItem>): FaqItem | null {
  const existing = faqItems.get(id);
  if (!existing) return null;
  const updated: FaqItem = { ...existing, ...data, id: existing.id };
  faqItems.set(id, updated);
  saveToFile();
  return updated;
}

export function deleteFaqItem(id: string): boolean {
  const result = faqItems.delete(id);
  if (result) saveToFile();
  return result;
}

// ---------------------------------------------------------------------------
// AboutContent helpers
// ---------------------------------------------------------------------------

export function getAboutContent(): AboutContent {
  return { ...aboutContent };
}

export function updateAboutContent(data: Partial<AboutContent>): AboutContent {
  aboutContent = { ...aboutContent, ...data };
  saveToFile();
  return { ...aboutContent };
}

// ---------------------------------------------------------------------------
// ContactInfo helpers
// ---------------------------------------------------------------------------

export function getContactInfo(): ContactInfo {
  return { ...contactInfo };
}

export function updateContactInfo(data: Partial<ContactInfo>): ContactInfo {
  contactInfo = { ...contactInfo, ...data };
  saveToFile();
  return { ...contactInfo };
}

// ---------------------------------------------------------------------------
// HomepageContent helpers
// ---------------------------------------------------------------------------

export function getHomepageContent(): HomepageContent {
  return { ...homepageContent };
}

export function updateHomepageContent(data: Partial<HomepageContent>): HomepageContent {
  homepageContent = { ...homepageContent, ...data };
  saveToFile();
  return { ...homepageContent };
}

// ---------------------------------------------------------------------------
// AdminOrder helpers
// ---------------------------------------------------------------------------

export function getAdminOrders(): AdminOrder[] {
  return Array.from(adminOrders.values());
}

export function getAdminOrder(id: string): AdminOrder | undefined {
  return adminOrders.get(id);
}

export function updateAdminOrder(id: string, data: Partial<AdminOrder>): AdminOrder | null {
  const existing = adminOrders.get(id);
  if (!existing) return null;
  const updated: AdminOrder = { ...existing, ...data, id: existing.id, updatedAt: new Date().toISOString() };
  adminOrders.set(id, updated);
  saveToFile();
  return updated;
}

export function createAdminOrder(data: Omit<AdminOrder, 'id'> & { id?: string }): AdminOrder {
  const id = data.id || `ord-${crypto.randomUUID().slice(0, 8)}`;
  const order: AdminOrder = { ...data, id };
  adminOrders.set(id, order);
  saveToFile();
  return order;
}

// ---------------------------------------------------------------------------
// AdminUser helpers
// ---------------------------------------------------------------------------

export function getAdminUsers(): AdminUser[] {
  return Array.from(adminUsers.values());
}

export function getAdminUser(id: string): AdminUser | undefined {
  return adminUsers.get(id);
}

export function createAdminUser(data: Omit<AdminUser, 'id'>): AdminUser {
  const id = `usr-${crypto.randomUUID().slice(0, 8)}`;
  const user: AdminUser = { ...data, id };
  adminUsers.set(id, user);
  saveToFile();
  return user;
}

export function getAdminUserByEmail(email: string): AdminUser | undefined {
  return Array.from(adminUsers.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function updateAdminUser(id: string, data: Partial<AdminUser>): AdminUser | null {
  const existing = adminUsers.get(id);
  if (!existing) return null;
  const updated: AdminUser = { ...existing, ...data, id: existing.id };
  adminUsers.set(id, updated);
  saveToFile();
  return updated;
}

// ---------------------------------------------------------------------------
// TintPackage helpers
// ---------------------------------------------------------------------------

export function getTintPackages(): TintPackage[] {
  return Array.from(tintPackages.values()).sort((a, b) => a.order - b.order);
}

export function getTintPackage(id: string): TintPackage | undefined {
  return tintPackages.get(id);
}

export function createTintPackage(data: Omit<TintPackage, "id">): TintPackage {
  const id = `pkg-${crypto.randomUUID().slice(0, 8)}`;
  const pkg: TintPackage = { ...data, id };
  tintPackages.set(id, pkg);
  saveToFile();
  return pkg;
}

export function updateTintPackage(id: string, data: Partial<TintPackage>): TintPackage | null {
  const existing = tintPackages.get(id);
  if (!existing) return null;
  const updated: TintPackage = { ...existing, ...data, id: existing.id };
  tintPackages.set(id, updated);
  saveToFile();
  return updated;
}

export function deleteTintPackage(id: string): boolean {
  const result = tintPackages.delete(id);
  if (result) saveToFile();
  return result;
}
