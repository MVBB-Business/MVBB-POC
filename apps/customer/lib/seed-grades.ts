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
  desc: string;
  quality: string;
  bulbSize: string;
  cloves: string;
  moisture: string;
  shelfLife: string;
  origin: string;
  exportGrade: boolean;
  bestSeller: boolean;
  stockBags: number;
  color: string;
}

export const SEED_GRADES: SeedGrade[] = [
  { id: "medium", category: "Garlic", label: "Medium", tagline: "Reliable everyday grade", desc: "Standard 25–30mm bulbs ideal for retail shops, kitchens and daily cooking. Consistent sizing with good shelf life. Our highest-volume seller across Andhra Pradesh.", quality: "Standard", bulbSize: "25–30mm", cloves: "10–15/bulb", moisture: "<65%", shelfLife: "3–4 months", origin: "Guntur, AP", exportGrade: false, bestSeller: true, stockBags: 120, color: "#D4C4B0", tiers: [{ min: 1, price: 1450 }, { min: 5, price: 1380 }, { min: 10, price: 1320 }, { min: 25, price: 1260 }] },
  { id: "maharaja", category: "Garlic", label: "Maharaja", tagline: "Large bulb, export favourite", desc: "Premium 35–40mm bulbs with tight skin and bold flavour. Preferred by exporters to Middle East and Southeast Asia. Each bulb hand-sorted for uniform appearance.", quality: "Premium", bulbSize: "35–40mm", cloves: "8–12/bulb", moisture: "<60%", shelfLife: "4–5 months", origin: "Guntur, AP", exportGrade: true, bestSeller: false, stockBags: 45, color: "#C9B8A5", tiers: [{ min: 1, price: 1650 }, { min: 5, price: 1560 }, { min: 10, price: 1490 }, { min: 25, price: 1410 }] },
  { id: "skumar", category: "Garlic", label: "S. Kumar", tagline: "Uniformly graded premium", desc: "Named after the grading standard, 30–35mm bulbs machine-sorted for perfect uniformity. Ideal for hotel chains and institutional buyers who need consistency.", quality: "Premium", bulbSize: "30–35mm", cloves: "10–14/bulb", moisture: "<62%", shelfLife: "4 months", origin: "Guntur, AP", exportGrade: false, bestSeller: false, stockBags: 60, color: "#BFA98F", tiers: [{ min: 1, price: 1580 }, { min: 5, price: 1500 }, { min: 10, price: 1440 }, { min: 25, price: 1370 }] },
  { id: "bom", category: "Garlic", label: "BOM", tagline: "Bold bulb for kitchens & hotels", desc: "Bold Off-white Medium — 35mm+ with distinctive white papery skin. High pungency, go-to choice for commercial kitchens, pickles and paste manufacturers.", quality: "Premium", bulbSize: "35mm+", cloves: "8–10/bulb", moisture: "<58%", shelfLife: "4–5 months", origin: "Guntur, AP", exportGrade: true, bestSeller: true, stockBags: 15, color: "#A8977F", tiers: [{ min: 1, price: 1720 }, { min: 5, price: 1630 }, { min: 10, price: 1560 }, { min: 25, price: 1480 }] },
  { id: "doublebom", category: "Garlic", label: "Double BOM", tagline: "Our top-tier export grade", desc: "Extra bold 40mm+ bulbs — crown jewel of our catalogue. Each bulb individually inspected. Reserved for premium export orders and five-star hotel chains.", quality: "Super Premium", bulbSize: "40mm+", cloves: "6–8/bulb", moisture: "<55%", shelfLife: "5–6 months", origin: "Guntur, AP", exportGrade: true, bestSeller: false, stockBags: 8, color: "#9C8B72", tiers: [{ min: 1, price: 1890 }, { min: 5, price: 1790 }, { min: 10, price: 1710 }, { min: 25, price: 1620 }] },
  { id: "kali", category: "Garlic", label: "KALI", tagline: "Dark-skin, high pungency", desc: "Dark-skinned variety with intense, sharp flavour profile. Sought after for medicinal preparations, Ayurvedic products and traditional pickle recipes across South India.", quality: "Specialty", bulbSize: "28–35mm", cloves: "12–18/bulb", moisture: "<60%", shelfLife: "3–4 months", origin: "Guntur, AP", exportGrade: false, bestSeller: false, stockBags: 0, color: "#7A6B5A", tiers: [{ min: 1, price: 1610 }, { min: 5, price: 1530 }, { min: 10, price: 1470 }, { min: 25, price: 1400 }] },
  { id: "ginger_std", category: "Ginger", label: "Standard Ginger", tagline: "Handpicked, low-fibre", desc: "Fresh ginger root sourced from the Guntur region — low fibre, high aroma, everyday cooking grade suited for both home kitchens and commercial use.", quality: "Standard", bulbSize: "Medium root", cloves: "—", moisture: "<70%", shelfLife: "2–3 months", origin: "Guntur, AP", exportGrade: false, bestSeller: false, stockBags: 90, color: "#D9C7A0", tiers: [{ min: 1, price: 2100 }, { min: 5, price: 2000 }, { min: 10, price: 1920 }, { min: 25, price: 1840 }] },
  { id: "onion_medium", category: "Onion", label: "Medium Onion", tagline: "Everyday red onion, 40–60mm", desc: "Nashik-grade red onion, medium size — the everyday staple for kitchens and retail. Firm skin, good shelf life, consistent grading.", quality: "Standard", bulbSize: "40–60mm", cloves: "—", moisture: "<68%", shelfLife: "2–3 months", origin: "Kurnool, AP", exportGrade: false, bestSeller: true, stockBags: 200, color: "#C97B5E", tiers: [{ min: 1, price: 980 }, { min: 5, price: 930 }, { min: 10, price: 890 }, { min: 25, price: 850 }] },
  { id: "onion_large", category: "Onion", label: "Large Onion", tagline: "Hotel & catering grade, 60mm+", desc: "Bold 60mm+ red onion for hotels, caterers and bulk kitchens who need larger, more uniform bulbs for consistent prep.", quality: "Premium", bulbSize: "60mm+", cloves: "—", moisture: "<65%", shelfLife: "2–3 months", origin: "Kurnool, AP", exportGrade: false, bestSeller: false, stockBags: 35, color: "#B56A4E", tiers: [{ min: 1, price: 1120 }, { min: 5, price: 1060 }, { min: 10, price: 1010 }, { min: 25, price: 970 }] },
];

export function getSeedGrade(id: string): SeedGrade | undefined {
  return SEED_GRADES.find((g) => g.id === id);
}
