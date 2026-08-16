'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ReplitBackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#07111F]">
      
      {/* ELECTRIC CYAN AURORA LIGHT WAVE 1 */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.6, 0.35],
          x: [0, 80, -40, 0],
          y: [0, -40, 30, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-48 -left-40 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#00D4FF]/40 via-[#7C3AED]/25 to-transparent blur-[140px]"
      />

      {/* DEEP VIOLET AURORA LIGHT WAVE 2 */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.25, 0.5, 0.25],
          x: [0, -90, 50, 0],
          y: [0, 60, -40, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#7C3AED]/45 via-[#00D4FF]/20 to-transparent blur-[150px]"
      />

      {/* ELECTRIC AMBER GLOW WAVE 3 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
          x: [0, 60, -60, 0],
          y: [0, -50, 50, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-48 left-1/3 w-[850px] h-[850px] rounded-full bg-gradient-to-tr from-[#FF8A00]/30 via-[#00D4FF]/15 to-transparent blur-[160px]"
      />

      {/* Animated Glowing Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(0, 212, 255, 0.8) 1.5px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* FLOATING 3D GLASS MESH SHAPES */}
      <motion.div
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-32 right-24 w-28 h-28 rounded-3xl border border-[#00D4FF]/30 bg-gradient-to-br from-[#00D4FF]/10 to-transparent backdrop-blur-md hidden xl:block shadow-[0_0_30px_rgba(0,212,255,0.15)]"
      />

      <motion.div
        animate={{ rotate: -360, y: [0, 25, 0] }}
        transition={{ rotate: { duration: 50, repeat: Infinity, ease: 'linear' }, y: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-2/3 left-16 w-36 h-36 rounded-[2.5rem] border border-[#7C3AED]/30 bg-gradient-to-br from-[#7C3AED]/10 to-transparent backdrop-blur-md hidden xl:block shadow-[0_0_35px_rgba(124,58,237,0.15)]"
      />

      {/* Minimal Code Floating Badges */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.8, y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 right-1/4 hidden lg:block font-mono text-xs text-[#00D4FF] p-3.5 rounded-xl border border-[#00D4FF]/30 bg-[#0E1A2B]/80 backdrop-blur-xl shadow-xl"
      >
        <code>const agent = new ReplitAgent({'{'} model: "gpt-4o", workspace: "AI Lab" {'}'});</code>
      </motion.div>
    </div>
  );
}
