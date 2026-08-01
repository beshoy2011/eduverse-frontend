'use client';

import React, { useState } from 'react';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import { Award, ShieldCheck, QrCode, Download, Share2, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export default function CertificatesPage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);
  const [verified, setVerified] = useState(true);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 z-10 w-full">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verifiable Credential</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Verified AI Certificate
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Issued by EduVerse AI Innovation Ecosystem & signed by our research board.
          </p>
        </div>

        {/* Certificate Card Wrapper */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#00E5FF]/40 shadow-2xl shadow-[#00E5FF]/10 relative overflow-hidden space-y-8">
          
          {/* Certificate Inner Frame */}
          <div className="border-2 border-dashed border-[#00E5FF]/30 rounded-2xl p-6 sm:p-10 space-y-6 text-center bg-[#090D16]/90 relative">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-[#00E5FF]" />
                <span className="font-heading font-extrabold text-lg text-white">EduVerse</span>
              </div>
              <span className="font-num text-[10px] text-slate-400">ID: EV-2026-8942-X</span>
            </div>

            <div className="py-4 space-y-3">
              <span className="text-xs uppercase tracking-widest font-heading font-bold text-[#00E5FF]">
                Certificate of Completion & AI Founder Mastery
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
                Alex Rivera
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                has successfully passed the auto-graded final examination with a score of <span className="text-emerald-400 font-bold font-num">98%</span> and launched a production AI startup <span className="text-[#00E5FF] font-bold">NexusAI</span> on the:
              </p>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-gradient-cyan-purple pt-2">
                Full-Stack AI SaaS Founder Specialization Track
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Issue Date</span>
                <span className="font-bold text-white font-num">August 1, 2026</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Verification Hash</span>
                <span className="font-mono text-[10px] text-[#00E5FF] truncate block">0x8F9A4B2C...7E1D</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-end space-x-2">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1">
                  <QrCode className="w-8 h-8 text-[#00E5FF]" />
                </div>
                <div className="text-[10px] text-slate-400">
                  <span className="block font-bold text-emerald-400">VERIFIED</span>
                  <span>Scan to check</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-slate-300 font-mono">Authenticity Verified on Blockchain</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => alert("Certificate PDF downloaded successfully!")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-heading font-bold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => alert("LinkedIn Certificate URL copied to clipboard!")}
                className="px-4 py-2.5 rounded-xl glass-card text-white font-bold text-xs hover:bg-white/10 flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4 text-[#00E5FF]" />
                <span>Share to LinkedIn</span>
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
