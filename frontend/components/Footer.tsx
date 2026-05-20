"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        
        {/* Sab Laug: Copyright */}
        <div>
          <p>© {new Date().getFullYear()} NouAI Studio. All rights reserved.</p>
        </div>

        {/* Sab Xis: Cov Links Tseem CeeB rau Lemon Squeezy */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            href="/privacy" 
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <Link 
            href="/contact" 
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </footer>
  );
}