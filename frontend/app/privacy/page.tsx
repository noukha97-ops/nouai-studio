'use client';

import { useState, useEffect } from 'react';
import { LogOut, Zap, X } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
              <h2 className="text-[22px] font-bold text-white italic uppercase tracking-tighter">Privacy Policy</h2>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Last updated: May 2026</p>
            </div>
            <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 shadow-lg">
              <X size={18} />
            </button>
          </div>

          {/* POLICY TEXT BOX */}
          <div className="rounded-[30px] bg-[#050508]/80 border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-2xl text-left space-y-6 text-zinc-300 text-[14px] leading-relaxed font-medium">
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">1. Cov Ntaub Ntawv Peb Khaws Tseg (Information We Collect)</h3>
              <p>Peb khaws koj tus Email address thaum koj log in ntawm Firebase Auth txhawm rau txheeb xyuas koj tus account thiab tswj koj cov Credits (CR). Tsis tas li ntawd, cov ntawv (text) uas koj sau tuaj thiab cov suab (audio files) uas tsim tawm yuav raug khaws tseg hauv peb lub database ruaj ntseg ntawm Supabase txhawm rau nthuav qhia rau hauv koj lub Audio History.</p>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">2. Kev Siv Ntaub Ntawv (How We Use Information)</h3>
              <p>Peb siv koj cov ntaub ntawv tsuas yog rau cov ntsiab lus hauv qab no xwb:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-zinc-400">
                <li>Tsim lub suab lus Hmoob AI raws li koj xav tau.</li>
                <li>Tswj hwm thiab ntxiv/rho cov tshuav Credits (CR) hauv koj tus account.</li>
                <li>Txhim kho peb cov tshuab AI kom khiav ceev thiab zoo suab mloog ntxiv.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">3. Kev Them Nyiaj Thiab Kev Ruaj Ntseg (Payment & Security)</h3>
              <p>Kev them nyiaj saum lub vev xaib no yog tswj hwm los ntawm tus tsim nyog txais tos **Lemon Squeezy**. Peb tsis khaws lossis tsis pom koj cov ntaub ntawv npav txhab nyiaj (Credit Card details) li hlo. Txhua yam kev ruaj ntseg yog khiav raws cai standard SSL encryption.</p>
            </section>
            <section>
              <h3 className="text-[12px] font-black uppercase text-white tracking-wider mb-2">4. Kev Tiv Thaiv Cov Ntaub Ntawv (Data Protection)</h3>
              <p>NouAI Studio yuav tsis muag, tsis hloov pauv, lossis tsis xa koj cov ntaub ntawv mus rau lwm lub tuam txhab sab nraud li hlo. Koj cov ntaub ntawv tsuas yog khaws tseg rau koj siv hauv lub vev xaib no xwb.</p>
            </section>
            <section className="pt-4 border-t border-white/5">
              <h3 className="text-[12px] font-black uppercase text-indigo-400 tracking-wider mb-1">Muaj Lus Nug?</h3>
              <p className="text-zinc-400 text-[13px]">Yog koj muaj lus nug ntxiv txog qhov Privacy Policy no, thov sau ntawv tuaj rau peb tau ntawm: <span className="text-white font-semibold">support@nouai.app</span></p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}