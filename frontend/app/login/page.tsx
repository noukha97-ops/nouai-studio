'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const LOGO_PATH = "/logo.png"; 

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0514]">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* --- LOGIN CARD (Kho kom me thiab haum screen) --- */}
      <div className="relative z-10 w-full max-w-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] md:rounded-[60px] p-8 sm:p-10 md:p-14 text-center shadow-2xl animate-in zoom-in duration-500">
        
        {/* Logo Section - Kho kom me zog */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 group">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <img 
            src={LOGO_PATH} 
            alt="Logo" 
            className="relative w-full h-full rounded-full border border-white/20 object-cover shadow-lg transition-transform duration-500 group-hover:scale-105" 
          />
        </div>

        {/* Text Section - Responsive Typography */}
        <div className="space-y-2 mb-8 md:mb-10 px-2">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-widest italic uppercase leading-tight">
            Hmong Voice
          </h1>
          <p className="text-indigo-400 text-[8px] sm:text-[10px] uppercase font-black tracking-[0.4em] opacity-80">
            Neural Studio Powered by Nou AI
          </p>
          <div className="w-10 h-[1px] bg-indigo-500/30 mx-auto mt-4" />
        </div>

        {/* Google Login Button - Compact Sizing */}
        <button 
          onClick={handleLogin} 
          className="w-full bg-white text-black py-4 sm:py-5 rounded-2xl font-black text-[12px] sm:text-[13px] uppercase tracking-[0.1em] shadow-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
          </div>
          Login with Google
        </button>

        {/* Footer Text */}
        <p className="mt-8 md:mt-10 text-[8px] text-white/10 uppercase tracking-[0.2em] font-medium px-4">
          Secure Access • Cloud Processing
        </p>
      </div>
      
      {/* Floating Decorative Logo - Discreet */}
      <div className="fixed bottom-6 left-6 z-20 opacity-20 hidden sm:block">
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-black text-black text-[8px]">N</div>
      </div>
    </main>
  );
}