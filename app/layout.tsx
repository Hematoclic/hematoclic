import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test App",
  description: "Basic App Router test",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
