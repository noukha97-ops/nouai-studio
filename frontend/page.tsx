'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  // 🔗 Koj tus Backend Link uas koj hais tias work 100% ntawd
  const RUNPOD_URL = "https://mp3mt4yo331e7d-7860.proxy.runpod.net/";

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateVoice = async () => {
    if (!text.trim()) return alert("Sau ntawv Hmoob uantej!");
    setLoading(true);
    setAudioUrl('');

    try {
      // ✅ Hu Gradio Client raws li Backend API Documentation
      const { Client } = await import("@gradio/client");
      const client = await Client.connect(RUNPOD_URL);
      
      const result: any = await client.predict("/tts_generate", {
        gen_text: text,
        ref_audio: null,
        ref_text: "Kuv pom ib tug npauj npaim zoo nkauj heev li.",
        nfe_step: 32,
        speed: 0.9,
        cfg_strength: 2,
        cross_fade: 0.15,
        remove_silence: true,
        seed: -1,
        use_ipa: false,
      });

      if (result.data && result.data[0]) {
        setAudioUrl(result.data[0].url);
      }
    } catch (e) {
      console.error("Connect error:", e);
      alert("Error: Txuas tsis tau Backend! Xyuas seb koj puas tseem qhib lub tab RunPod WebUI tseg?");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main style={{ background: '#0a0514', color: 'white', minHeight: '100vh', padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '900', fontStyle: 'italic', color: '#818cf8', margin: 0 }}>NOUAI STUDIO</h1>
      <p style={{ color: '#6366f1', letterSpacing: '4px', fontSize: '10px', marginBottom: '40px' }}>BACKEND: /TTS_GENERATE</p>
      
      <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <textarea 
          style={{ width: '100%', height: '180px', background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '1.2rem', resize: 'none' }}
          placeholder="Sau koj cov lus Hmoob hauv no..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button 
            onClick={generateVoice} 
            disabled={loading} 
            style={{ padding: '16px 45px', borderRadius: '20px', background: 'white', color: 'black', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
          >
            {loading ? 'PROCESSING...' : 'GENERATE VOICE'}
          </button>
        </div>
      </div>

      {audioUrl && (
        <div style={{ marginTop: '40px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', padding: '25px', borderRadius: '30px', display: 'inline-block' }}>
          <audio src={audioUrl} controls autoPlay />
        </div>
      )}
    </main>
  );
}