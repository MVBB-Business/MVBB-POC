import type { Grade } from "@mvbb/pricing";

/**
 * Placeholder catalog data, ported from mvbb-app.jsx DEFAULT_GRADES
 * (prototype lines ~54-64). Stock bag counts here are seed values for the
 * demo — real stock comes from Supabase once issue #6 (realtime sync) and
 * the grades table are wired up.
 */
export interface SeedGrade extends Grade {
  id: string;
  category: string;
  label: string;
  tagline: string;
  bulbSize: string;
  exportGrade: boolean;
  bestSeller: boolean;
  stockBags: number;
}

export const SEED_GRADES: SeedGrade[] = [
  { id: "medium", category: "Garlic", label: "Medium", tagline: "Reliable everyday grade", bulbSize: "25–30mm", exportGrade: false, bestSeller: true, stockBags: 120, tiers: [{ min: 1, price: 1450 }, { min: 5, price: 1380 }, { min: 10, price: 1320 }, { min: 25, price: 1260 }] },
  { id: "maharaja", category: "Garlic", label: "Maharaja", tagline: "Large bulb, export favourite", bulbSize: "35–40mm", exportGrade: true, bestSeller: false, stockBags: 45, tiers: [{ min: 1, price: 1650 }, { min: 5, price: 1560 }, { min: 10, price: 1490 }, { min: 25, price: 1410 }] },
  { id: "skumar", category: "Garlic", label: "S. Kumar", tagline: "Uniformly graded premium", bulbSize: "30–35mm", exportGrade: false, bestSeller: false, stockBags: 60, tiers: [{ min: 1, price: 1580 }, { min: 5, price: 1500 }, { min: 10, price: 1440 }, { min: 25, price: 1370 }] },
  { id: "bom", category: "Garlic", label: "BOM", tagline: "Bold bulb for kitchens & hotels", bulbSize: "35mm+", exportGrade: true, bestSeller: true, stockBags: 15, tiers: [{ min: 1, price: 1720 }, { min: 5, price: 1630 }, { min: 10, price: 1560 }, { min: 25, price: 1480 }] },
  { id: "doublebom", category: "Garlic", label: "Double BOM", tagline: "Our top-tier export grade", bulbSize: "40mm+", exportGrade: true, bestSeller: false, stockBags: 8, tiers: [{ min: 1, price: 1890 }, { min: 5, price: 1790 }, { min: 10, price: 1710 }, { min: 25, price: 1620 }] },
  { id: "kali", category: "Garlic", label: "KALI", tagline: "Dark-skin, high pungency", bulbSize: "28–35mm", exportGrade: false, bestSeller: false, stockBags: 0, tiers: [{ min: 1, price: 1610 }, { min: 5, price: 1530 }, { min: 10, price: 1470 }, { min: 25, price: 1400 }] },
  { id: "ginger_std", category: "Ginger", label: "Standard Ginger", tagline: "Handpicked, low-fibre", bulbSize: "Medium root", exportGrade: false, bestSeller: false, stockBags: 90, tiers: [{ min: 1, price: 2100 }, { min: 5, price: 2000 }, { min: 10, price: 1920 }, { min: 25, price: 1840 }] },
  { id: "onion_medium", category: "Onion", label: "Medium Onion", tagline: "Everyday red onion, 40–60mm", bulbSize: "40–60mm", exportGrade: false, bestSeller: true, stockBags: 200, tiers: [{ min: 1, price: 980 }, { min: 5, price: 930 }, { min: 10, price: 890 }, { min: 25, price: 850 }] },
  { id: "onion_large", category: "Onion", label: "Large Onion", tagline: "Hotel & catering grade, 60mm+", bulbSize: "60mm+", exportGrade: false, bestSeller: false, stockBags: 35, tiers: [{ min: 1, price: 1120 }, { min: 5, price: 1060 }, { min: 10, price: 1010 }, { min: 25, price: 970 }] },
];
