'use client';

import React, { useState } from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import CertificateModal from '@/components/replit-challenge/CertificateModal';
import { ShieldCheck, Award, Download, ExternalLink } from 'lucide-react';

export default function CertificatesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic Proof Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Verifiable Credentials & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Every accelerator graduate receives a verifiable digital certificate signed by Replit & EduVerse leadership.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl max-w-2xl mx-auto space-y-6 text-center shadow-[0_0_50px_rgba(0,229,255,0.15)]">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-300">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Accelerator Graduation</span>
            <h2 className="text-2xl font-black text-white mt-1">Replit AI Startup Builder Certificate</h2>
            <p className="text-xs text-slate-400 mt-2">
              Issued upon completion of all 12 modules and deployment of an AI startup.
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>View Full Verified Certificate</span>
            </button>
          </div>
        </div>

      </main>

      {showModal && (
        <CertificateModal
          studentName="Elite Founder"
          startupName="AuraMind AI"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
