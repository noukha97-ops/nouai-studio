'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  LogOut, Zap, Download, Play, X, 
  ChevronDown, ChevronUp, Loader2, Clock, Search 
} from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [voiceId, setVoiceId] = useState('female_1');
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Khaws lub sijhawm ntsuas inactivity

  const MAX_CHARS = 300;
  const RUNPOD_URL = "https://mp3mt4yo331e7d-7860.proxy.runpod.net/"; 
  const LOGO_PATH = "/logo.png"; 
  const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 Feeb hloov ua milliseconds (1,200,000 ms)

  // 1. TSHUAB AUTHENTICATION GUARD (TIV THAIV NEW USER)
  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        handleUserSync(currentUser);
        fetchHistory(currentUser.uid);
      } else {
        // ✅ Yog tsis tau login (New User lossis session tas), ntiab mus rau nlooj login tam sim
        setUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. TSHUAB AUTO LOGOUT (INACTIVITY TIMEOUT FOR 20 MINUTES)
  useEffect(() => {
    if (!user) return; // Yog tsis tau login tsis thaus khiav lub tshuab ntsuas no

    // Lub tshuab rov pib suav lub sijhawm 20 feeb tshiab
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_LIMIT);
    };

    // Lub tshuab kos npe tawm thaum tsis muaj movment txog 20 feeb
    const handleAutoLogout = async () => {
      try {
        await signOut(auth);
        alert("Koj lub session tau tas lawm vim koj tsis tau txav mus los li ntawm 20 feeb. Thov login dua tshiab os bro!");
        router.push('/login');
      } catch (error) {
        console.error("Auto logout error:", error);
      }
    };

    // Mloog cov xwm txheej (Activities) hauv lub vev xaib
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Pib khiav lub tshuab suav lub sijhawm thawj zaug
    resetTimer();

    // Ntxiv cov kev mloog rau txhua lub event
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Huv si thaum hloov nlooj ntawv (Cleanup)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, router]);

  const handleUserSync = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { uid: currentUser.uid, email: currentUser.email, credits: 20, createdAt: new Date().toISOString() });
        setCredits(20);
      } else { setCredits(userSnap.data().credits || 0); }
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('audio_history')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setHistory(data);
    } catch (e) { console.error(e); }
  };

  const generateVoice = async () => {
    const cost = 5 + Math.floor(text.trim().length / 50);
    if (!text.trim()) {
      alert("Thov sau ntawv uantej tsim suab!");
      return;
    }
    if (credits < cost) {
      router.push('/payment');
      return;
    }
    if (text.length > MAX_CHARS || loading) return;
    setLoading(true);
    setAudioUrl('');
    try {
      const { Client } = await import("@gradio/client");
      const app = await Client.connect(RUNPOD_URL);
      const result: any = await app.predict("/tts_generate", {
        gen_text: text,
        ref_audio: null, 
        ref_text: "",    
        nfe_step: 64,
        speed: 1.0,
        cfg_strength: 2.5,
        cross_fade: 0.15,
        remove_silence: true,
        seed: -1,
        use_ipa: false,
      });
      if (result.data && result.data[0]) {
        const generatedAudioUrl = result.data[0].url;
        const audioResponse = await fetch(generatedAudioUrl);
        const audioBlob = await audioResponse.blob();
        const fileName = `hmong_${user!.uid}_${Date.now()}.wav`;
        await supabase.storage.from('nouai-audio').upload(fileName, audioBlob);
        const { data: signedData } = await supabase.storage.from('nouai-audio').createSignedUrl(fileName, 31536000);
        const finalUrl = signedData!.signedUrl;
        await supabase.from('audio_history').insert([{
          user_id: user!.uid,
          text_content: text,
          audio_url: finalUrl
        }]);
        await updateDoc(doc(db, 'users', user!.uid), { credits: increment(-cost) });
        setCredits(prev => prev - cost);
        setAudioUrl(finalUrl);
        fetchHistory(user!.uid); 
      }
    } catch (e: any) { 
      console.error(e);
      alert("Hais tsis tau: " + (e.message || "Unknown Error"));
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleHistoryAudio = (id: string) => {
    const audioEl = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (!audioEl) return;
    if (playingId === id) {
      audioEl.pause();
    } else {
      document.querySelectorAll('.history-audio').forEach((el: any) => {
        el.pause();
        el.currentTime = 0;
      });
      audioEl.play().catch(e => console.error(e));
    }
  };

  if (!mounted || !user) return null;

  return (
    <main className="h-screen w-full relative bg-[#0a0514] overflow-hidden flex flex-col">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a1d70] via-[#2d1b4d] to-[#0a0514]" />
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
      </div>

      {/* --- ✅ STICKY NAVBAR (FIXED TOP) --- */}
      <nav className="h-[72px] sticky top-0 w-full flex-none z-[100] border-b border-white/10 bg-[#1a0b2e]/60 backdrop-blur-2xl px-6 md:px-10 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <img src={LOGO_PATH} alt="Logo" className="w-10 h-10 rounded-full border border-white/20" />
          <span className="text-[14px] font-black tracking-widest italic text-white uppercase">NouAI Studio</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/payment')} className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-2xl hover:bg-indigo-500/20 transition-all">
             <span className="text-[10px] font-black text-indigo-300 uppercase">{credits} CR</span>
             <Zap size={12} className="text-indigo-400" />
          </button>
          <button onClick={handleSignOut} className="text-zinc-400 hover:text-red-400 transition-colors ml-2"><LogOut size={18} /></button>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10">
        <div className="max-w-[1100px] mx-auto p-4 md:p-10 grid grid-cols-12 gap-8 pb-40">
          
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <header className="flex justify-between items-end px-2 text-left">
              <h2 className="text-[22px] font-bold text-white italic uppercase tracking-tighter">Studio</h2>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 shadow-xl">
                 {['female_1', 'male_1'].map((id) => (
                   <button key={id} onClick={() => setVoiceId(id)} className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all ${voiceId === id ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>{id === 'female_1' ? 'Female' : 'Male'}</button>
                 ))}
              </div>
            </header>

            {/* --- EDITOR AREA --- */}
            <div className="relative group p-[2px] rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#6366f1_0%,transparent_25%,transparent_50%,#a855f7_75%,#6366f1_100%)] animate-[spin_6s_linear_infinite]" />
              <div className="relative bg-[#050508] rounded-[30px] p-[2px]">
                <div className="bg-[#050508]/90 rounded-[28px] p-8 md:p-10 text-left relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                    <img src={LOGO_PATH} alt="" className="w-40 md:w-56 grayscale opacity-[0.15] contrast-[1.1] brightness-[1.2]" />
                  </div>
                  <textarea 
                    style={{ fontSize: '16px' }} 
                    className="w-full h-40 md:h-48 bg-transparent outline-none resize-none leading-relaxed text-zinc-100 relative z-10 scrollbar-hide font-medium" 
                    placeholder="Sau koj cov lus Hmoob rau ntawm no..." 
                    value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value)} 
                  />
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-20">
                    <span className={`text-[10px] font-black uppercase ${credits < (5 + Math.floor(text.trim().length / 50)) ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`}>Cost: {5 + Math.floor(text.trim().length / 50)} CR</span>
                    <button onClick={generateVoice} disabled={loading || text.length < 5} className="h-10 px-8 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Generate'}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- AUDIO PLAYER --- */}
            {audioUrl && (
              <div className="bg-gradient-to-r from-indigo-600/80 to-purple-700/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-center shadow-xl animate-in zoom-in">
                <audio controls key={audioUrl} className="flex-1 h-10"><source src={audioUrl} type="audio/mpeg" /></audio>
                <a href={audioUrl} download="hmong-voice.mp3" className="ml-6 h-12 px-8 bg-white text-black rounded-xl flex items-center justify-center font-black text-[10px] uppercase shadow-lg hover:bg-zinc-200 transition-all">Download</a>
              </div>
            )}

            {/* --- HISTORY --- */}
            <div className="mt-12 space-y-4">
              <div className="flex justify-center">
                <button onClick={() => setIsHistoryExpanded(!isHistoryExpanded)} className="w-full md:w-[400px] flex items-center justify-center gap-4 px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] hover:bg-white/10 transition-all group backdrop-blur-xl">
                  <Clock size={16} className="text-white/30" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">Audio History ({history.length})</h3>
                  {isHistoryExpanded ? <ChevronUp size={20} className="text-white/20" /> : <ChevronDown size={20} className="text-white/20" />}
                </button>
              </div>

              <div className={`space-y-4 transition-all duration-500 overflow-hidden ${isHistoryExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex justify-center px-4">
                  <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="text"
                      placeholder="Tshawb nrhiav history..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-[13px] text-white outline-none focus:border-white/20 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 px-2">
                  {history.filter(h => h.text_content?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/5 p-5 rounded-[24px] flex justify-between items-center backdrop-blur-md hover:bg-white/10 transition-all text-left">
                      <audio id={`audio-${item.id}`} className="history-audio hidden" src={item.audio_url} onEnded={() => setPlayingId(null)} onPlay={() => setPlayingId(item.id)} onPause={() => setPlayingId(null)} />
                      <div className="flex-1 pr-6 overflow-hidden min-w-0">
                        <p className="text-[13px] text-white/70 line-clamp-1 italic mb-0.5 tracking-tight font-medium">{item.text_content}</p>
                        <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => toggleHistoryAudio(item.id)} className={`h-11 w-11 flex items-center justify-center rounded-full transition-all shadow-lg ${playingId === item.id ? 'bg-indigo-500 text-white animate-pulse' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white'}`}>
                          {playingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                        </button>
                        <a href={item.audio_url} download className="h-11 w-11 flex items-center justify-center bg-white/5 text-white/40 rounded-full hover:bg-white hover:text-black transition-all shadow-md"><Download size={16} /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-[30px] bg-white/5 border border-white/10 p-12 shadow-2xl text-center relative overflow-hidden group hover:bg-white/10 transition-all backdrop-blur-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-all duration-700"><Zap size={80} className="text-indigo-400" /></div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-8 italic relative z-10">Balance</p>
               <h4 className="text-6xl font-black text-indigo-400 mb-8 italic relative z-10 leading-none tracking-tighter">{credits}</h4>
               <button onClick={() => router.push('/payment')} className="relative z-10 w-full py-5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 flex items-center justify-center gap-2 transition-all hover:bg-indigo-500 hover:text-white">Topup Credits</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}