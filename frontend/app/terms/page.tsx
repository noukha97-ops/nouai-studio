'use client';

import { useState, useEffect } from 'react';
import { LogOut, Zap, X } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);

  const router = useRouter();
  const LOGO_PATH = "/logo.png";

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCredits(userSnap.data().credits || 0);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full relative bg-[#0a0514] overflow-hidden flex flex-col">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* --- STICKY NAVBAR (HEIGHT RUAJ 72px) --- */}
      <nav className="h-[72px] sticky top-0 w-full flex-none z-[100] border-b border-white/10 bg-[#1a0b2e]/60 backdrop-blur-2xl px-6 md:px-10 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <img src={LOGO_PATH} alt="Logo" className="w-10 h-10 rounded-full border border-white/20" />
          <span className="text-[14px] font-black tracking-widest italic text-white uppercase">NouAI Studio</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase hover:bg-white/20 transition-all">
            <span>Studio</span>
          </button>
          {user && (
            <>
              <button onClick={() => router.push('/payment')} className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-2xl hover:bg-indigo-500/20 transition-all">
                 <span className="text-[10px] font-black text-indigo-300 uppercase">{credits} CR</span>
                 <Zap size={12} className="text-indigo-400" />
              </button>
              <button onClick={handleSignOut} className="text-zinc-400 hover:text-red-400 transition-colors ml-2"><LogOut size={18} /></button>
            </>
          )}
        </div>
      </nav>

      {/* --- ✅ KHO: ZAIS LUB SCROLL BAR RAU LUB THAWV CONTENT NO --- */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10">
        <div className="max-w-[800px] mx-auto p-4 md:p-10 pb-40">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h2 className="text-[22px] font-bold text-white italic uppercase tracking-tighter">Terms of Service</h2>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Last updated: May 2026</p>
            </div>
            <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 shadow-lg">
              <X size={18} />
            </button>
          </div>

          {/* TERMS TEXT BOX */}
          <div className="rounded-[30px] bg-[#050508]/80 border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-2xl text-left space-y-6 text-zinc-300 text-[14px] leading-relaxed font-medium">
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">1. Kev Txais Tos Cov Cai (Acceptance of Terms)</h3>
              <p>Thaum koj tsim account thiab siv lub vev xaib NouAI Studio, koj tau lees paub tias koj pom zoo khiav raws txhua cov nqe cai uas peb tau teev tseg ntawm no. Yog tias koj tsis pom zoo, thov tsis txob siv peb cov kev pab cuam no.</p>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">2. Cov Tshuav Credits Thiab Kev Them Nyiaj (Credits & Payments)</h3>
              <p>Cov Credits (CR) yog siv los ua nqi tsim suab lus AI hauv lub studio xwb. Cov ntsiab lus cai muaj li no:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-zinc-400">
                <li>Cov Credits uas tau yuav lawm yuav **tsis tuaj yeem thim tau nyiaj rov qab (Non-refundable)** tsuas yog muaj teeb meem loj ntawm peb sab tshuab xwb.</li>
                <li>Peb muaj txoj cai hloov pauv nqi Credits raws li lub tshuab RunPod Server nce lossis nqis yav tom qab.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">3. Kev Siv Suab Lus AI (Fair Use & Content Ownership)</h3>
              <p>Koj muaj cai tag nrho **(100% Commercial Rights)** siv cov suab lus Hmoob uas tsim tawm hauv NouAI Studio mus tso rau hauv Youtube, TikTok, Facebook, lossis lwm yam lag luam. Tab sis koj tsis muaj cai siv peb lub tshuab mus tsim cov suab lus phem, ntxias neeg, lossis ua txhaum cai lij choj.</p>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">4. Kev Kaw Tus Account (Account Termination)</h3>
              <p>Peb muaj txoj cai kaw lossis nres koj tus account tam sim nkaus tias peb pom tias koj sim khwb/hack lub tshuab server, lossis sim khiav tshuab uas tsis raug cai tsim kev puas tsuaj rau lub vev xaib.</p>
            </section>
            <section className="pt-4 border-t border-white/5">
              <h3 className="text-[12px] font-black uppercase text-indigo-400 tracking-wider mb-1">Hu Rau Peb</h3>
              <p className="text-zinc-400 text-[13px]">Yog muaj lus nug txog cov nqe cai Terms of Service no, koj tuaj yeem sau ntawv qhia peb tau txhua lub sijhawm hauv: <span className="text-white font-semibold">noukha97.ops@gmail.com</span></p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}