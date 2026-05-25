import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// TEEB TSA METADATA NROG KOJ LUB LOGO DISPLAY SAUM BROWSER TAB
export const metadata: Metadata = {
  title: "NouAI Studio - AI Powered Hmong Voice",
  description: "Convert text to Hmong neural AI voices easily.",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* FORCE LOGO RAU HEAD KOM BROWSER READ CEEV CEEV */}
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a0514] text-slate-100 flex flex-col justify-between relative overflow-x-hidden`}>
        
        {/* --- GLOBAL CYBERPUNK BACKGROUND THEME FOR EVERY PAGE --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
          <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
        </div>

        {/* --- GLOBAL CONTENT LAYER --- */}
        <div className="flex-grow flex flex-col relative z-10 w-full">
          {children}
        </div>

        {/* --- DAIM FOOTER BAR PEB TWB REMOVE/TSHEM TAWM HUVS SI LAWM --- */}

      </body>
    </html>
  );
}