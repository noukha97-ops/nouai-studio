'use client';

import { useState, useEffect } from 'react';
import { LogOut, Zap, X, Loader2 } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full relative bg-[#0a0514] overflow-hidden flex flex-col">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* --- ✅ KHO STICKY NAVBAR (HEIGHT RUAJ 72px) --- */}
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

      {/* --- MAIN CONTENT AREA --- */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10">
        <div className="max-w-[1100px] mx-auto p-4 md:p-10 grid grid-cols-12 gap-8 pb-40 relative">
          
          {/* TITLE HEADER */}
          <div className="col-span-12 text-left px-2 flex justify-between items-center">
            <h2 className="text-[22px] font-bold text-white italic uppercase tracking-tighter">Contact Us</h2>
            <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 shadow-lg">
              <X size={18} />
            </button>
          </div>

          {/* LEFT SIDEBAR: INFO DETAILS */}
          <div className="col-span-12 lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="rounded-[30px] bg-white/5 border border-white/10 p-8 shadow-2xl text-left relative overflow-hidden backdrop-blur-2xl">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 italic">Chaw Txuas Lus</p>
              <div className="space-y-5">
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider block">Email Support</span>
                  <span className="text-[14px] text-zinc-200 font-medium">support@nouai.app</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider block">Business</span>
                  <span className="text-[14px] text-zinc-200 font-medium">noukha97.ops@gmail.com</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Sijhawm ua hauj lwm</span>
                  <span className="text-[12px] text-zinc-400 font-medium">Mon - Fri (9:00 AM - 5:00 PM ICT)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: FORM AREA */}
          <div className="col-span-12 lg:col-span-8 order-1 lg:order-2">
            <div className="relative group p-[2px] rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#6366f1_0%,transparent_25%,transparent_50%,#a855f7_75%,#6366f1_100%)] animate-[spin_6s_linear_infinite]" />
              <div className="relative bg-[#050508] rounded-[30px] p-[2px]">
                <div className="bg-[#050508]/90 rounded-[28px] p-8 md:p-10 text-left relative overflow-hidden">
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-2">Koj Lub Npe</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[14px] text-white outline-none focus:border-indigo-500/50 transition-all font-medium" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-2">Email Chaw Nyob</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[14px] text-white outline-none focus:border-indigo-500/50 transition-all font-medium" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-2">Lub Ntsiab Lus</label>
                      <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[14px] text-white outline-none focus:border-indigo-500/50 transition-all font-medium" placeholder="Credits top up tsis nce, etc..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-2">Nqe Lus Nug</label>
                      <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-transparent border border-white/10 rounded-xl py-3 px-4 text-[14px] text-white outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed font-medium" placeholder="Sau koj cov lus nug meej meej rau ntawm no..." />
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Response time: &lt; 24 Hours</span>
                      <button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto h-12 px-10 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center min-w-[160px]">
                        {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Send Message'}
                      </button>
                    </div>
                    {status === 'success' && (
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-[12px] font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                        🎉 Ua tsaug ntau bro! Peb twb tau txais koj cov lus lawm, tab tom coj koj rov qab mus rau Studio...
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}