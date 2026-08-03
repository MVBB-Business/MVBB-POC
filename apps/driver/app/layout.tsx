import "@mvbb/ui/src/theme.css";
import "@mvbb/ui/src/fonts.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "MVBB Driver",
  description: "Accept deliveries, capture pickup/drop-off, track earnings.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mvbb-root">{children}</body>
    </html>
  );
}
