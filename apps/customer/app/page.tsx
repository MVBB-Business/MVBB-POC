import { effectivePrice, inr } from "@mvbb/pricing";
import { C } from "@mvbb/ui";

// Placeholder home screen. Port HomeScreen from mvbb-app.jsx (prototype
// line ~368) here once real grade/product data comes from Supabase.
const sampleGrade = {
  id: "medium",
  label: "Medium",
  tiers: [
    { min: 1, price: 1450 },
    { min: 5, price: 1380 },
    { min: 10, price: 1320 },
    { min: 25, price: 1260 },
  ],
};

export default function HomePage() {
  const price = effectivePrice(sampleGrade, 1, "B2C");

  return (
    <main style={{ padding: 24, color: C.ink, background: C.paper }}>
      <h1 className="gd">MVBB — Lahasun Wala</h1>
      <p className="gb">
        {sampleGrade.label} garlic: {inr(price)} / bag
      </p>
    </main>
  );
}
