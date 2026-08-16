'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ReplitPageTransition from '@/components/replit-academy/ReplitPageTransition';
import ConfettiEffect from '@/components/replit-academy/ConfettiEffect';
import { getStudentState } from '@/lib/replit-academy-data';
import { motion } from 'framer-motion';
import { Award, Download, Share2, CheckCircle2, ShieldCheck, Copy, Sparkles, Check, ExternalLink } from 'lucide-react';

export default function ReplitCertificatePage() {
  const [studentState] = useState(getStudentState());
  const [userName, setUserName] = useState('Beshoy Simon');
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eduverse_user_name');
    if (stored) setUserName(stored);

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getVerificationUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/verify/EV-RA-2026-B03ED280`;
    }
    return 'https://eduverse.com/verify/EV-RA-2026-B03ED280';
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(getVerificationUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkedInShare = () => {
    const url = getVerificationUrl();
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=600');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ReplitPageTransition>
      <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900 relative font-sans">
        {showConfetti && <ConfettiEffect />}

        {/* Top Navbar */}
        <div className="relative z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl print:hidden">
          <Navbar />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Action Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                ⭐ Official Academic Credential
              </span>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Verified Certificate of Completion</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
              </button>

              <button
                onClick={handleLinkedInShare}
                className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to LinkedIn</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-bold text-xs shadow-lg flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (300 DPI)</span>
              </button>
            </div>
          </div>

          {/* PRESTIGIOUS LANDSCAPE CERTIFICATE CANVAS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-16 rounded-3xl bg-[#FAFBFD] border-4 border-amber-800/20 shadow-2xl relative overflow-hidden text-[#0F172A] aspect-[1.414/1] max-w-5xl mx-auto flex flex-col justify-between"
          >
            {/* Elegant Double Line Corner Filigree */}
            <div className="absolute top-5 left-5 right-5 bottom-5 border-2 border-amber-700/25 pointer-events-none rounded-2xl" />
            <div className="absolute top-7 left-7 right-7 bottom-7 border border-amber-700/15 pointer-events-none rounded-xl" />

            {/* Corner Ornaments */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-amber-700/50" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-amber-700/50" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-amber-700/50" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-amber-700/50" />

            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-[450px] h-[450px] text-amber-900" />
            </div>

            <div className="relative z-10 text-center space-y-6">
              
              {/* HEADER */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-black text-xl shadow-md">
                    EV
                  </div>
                  <span className="text-2xl font-serif font-bold tracking-wider text-slate-900">EduVerse</span>
                </div>

                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                  Official Academic Certificate of Completion
                </div>

                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent mx-auto" />
              </div>

              {/* RECIPIENT TITLE */}
              <div className="py-2 space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-sans">
                  This digital credential is proudly presented to
                </p>
                
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                  {userName}
                </h2>

                <div className="w-48 h-0.5 bg-slate-300 mx-auto" />
              </div>

              {/* PROGRAM DESCRIPTION */}
              <div className="max-w-2xl mx-auto space-y-2 font-sans">
                <p className="text-sm text-slate-700 leading-relaxed">
                  for successfully mastering the curriculum, hands-on software projects, and capstone requirements in
                </p>
                
                <h3 className="text-2xl font-extrabold text-amber-900 tracking-wide">
                  Replit AI Academy
                </h3>

                <p className="text-xs text-slate-500 italic">
                  &quot;Master AI development by building real-world applications with Replit.&quot;
                </p>
              </div>

              {/* SKILLS MASTERED & ACHIEVEMENTS */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-600">
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold">🏅 AI Builder</span>
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold">🏅 Capstone Completed</span>
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold">🏅 Top Performer</span>
                <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold">🏅 Innovation Excellence</span>
              </div>
            </div>

            {/* FOOTER METADATA, EMBOSSED SEAL & DUAL SIGNATURES */}
            <div className="relative z-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-6 items-end text-left font-sans">
              
              {/* Verification Details */}
              <div className="space-y-1 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Verification Record</span>
                <span className="text-xs font-mono font-bold text-amber-900 block">{studentState.certificateId}</span>
                <span className="text-[10px] text-slate-500 block">Issued: August 2026</span>
                <span className="text-[10px] text-slate-500 block">Duration: 40+ Hours</span>
              </div>

              {/* Embossed Gold Foil Seal Badge */}
              <div className="flex flex-col items-center justify-center sm:col-span-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-xl border-2 border-amber-300 flex items-center justify-center text-white">
                  <div className="w-full h-full rounded-full border border-amber-200 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-br from-amber-600 to-amber-900">
                    <Award className="w-6 h-6 text-amber-200" />
                    <span className="text-[7px] uppercase font-bold tracking-tighter text-amber-100">Verified Seal</span>
                  </div>
                </div>
              </div>

              {/* QR Code SVG */}
              <div className="flex flex-col items-center justify-center sm:col-span-1">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <svg className="w-12 h-12 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 0h2v2h-2v-2z"/>
                  </svg>
                </div>
                <span className="text-[8px] text-slate-400 font-mono mt-1">Scan to Verify</span>
              </div>

              {/* Executive Signature */}
              <div className="sm:col-span-1 text-right space-y-1">
                <div className="font-serif italic text-lg text-amber-900">Beshoy Simon</div>
                <div className="text-xs font-bold text-slate-900">Beshoy Simon</div>
                <div className="text-[10px] text-slate-500">Founder & CEO, EduVerse</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ReplitPageTransition>
  );
}
