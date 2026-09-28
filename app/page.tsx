"use client";

import React, { useState, useEffect } from "react";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#18181B]" />;
  }

  return (
    <main className="relative min-h-screen bg-[#18181B] overflow-hidden">
      {/* Preloading Screen */}
      {!isReady && <Preloader onComplete={() => setIsReady(true)} />}

      {/* Hero Page */}
      <Hero isLoaded={isReady} />
    </main>
  );
}
