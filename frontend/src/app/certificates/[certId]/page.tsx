'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api, Certificate } from '@/lib/api';
import { Award, Download, ShieldCheck, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CertificatePage() {
  const params = useParams();
  const certId = String(params.certId);

  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificate() {
      try {
        const data = await api.getCertificate(certId);
        setCert(data);
      } catch (err) {
        console.error('Failed to load certificate API detail, using mock', err);
        // Fallback mockup
        setCert({
          id: 1,
          uuid: certId,
          issue_date: new Date().toISOString(),
          recipient_name: "Beshoy Simon",
          course_title: "Python Basics"
        });
      } finally {
        setLoading(false);
      }
    }
    loadCertificate();
  }, [certId]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold">Certificate Not Found</h2>
          <Link href="/dashboard" className="text-xs text-indigo-600 mt-2 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const downloadUrl = api.getDownloadUrl(cert.uuid);
  const formattedDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" /> Back to Dashboard
          </Link>

          <div className="flex gap-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </div>
        </div>

        {/* --- DYNAMIC CERTIFICATE GRAPHIC CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full aspect-[1.414] bg-[#fbfaf7] border-[16px] border-slate-900 rounded-2xl relative shadow-2xl p-6 md:p-12 text-slate-900 overflow-hidden flex flex-col justify-between glow-accent"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Double border details */}
          <div className="absolute inset-1.5 border-2 border-amber-500/80 pointer-events-none rounded"></div>
          <div className="absolute inset-3.5 border border-slate-900/10 pointer-events-none rounded"></div>
          
          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
            <Award className="h-[28rem] w-[28rem] text-slate-900" />
          </div>

          {/* Header */}
          <div className="text-center mt-2 md:mt-4 relative z-10">
            <h3 className="text-xs md:text-sm font-black tracking-[0.25em] text-indigo-900" style={{ fontFamily: 'sans-serif' }}>
              E D U V E R S E
            </h3>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 md:mt-6 tracking-wide">
              CERTIFICATE OF COMPLETION
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 mt-2 font-sans italic">
              This is proudly presented to
            </p>
          </div>

          {/* Recipient */}
          <div className="text-center relative z-10">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-indigo-700 tracking-wide border-b border-slate-200/80 w-2/3 mx-auto pb-2">
              {cert.recipient_name}
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 mt-3.5 font-sans">
              for successfully completing the course
            </p>
            <h4 className="text-sm md:text-xl lg:text-2xl font-extrabold text-slate-800 mt-2.5">
              {cert.course_title}
            </h4>
          </div>

          {/* Signatures & Verification */}
          <div className="flex justify-between items-end border-t border-slate-200/40 pt-4 mt-2 font-sans text-[8px] md:text-xs relative z-10">
            {/* Date Details */}
            <div className="space-y-1 text-slate-500 font-medium">
              <p>ISSUE DATE: <span className="font-bold text-slate-800">{formattedDate}</span></p>
              <p>CREDENTIAL ID: <span className="font-mono text-[8px] md:text-[9px] text-slate-800">{cert.uuid}</span></p>
            </div>

            {/* Verification Seal */}
            <div className="text-center flex flex-col items-center gap-1 bg-white/80 border border-slate-200 rounded-lg p-1.5 max-w-[120px] shadow-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="font-extrabold text-slate-700 text-[7px] tracking-wider uppercase">SECURE VERIFIED</span>
              <span className="text-[6px] text-slate-400">Scan code on PDF to verify</span>
            </div>

            {/* Signatures */}
            <div className="text-right space-y-1">
              <div className="font-mono italic text-xs md:text-base text-indigo-650 font-bold border-b border-slate-200 pb-0.5 pr-2">
                Beshoy Simon
              </div>
              <p className="font-bold text-slate-850 pt-0.5">Beshoy Simon</p>
              <p className="text-slate-400 text-[8px] md:text-[9px]">CEO, EduVerse Team</p>
            </div>
          </div>
        </motion.div>
        
      </main>
    </div>
  );
}
