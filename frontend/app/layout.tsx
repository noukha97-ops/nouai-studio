import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ─── LUB TSAV METADATA (KHO CHAW NO) ──────────────────────────────────
export const metadata: Metadata = {
  title: "Hmong Voice - Neural Studio",
  description: "Powered by Nou AI",
  // 👉 Nov yog cov kab code uas yuav coj koj lub logo mus display saum Tab Browser
  icons: {
    icon: "/logo.png",       // Nyeem ncaj qha rau hauv frontend/public/logo.png
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

// ─── LUB ROOT LAYOUT COMPONENT ───────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}