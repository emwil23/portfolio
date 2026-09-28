"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cursor tracking for 3D character effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D parallax
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse position to rotation
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const translateY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse position between -0.5 and 0.5
      const normalizedX = (clientX / innerWidth) - 0.5;
      const normalizedY = (clientY / innerHeight) - 0.5;
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen bg-[var(--background)] overflow-hidden"
    >
      {/* Subtle Studio Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full px-6 py-6 sm:px-12 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-sm tracking-tighter uppercase text-[var(--text-primary)]">
            EW Studio
          </span>
        </div>
        
        <div className="hidden md:block font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          {time}
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Home</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Engineering</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Systems</span>
        </div>

        <a
          href="https://github.com/ewilly"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-widest transition-all font-bold"
        >
          <span>View GitHub</span>
        </a>
      </motion.nav>

      {/* Center 3D Character Canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ perspective: 1200 }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            transformStyle: "preserve-3d"
          }}
          className="relative w-full max-w-[900px] h-[85vh] flex items-center justify-center -mt-10"
        >
          {/* Floor Shadow */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[40%] h-[20px] bg-black/40 blur-2xl rounded-full" />
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <source src="/assets/character-coffee-v3.webm" type="video/webm" />
            <source src="/assets/character-coffee-v3.mp4" type='video/mp4; codecs="hvc1"' />
          </video>
        </motion.div>
      </motion.div>

      {/* Foreground Content HUD */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row items-end justify-between w-full gap-8">
          
          {/* Bottom Left: Huge Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-3xl pointer-events-auto"
          >
            <h1 className="font-display font-extrabold text-[13vw] sm:text-[10vw] xl:text-[140px] leading-[0.8] tracking-[-0.03em] uppercase text-[var(--text-primary)]">
              EMMANUEL <br/> WILSON
            </h1>
            <div className="mt-6 md:mt-8 font-mono text-xs sm:text-sm uppercase tracking-widest text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-4 max-w-md leading-relaxed">
              AI-First Full-Stack & Frontend Systems Engineer.
            </div>
          </motion.div>

          {/* Bottom Right: Telemetry HUD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 pointer-events-auto max-w-[340px] shrink-0 mb-2 md:mb-6"
          >
            <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
              </span>
              Telemetry HUD // SDE-2 Impact
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="group bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border-subtle)] p-4 rounded-xl hover:border-[var(--accent)] transition-colors shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Scaled enterprise platforms for <span className="text-[var(--accent-hover)] font-bold">150K–200K DAU</span>.
                </div>
              </div>
              
              <div className="group bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border-subtle)] p-4 rounded-xl hover:border-[var(--accent)] transition-colors shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Slashed production bundle footprints by <span className="text-[var(--accent-hover)] font-bold">60%</span> via a unified React and Vite migration.
                </div>
              </div>

              <div className="group bg-[var(--surface-1)]/40 backdrop-blur-md border border-[var(--border-subtle)] p-4 rounded-xl hover:border-[var(--accent)] transition-colors shadow-lg">
                <div className="text-[var(--text-primary)] font-sans text-sm leading-snug">
                  Accelerated personal programming velocity by <span className="text-[var(--accent-hover)] font-bold">up to 5x</span> using LLMs and AI workflows.
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
};
