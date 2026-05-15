'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Taug kev: Tawm ntawm components -> mus rau lib

export default function UserDashboardInfo() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | string>("...");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        try {
          const res = await fetch(`/api/get-credits?email=${user.email}`);
          const data = await res.json();
          setCredits(data.credits);
        } catch (err) {
          console.error("Fetch error");
        }
      } else {
        setUserEmail("Guest User");
        setCredits(0);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-start bg-black/20 p-1 rounded-md border border-white/5">
      <p className="text-[9px] text-indigo-400 font-mono lowercase leading-none">
        {userEmail}
      </p>
      <p className="text-[10px] font-bold text-white leading-none mt-1">
        {credits} Credits
      </p>
    </div>
  );
}