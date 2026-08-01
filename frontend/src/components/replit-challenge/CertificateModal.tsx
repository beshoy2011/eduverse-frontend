'use client';

import React from 'react';
import { X, Award, ShieldCheck, Download, Share2, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  startupName?: string;
  issueDate?: string;
  onClose: () => void;
}

export default function CertificateModal({
  studentName,
  startupName = 'AuraMind AI',
  issueDate = 'August 2026',
  onClose
}: CertificateProps) {
  const hash = '0x8f4c2e91b703a51d904e28c73491f092e415b3c8';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.25)]">
        
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Cryptographically Verified EduVerse Certificate
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Document Body */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden text-center">
          
          {/* Certificate Ambient Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Border Frame */}
          <div className="relative p-8 sm:p-10 border-2 border-cyan-500/30 rounded-2xl bg-slate-950/60 backdrop-blur-xl shadow-2xl">
            
            {/* Header Logos */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
                <span className="text-2xl font-extrabold text-white tracking-tight">EduVerse</span>
              </div>
              <span className="text-xl font-light text-cyan-500">×</span>
              <span className="text-2xl font-black tracking-wider text-white">REPLIT</span>
            </div>

            <p className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold mb-2">
              Official Startup Accelerator Graduation Certificate
            </p>

            <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 my-4">
              CERTIFICATE OF MASTERY
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
              This certifies that the founder named below has successfully completed all 12 modules of the Replit AI Startup Builder Accelerator and deployed a production-grade AI startup.
            </p>

            {/* Recipient Name */}
            <div className="py-4 my-2 border-y border-cyan-500/20 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
                {studentName}
              </h2>
              <p className="text-xs font-mono text-emerald-400 font-bold mt-1">
                Founder of &quot;{startupName}&quot;
              </p>
            </div>

            {/* Verification Hash & Seals */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-6 border-t border-slate-800">
              
              {/* CEO Signature 1 */}
              <div className="text-center sm:text-left">
                <div className="font-serif italic text-lg text-cyan-300 font-bold">Amjad Masad</div>
                <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">CEO & Founder, Replit</p>
              </div>

              {/* Verified Badge Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-1 shadow-[0_0_25px_rgba(0,229,255,0.5)]">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-cyan-300" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold mt-2">VERIFIED FOUNDER</span>
              </div>

              {/* CEO Signature 2 */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic text-lg text-purple-300 font-bold">EduVerse Executive</div>
                <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Head of AI Accelerator</p>
              </div>

            </div>

            {/* Hash Footer */}
            <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Issue Date: {issueDate}</span>
              <span className="truncate max-w-xs">Hash: {hash}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
