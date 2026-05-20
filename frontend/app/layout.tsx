import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NouAI Studio - AI Powered Hmong Voice",
  description: "Convert text to Hmong neural AI voices easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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

        {/* --- GLOBAL SECURE FOOTER (LEMON SQUEEZY COMPLIANT) --- */}
        <footer className="w-full bg-[#050508]/60 border-t border-white/5 backdrop-blur-xl py-6 px-6 relative z-50">
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
            <div>
              <p>© {new Date().getFullYear()} NouAI Studio. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact Us</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}