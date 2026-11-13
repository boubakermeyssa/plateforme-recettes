import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
