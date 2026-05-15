'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// --- MUAB KOJ LUB FIREBASE CONFIG NTSAWS RAU NO ---
const firebaseConfig = { /* Koj lub config hauv Firebase Dashboard */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // 1. Check seb User puas tau Login hauv Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchCredits(user.email!);
      } else {
        window.location.href = '/login'; // Yog tsis tau login kom rov mus login
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Mus fetch Credits los ntawm Supabase API
  const fetchCredits = async (email: string) => {
    const res = await fetch(`/api/get-credits?email=${email}`);
    const data = await res.json();
    setCredits(data.credits);
  };

  // 3. Ntu "HAK Credits" (Minus Credits)
  const handleGenerateAI = async () => {
    if (credits <= 0) {
      alert("Koj tsis tshuav Credits lawm! Thov mus top up uantej.");
      return;
    }

    setLoading(true);
    try {
      // Hu rau API txhawm rau txo credits
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await res.json();

      if (data.success) {
        setCredits(data.remainingCredits); // Hloov lej hauv screen tam sim
        alert("✨ AI Generate Tiav Lawm! (หัก 1 Credit)");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Muaj teeb meem txuas lus nrog Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-5">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            NouAI <span className="text-indigo-500">Studio</span>
          </h1>
          <div className="bg-zinc-900 px-5 py-2 rounded-full border border-indigo-500/30 flex items-center gap-3">
            <span className="text-zinc-400 text-sm">{userEmail}</span>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <span className="font-bold text-indigo-400">💰 {credits} Credits</span>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center py-20">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black mb-4">Pib tsim koj lub AI Art</h2>
            <p className="text-zinc-500 italic">Siv 1 Credit txhua zaum uas Generate</p>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading || credits <= 0}
            className="group relative px-12 py-6 bg-indigo-600 rounded-[30px] font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500 shadow-2xl shadow-indigo-500/40"
          >
            {loading ? "Magic is happening..." : "Generate Image"}
          </button>

          <a href="/payment" className="mt-10 text-zinc-500 hover:text-white transition-colors underline underline-offset-4">
            Top up more credits
          </a>
        </main>
      </div>
    </div>
  );
}