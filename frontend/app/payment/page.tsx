'use client';

import React from 'react';

export default function PaymentPage() {
  //ดึง URL มาจาก .env
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;

  const packages = [
    {
      id: 1,
      name: "Starter Pack",
      credits: 100,
      price: "$9.99",
      description: "Haum rau cov pib sim siv NouAI",
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: 2,
      name: "Pro Pack",
      credits: 500,
      price: "$39.99",
      description: "Rau cov uas siv ntau thiab niaj hnub",
      color: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-5 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
          NouAI <span className="text-indigo-500">Credits</span>
        </h1>
        <p className="text-zinc-500 text-lg">Xaiv pob Credits txhawm rau pib siv koj lub AI Studio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="group relative bg-zinc-900/50 border border-white/10 p-1 rounded-[40px] overflow-hidden hover:border-indigo-500/50 transition-all duration-500"
          >
            <div className="p-10 flex flex-col items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">
                {pkg.name}
              </h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-7xl font-black tracking-tighter text-white">
                  {pkg.credits}
                </span>
                <span className="text-zinc-500 font-bold uppercase">Credits</span>
              </div>
              <p className="text-2xl font-bold mb-8">{pkg.price}</p>
              
              <ul className="text-zinc-400 text-sm space-y-3 mb-10 text-center">
                <li>• {pkg.description}</li>
                <li>• Tsis muaj hnub tas sijhawm</li>
                <li>• Khiav ceev (High Speed API)</li>
              </ul>

              {/* Khawm nias mus Checkout */}
              <a 
                href={checkoutUrl}
                className={`w-full py-5 rounded-[25px] font-black uppercase text-center bg-gradient-to-r ${pkg.color} hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20`}
              >
                Buy Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}