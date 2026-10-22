'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  initialActive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
}

const PALETTE: readonly string[] = [
  'rgba(139, 124, 246, 0.42)', // Lavender
  'rgba(243, 168, 196, 0.44)', // Blush
  'rgba(52, 211, 153, 0.38)',  // Mint
  'rgba(246, 200, 159, 0.42)', // Peach
  'rgba(109, 92, 232, 0.35)'   // Indigo
];

export function InteractiveBackground({ initialActive = true }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(initialActive);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lingora-bg-fx');
      if (saved !== null) {
        setIsActive(saved === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleActive = () => {
    setIsActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lingora-bg-fx', String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isActive) return;

    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const particles: Particle[] = [];
    const COUNT = 36;

    function resize() {
      if (!cvs || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const color = PALETTE[i % PALETTE.length] ?? 'rgba(139, 124, 246, 0.42)';
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55 - 0.15,
          r: 2.2 + Math.random() * 4.2,
          color,
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.02
        });
      }
    }

    resize();
    createParticles();

    const handleResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    function stepFrame() {
      if (!ctx) return;
      tick += 0.012;
      ctx.clearRect(0, 0, w, h);

      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        // Soft interactive spotlight halo following cursor
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 220);
        grad.addColorStop(0, 'rgba(139, 124, 246, 0.11)');
        grad.addColorStop(0.5, 'rgba(243, 168, 196, 0.06)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gentle flowing sine wave ribbon in background
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 24) {
        const y = h * 0.52 + Math.sin(x * 0.0035 + tick) * 38 + Math.cos(x * 0.002 - tick * 0.7) * 22;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(139, 124, 246, 0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Update & draw particles + constellation links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;

        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.22;
        p.y += p.vy + Math.cos(p.phase) * 0.18;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Gentle repulsion from cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 1) {
            p.x -= (dx / dist) * 0.45;
            p.y -= (dy / dist) * 0.45;
          }
        }

        // Connect nearby particles with subtle constellation threads
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          if (!q) continue;

          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 18500) {
            const alpha = (1 - distSq / 18500) * 0.14;
            ctx.strokeStyle = `rgba(124, 92, 232, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        const pulseR = p.r + Math.sin(p.phase) * 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, pulseR), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(stepFrame);
    }

    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      animId = requestAnimationFrame(stepFrame);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);

  return (
    <>
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-mesh-grid" />
        <div className="bg-orbs">
          <span className="orb-1" />
          <span className="orb-2" />
          <span className="orb-3" />
          <span className="orb-4" />
          <span className="orb-5" />
        </div>
        {isActive && <canvas ref={canvasRef} className="bg-interactive-canvas" />}
      </div>

      <button
        type="button"
        onClick={toggleActive}
        className="bg-fx-toggle fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        title="Bật/Tắt hiệu ứng nền động 60fps"
        aria-label="Chuyển đổi hiệu ứng nền động"
      >
        <span className={`inline-block h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-slate-400'}`} />
        <span>Nền động: {isActive ? 'BẬT' : 'TẮT'}</span>
      </button>
    </>
  );
}
