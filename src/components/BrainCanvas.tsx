'use client';

import React, { useEffect, useRef } from 'react';

interface BrainNode {
  ox: number;
  oy: number;
  oz: number;
  color: string;
  baseSize: number;
  pulsePhase: number;
  pulseSpeed: number;
  isAmber: boolean;
  isBrightCore: boolean;
}

interface SynapsePulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export default function BrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 680);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Generate ~780 ultra-dense, tightly clustered continuous brain nodes
    const nodes: BrainNode[] = [];
    const numCortex = 640;

    // Use regular Fibonacci spherical lattice for uniform ultra-dense packing
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numCortex; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numCortex);

      const baseR = 210 + (i % 3) * 3; // Ultra tight radial variance
      
      // High-frequency realistic brain sulci & gyri folds
      const fold1 = Math.sin(theta * 7) * Math.cos(phi * 6) * 15;
      const fold2 = Math.sin(theta * 12 + phi * 9) * 8;
      const fold3 = Math.cos(theta * 4) * 6;
      const r = baseR + fold1 + fold2 + fold3;

      let x = r * Math.sin(phi) * Math.cos(theta) * 0.95;
      let y = r * Math.cos(phi) * 0.82;
      let z = r * Math.sin(phi) * Math.sin(theta) * 1.18; // Elongated human sagittal axis

      // Medial longitudinal fissure between left and right hemispheres
      if (Math.abs(x) < 30) {
        x *= 0.52;
        y += 14;
      } else {
        x += Math.sign(x) * 15;
      }

      // Temporal lobes (lateral-inferior bulge)
      if (y > -15 && y < 65 && Math.abs(x) > 85 && z > -30 && z < 75) {
        x *= 1.14;
      }

      // Frontal lobe curved forward expansion
      if (z > 80) {
        y *= 0.94;
        x *= 0.96;
      }

      // Flatten inferior base
      if (y > 85) {
        y = 85 + (y - 85) * 0.3;
      }

      const isAmber = Math.random() > 0.93;
      const isIris = Math.random() > 0.15;
      const isBrightCore = Math.random() > 0.65;

      nodes.push({
        ox: x,
        oy: y,
        oz: z,
        color: isAmber ? '#ffb829' : isIris ? '#8052ff' : '#ffffff',
        baseSize: isAmber ? 3.0 : isBrightCore ? 2.4 : 1.7,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        isAmber,
        isBrightCore
      });
    }

    // Cerebellum: Ultra-dense layered lower posterior nodes
    const numCerebellum = 100;
    for (let i = 0; i < numCerebellum; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.PI * 0.54 + ((i / numCerebellum) * Math.PI * 0.36);
      const r = 90 + (i % 4) * 3;
      const x = (r * 0.82) * Math.sin(phi) * Math.cos(theta);
      const y = (r * 0.68) * Math.cos(phi) + 90;
      const z = (r * 0.82) * Math.sin(phi) * Math.sin(theta) - 120;

      nodes.push({
        ox: x,
        oy: y,
        oz: z,
        color: i % 4 === 0 ? '#ffb829' : '#8052ff',
        baseSize: 1.9,
        pulsePhase: Math.random() * Math.PI,
        pulseSpeed: 0.025,
        isAmber: i % 4 === 0,
        isBrightCore: true
      });
    }

    // Brainstem: Central spinal column
    for (let i = 0; i < 40; i++) {
      const h = i * 2.8;
      const angle = i * 0.55;
      const rad = 11 + Math.sin(i * 0.4) * 3;
      const x = Math.cos(angle) * rad;
      const y = 92 + h;
      const z = -35 + Math.sin(angle) * rad - h * 0.2;

      nodes.push({
        ox: x,
        oy: y,
        oz: z,
        color: '#ffb829',
        baseSize: 2.4,
        pulsePhase: i * 0.25,
        pulseSpeed: 0.04,
        isAmber: true,
        isBrightCore: true
      });
    }

    // Active luminous action potential impulses
    const pulses: SynapsePulse[] = [];
    for (let i = 0; i < 35; i++) {
      pulses.push({
        fromIdx: Math.floor(Math.random() * nodes.length),
        toIdx: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02
      });
    }

    let rotX = 0.22;
    let rotY = -0.3;
    let targetRotX = 0.22;
    let targetRotY = -0.3;
    let mouseX = -9999;
    let mouseY = -9999;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      if (localX >= 0 && localX <= width && localY >= 0 && localY <= height) {
        mouseX = localX;
        mouseY = localY;
      } else {
        mouseX = -9999;
        mouseY = -9999;
      }

      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotY = (x / width) * 1.3;
      targetRotX = -(y / height) * 0.75;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const fov = 480;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.018;

      if (!prefersReducedMotion) {
        rotY += (targetRotY - rotY) * 0.05 + 0.003;
        rotX += (targetRotX - rotX) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 14;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Project 3D nodes
      const projected = nodes.map((node, idx) => {
        // Rotate Y
        let x1 = node.ox * cosY + node.oz * sinY;
        let y1 = node.oy;
        let z1 = -node.ox * sinY + node.oz * cosY;

        // Rotate X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Cortical micro-pulse
        const breath = Math.sin(time * node.pulseSpeed * 40 + node.pulsePhase) * 3.5;
        x2 += (x2 / 180) * breath;
        y2 += (y2 / 180) * breath;
        z2 += (z2 / 180) * breath;

        const scale = fov / (fov + z2 + 250);
        const px = cx + x2 * scale;
        const py = cy + y2 * scale;

        // Proximity glow excitation
        let proximityBoost = 0;
        if (mouseX > 0) {
          const dxm = px - mouseX;
          const dym = py - mouseY;
          const distMouse = Math.sqrt(dxm * dxm + dym * dym);
          if (distMouse < 115) {
            proximityBoost = (1 - distMouse / 115) * 0.85;
          }
        }

        // Extremely bright luminous values for continuous glowing brain look
        const alpha = Math.max(0.35, Math.min(1, (z2 + 250) / 380)) + proximityBoost;

        return {
          idx,
          px,
          py,
          z: z2,
          color: node.color,
          size: node.baseSize * scale * (1 + proximityBoost * 0.7),
          alpha: Math.min(1, alpha),
          isAmber: node.isAmber,
          isBrightCore: node.isBrightCore,
          proximityBoost,
          scale
        };
      });

      // Depth sort
      projected.sort((a, b) => a.z - b.z);

      const projMap = new Map<number, typeof projected[0]>();
      projected.forEach(p => projMap.set(p.idx, p));

      // 1. Draw tight, dense connection web
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i += 2) {
        for (let j = i + 1; j < Math.min(projected.length, i + 12); j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const distSq = dx * dx + dy * dy;

          if (distSq < 850) { // ~29px very tight reach for dense surface mesh
            const dist = Math.sqrt(distSq);
            let lineAlpha = (1 - dist / 29) * 0.42 * Math.min(projected[i].alpha, projected[j].alpha);
            
            if (projected[i].proximityBoost > 0 || projected[j].proximityBoost > 0) {
              lineAlpha = Math.min(1, lineAlpha + 0.5);
            }

            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 105, 255, ${lineAlpha})`;
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // 2. Draw tightly clustered glowing nodes
      for (const p of projected) {
        const radius = Math.max(1.1, p.size);

        // Radiant halo for dense luminous surface
        if (p.isBrightCore || p.isAmber || p.proximityBoost > 0.2) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, radius * 2.2, 0, Math.PI * 2);
          if (p.isAmber) {
            ctx.fillStyle = `rgba(255, 184, 41, ${p.alpha * 0.4})`;
          } else {
            ctx.fillStyle = `rgba(128, 82, 255, ${p.alpha * 0.45})`;
          }
          ctx.fill();
        }

        // Crisp node center
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);

        if (p.isAmber) {
          ctx.fillStyle = `rgba(255, 205, 70, ${p.alpha})`;
          ctx.shadowColor = '#ffb829';
          ctx.shadowBlur = 14;
        } else if (p.color === '#8052ff') {
          ctx.fillStyle = p.isBrightCore 
            ? `rgba(225, 210, 255, ${p.alpha})` 
            : `rgba(155, 115, 255, ${p.alpha})`;
          ctx.shadowColor = '#8052ff';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
        }

        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // 3. Draw active high-intensity synaptic impulses
      pulses.forEach(pulse => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.fromIdx = Math.floor(Math.random() * nodes.length);
          pulse.toIdx = Math.floor(Math.random() * nodes.length);
        }

        const pA = projMap.get(pulse.fromIdx);
        const pB = projMap.get(pulse.toIdx);

        if (pA && pB) {
          const dx = pB.px - pA.px;
          const dy = pB.py - pA.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            const ix = pA.px + dx * pulse.progress;
            const iy = pA.py + dy * pulse.progress;
            const pulseAlpha = Math.sin(pulse.progress * Math.PI);

            ctx.beginPath();
            ctx.arc(ix, iy, 3.2 * pA.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 230, 120, ${pulseAlpha * 0.95})`;
            ctx.shadowColor = '#ffb829';
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[580px] sm:h-[660px] lg:h-[740px] flex items-center justify-center select-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />
      {/* Editorial Cognitive State Tag */}
      <div className="absolute bottom-4 left-4 font-mono-code text-[11px] text-[#9a9a9a] flex items-center gap-2 border border-white/10 px-3 py-1.5 bg-black/80 backdrop-blur-sm pointer-events-none">
        <span className="status-led status-led-iris"></span>
        <span className="text-white font-bold tracking-wider uppercase">ULTRA-DENSE CORTICAL MATRIX</span>
        <span className="text-white/20">|</span>
        <span className="text-[#8052ff]">780+ SYNAPSE NODES</span>
      </div>
    </div>
  );
}
