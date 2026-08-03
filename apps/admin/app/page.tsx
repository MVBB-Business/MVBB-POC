import { C } from "@mvbb/ui";

// Placeholder dashboard. Port the Admin tabs from mvbb-app.jsx here
// (Dashboard/Orders/Stock/Finance/Khata/Broadcast/Suppliers/Meetings/CCTV —
// prototype lines ~1450-2850) once Supabase-backed data is wired up.
export default function AdminDashboardPage() {
  return (
    <main style={{ padding: 24, color: C.ink, background: C.paper }}>
      <h1 className="gd">MVBB Admin</h1>
      <p className="gb">Dashboard scaffold — wire up Supabase queries here.</p>
    </main>
  );
}
