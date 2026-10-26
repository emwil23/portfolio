"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { Nav } from "@/components/Nav";
import { release } from "@/lib/boot";

const Stage = dynamic(() => import("@/components/Stage").then(m => m.Stage), { ssr: false });

export function StudyChrome() {
  const [showStage, setShowStage] = useState(false);
  useEffect(() => {
    release();
    const reveal = () => {
      if (window.scrollY > 200 && window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) {
        setShowStage(true);
        window.removeEventListener("scroll", reveal);
      }
    };
    window.addEventListener("scroll", reveal, { passive: true });
    return () => window.removeEventListener("scroll", reveal);
  }, []);
  return <MotionConfig reducedMotion="user"><Nav />{showStage && <Stage />}</MotionConfig>;
}
