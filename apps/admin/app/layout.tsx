import "@mvbb/ui/src/theme.css";
import "@mvbb/ui/src/fonts.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "MVBB Admin",
  description: "Orders, stock, finance and dispatch for MVBB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mvbb-root">{children}</body>
    </html>
  );
}
