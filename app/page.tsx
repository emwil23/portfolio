"use client";

import React, { useState } from "react";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#18181B] overflow-hidden">
      {/* Preloading Screen */}
      {!isReady && <Preloader onComplete={() => setIsReady(true)} />}

      {/* Hero Page */}
      <Hero isLoaded={isReady} />
    </main>
  );
}
