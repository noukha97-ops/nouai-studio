'use client';

import { useState } from 'react';
import { Loader2, Mic, ArrowLeft, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ASRPage() {
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const router = useRouter();

  const handleTranscribe = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    setTranscription(''); 
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 🔗 !!! HLOOV TUS URL HAUV QAB NO UA KOJ TUS TSHIAB !!!
      const RUNPOD_URL = 'https://4ur6201uq1izmn-8000.proxy.runpod.net'; 
      
      const response = await fetch(`${RUNPOD_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('RunPod connection failed');

      const data = await response.json();
      
      if (data.error) {
        alert("AI Error: " + data.error);
      } else {
        setTranscription(data.text);
      }
    } catch (error) {
      console.error("Transcription Error:", error);
      alert("Txhais tsis tau! Xyuas seb RunPod puas tseem khiav thiab xyuas tus URL kom raug.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06040a] text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-8">
        <button 
          onClick={() => router.push('/')} 
          className="group mb-8 flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Studio
        </button>

        <div className="space-y-2 mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent">
            Hmong ASR
          </h1>
          <p className="text-indigo-400/60 text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em]">
            Neural Audio Processing Studio
          </p>
        </div>

        <div className="relative bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 text-center shadow-2xl backdrop-blur-3xl overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none" />
          
          <input 
            type="file" 
            id="audio-upload" 
            className="hidden" 
            onChange={handleTranscribe} 
            accept="audio/*" 
          />
          
          <label htmlFor="audio-upload" className="cursor-pointer group flex flex-col items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-500 relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              {isTranscribing ? (
                <Loader2 className="animate-spin text-indigo-400" size={48} />
              ) : (
                <Mic size={48} className="text-white group-hover:text-indigo-400 transition-colors" />
              )}
            </div>
            
            <div className="space-y-3">
              <span className="block font-black uppercase text-[14px] tracking-[0.3em] text-zinc-400 group-hover:text-white transition-colors">
                {isTranscribing ? 'Processing Neural Audio...' : 'Drop Hmong Audio Here'}
              </span>
              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest">
                <span>MP3</span> • <span>WAV</span> • <span>M4A</span>
              </div>
            </div>
          </label>

          {transcription && (
            <div className="mt-12 p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/20 text-left animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <Volume2 size={14} className="text-indigo-400" />
                <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Speech Result</span>
              </div>
              <p className="text-2xl md:text-3xl leading-tight italic font-medium text-white/90 selection:bg-indigo-500">
                {transcription}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 opacity-20">
          <div className="h-[1px] w-12 bg-white" />
          <p className="text-[9px] uppercase tracking-[0.5em] font-bold">Nou AI Engine v2.0</p>
          <div className="h-[1px] w-12 bg-white" />
        </div>
      </div>
    </main>
  );
}