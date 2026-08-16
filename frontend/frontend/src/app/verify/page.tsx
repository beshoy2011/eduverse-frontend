'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CertificateVerifySearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/verify/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans select-none">
      <Navbar />

      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center space-y-8 font-mono-code">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>EduVerse Public Credential Verification Protocol</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Official Credential Authenticity
        </h1>

        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
          Enter any issued Certificate UUID or Credential Token (e.g. <code className="text-cyan-400 font-mono-code bg-[#0d111a] px-2 py-0.5 rounded border border-[#1e2638]">EV-RA-2026-B03ED280</code>) to audit credential validity on core EduVerse nodes.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Enter Certificate UUID or Token..."
              className="edu-input text-xs pl-10 py-3 font-mono-code"
            />
          </div>
          <button
            type="submit"
            className="edu-btn edu-btn-primary py-3 px-6 text-xs w-full sm:w-auto"
          >
            Audit Credential
          </button>
        </form>

        <div className="pt-8 border-t border-[#1e2638] max-w-lg mx-auto text-xs space-y-3">
          <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
            Sample Credential Lookups:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/verify/EV-RA-2026-B03ED280"
              className="edu-btn edu-btn-secondary text-xs text-emerald-400"
            >
              ✓ Verified Sample Credential
            </Link>

            <Link
              href="/verify/EV-RA-2026-REVOKED"
              className="edu-btn edu-btn-secondary text-xs text-rose-400"
            >
              ⚠️ Revoked Sample Credential
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
