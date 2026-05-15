'use client';

// 1. IMPORT RAU SAUM TOJ KAWG NKAUS
import UserDashboardInfo from '../components/UserDashboardInfo';
import UserEmail from '../components/UserEmail';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white p-6 relative">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic">
            N
          </div>
          <div>
  <h1 className="text-sm font-black uppercase">NouAI Studio</h1>
  <UserEmail /> 
</div>
        </div>
        
        {/* Ntu khawm Credit balance saum toj sab xis hauv koj daim duab */}
        <div className="flex items-center gap-4">
           {/* Yog tias koj xav kom Credits tshwm ntawm no thiab, koj ntsaws <UserDashboardInfo /> rau no ntxiv los tau */}
        </div>
      </header>

      {/* --- KOJ LUB STUDIO UI QUB ... --- */}
      <main className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 mt-20 justify-center">
         {/* UI Box Studio ... */}
      </main>

    </div>
  );
}