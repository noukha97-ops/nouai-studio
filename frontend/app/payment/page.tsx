'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function PaymentPage() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const LOGO_PATH = '/logo.png';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const packages = [
    { id: 1, name: 'Trial Pack', credits: 20, price: '$0.99' },
    { id: 2, name: 'Starter Pack', credits: 100, price: '$4.99' },
    { id: 3, name: 'Pro Pack', credits: 500, price: '$19.99' },
    { id: 4, name: 'Studio Pack', credits: 1500, price: '$49.99' },
  ];

  // --- KHO LUB HANDLEBUY KOM DIRECT REDIRECT CEEV TSHAJ PLAWS ---
  const handleBuy = async (pkg: any) => {
    if (!user) {
      router.push('/login');
      return;
    }

    // 1. SAVE LOG RAU SUPABASE (Khiav tom qab nkaus nkaus)
    try {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          user_email: user.email || 'unknown',
          plan_name: pkg.name,
          price: pkg.price
        })
      });
    } catch (e) {
      console.error("Tracking error:", e);
    }

    // 2. KHAWVB KOOB REDIRECT: Cia li dhia mus rau hauv Messenger tam sim tsis nug li qub
    // Vim Messenger txwv tsis pub xa ntawv auto, tus user yuav tsum tau ntaus ntawv qhia koj hauv chat
    // Lossis koj ua video explain qhia lawv tias "Thaum dhia mus txog hauv Messenger, tsuas yog inbox qhia admin tias xav muas lub pack twg"
    window.location.href = "https://m.me/916180751581002";
  };

  return (
    <main className="h-screen w-full relative bg-[#0a0514] overflow-hidden flex flex-col font-sans">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* NAVBAR */}
      <nav className="flex-none z-[100] border-b border-white/10 bg-[#1a0b2e]/60 backdrop-blur-2xl px-6 md:px-10 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <img src={LOGO_PATH} alt="Logo" className="w-8 h-8 rounded-full border border-white/20" />
          <span className="text-[12px] font-black tracking-widest italic text-white uppercase">NouAI Studio</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </nav>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide py-10 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-2 leading-none">
              Refill <span className="text-indigo-400">Credits</span>
            </h1>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Upgrade koj lub studio nrog ntau credits</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative group p-[2px] rounded-[32px] overflow-hidden">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#6366f1_0%,transparent_25%,transparent_50%,#a855f7_75%,#6366f1_100%)] animate-[spin_6s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#050508] rounded-[30px] p-[1px] h-full">
                  <div className="bg-[#050508]/90 rounded-[28px] p-8 flex flex-col items-center text-center h-full">
                    <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8">{pkg.name}</h2>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-6xl font-black text-white italic tracking-tighter">{pkg.credits}</span>
                      <span className="text-zinc-500 font-black uppercase text-[8px] tracking-widest italic">Credits</span>
                    </div>
                    <p className="text-2xl font-black mb-8 italic text-white/90">{pkg.price}</p>
                    <button
                      onClick={() => handleBuy(pkg)}
                      className="mt-auto w-full py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}