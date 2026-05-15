'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase'; // <--- Check kab no kom zoo, nws yuav tsum tsis liab lawm

export default function UserEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <span className="text-indigo-400 font-mono text-[10px] lowercase tracking-tight">
      {email || "Guest"}
    </span>
  );
}