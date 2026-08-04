import "@mvbb/ui/src/theme.css";
import "@mvbb/ui/src/fonts.css";
import type { ReactNode } from "react";
import { CartProvider } from "../lib/cart-context";

export const metadata = {
  title: "MVBB — Lahasun Wala",
  description: "Wholesale garlic, ginger and onion — straight from the mandi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mvbb-root">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
