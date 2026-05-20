import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-950 border-b border-slate-900 py-4 px-6 flex justify-between items-center">
      {/* Lub Logo */}
      <Link href="/" className="text-xl font-bold text-white tracking-wider">
        NouAI<span className="text-purple-500">.app</span>
      </Link>

      {/* Cov Khawm Nias (Links Menu) */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">
          Dashboard
        </Link>
        <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition">
          Pricing
        </Link>
        
        {/* Ntsaws lub Khawm Tshiab No Rau Ntawm No Ntag Os Bro: */}
        <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition font-semibold">
          Contact Us
        </Link>
      </div>
    </nav>
  );
}