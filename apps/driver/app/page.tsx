import { C } from "@mvbb/ui";

// Placeholder. Built as a Next.js PWA for now per the roadmap ("React
// Native, or start as PWA, upgrade later"); migrate to React Native if
// background GPS / push notifications prove necessary for delivery zones
// with patchy connectivity. Port DriverApp screens from mvbb-app.jsx
// (prototype lines ~1283-1450) here.
export default function DriverHomePage() {
  return (
    <main style={{ padding: 24, color: C.ink, background: C.paper }}>
      <h1 className="gd">MVBB Driver</h1>
      <p className="gb">Driver app scaffold.</p>
    </main>
  );
}
