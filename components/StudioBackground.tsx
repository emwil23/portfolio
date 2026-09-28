"use client";

import React from "react";

export interface StudioBackgroundProps {
  children?: React.ReactNode;
  variant?: "light" | "dark" | "auto";
  spotlightPosition?: "center" | "center-top" | "right" | "left";
  showFloorShadow?: boolean;
  showGrain?: boolean;
  showVignette?: boolean;
  className?: string;
}

/**
 * Reusable 3D Studio Cyclorama / Infinity Cove Background.
 * Matches the warm-neutral studio lighting, soft radial falloff,
 * floor plane horizon, and filmic micro-grain from character 3D renders.
 */
export const StudioBackground: React.FC<StudioBackgroundProps> = ({
  children,
  variant = "light",
  spotlightPosition = "center",
  showFloorShadow = true,
  showGrain = true,
  showVignette = true,
  className = "",
}) => {
  // Spotlight coordinates based on position prop
  const positionCoords = {
    center: "50% 45%",
    "center-top": "50% 30%",
    right: "70% 45%",
    left: "30% 45%",
  }[spotlightPosition];

  const isLight = variant === "light";
  const isDark = variant === "dark";

  return (
    <div
      className={`relative w-full overflow-hidden transition-colors duration-500 ${
        isLight
          ? "bg-[#E6E6E9] text-[#18181B]"
          : isDark
          ? "bg-[#18181B] text-[#F9FAFB]"
          : "bg-[#E6E6E9] dark:bg-[#18181B] text-[#18181B] dark:text-[#F9FAFB]"
      } ${className}`}
    >
      {/* 1. Cyclorama Base Curve: Simulates the vertical infinity cove wall-to-floor transition */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? "linear-gradient(180deg, #EBECEE 0%, #E2E3E6 65%, #DADBE0 100%)"
            : isDark
            ? "linear-gradient(180deg, #1C1C20 0%, #18181B 65%, #121215 100%)"
            : undefined,
        }}
      />

      {/* 2. Primary Studio Keylight (Softbox Radial Beam) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? `radial-gradient(ellipse 70% 60% at ${positionCoords}, #F4F4F6 0%, #E3E4E8 55%, transparent 100%)`
            : isDark
            ? `radial-gradient(ellipse 70% 60% at ${positionCoords}, rgba(39, 39, 42, 0.8) 0%, rgba(24, 24, 27, 0.4) 60%, transparent 100%)`
            : undefined,
        }}
      />

      {/* 3. Subtle Ambient Light Bounce (Ground Horizon Reflection) */}
      <div
        className="absolute bottom-0 inset-x-0 h-1/2 pointer-events-none"
        style={{
          background: isLight
            ? "linear-gradient(0deg, rgba(215, 216, 222, 0.7) 0%, rgba(230, 231, 236, 0.3) 50%, transparent 100%)"
            : isDark
            ? "linear-gradient(0deg, rgba(14, 14, 16, 0.8) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)"
            : undefined,
        }}
      />

      {/* 4. Optional Contact Floor Shadow Plane */}
      {showFloorShadow && (
        <div
          className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[75%] max-w-2xl h-14 pointer-events-none blur-2xl rounded-full"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(30, 30, 36, 0.14) 0%, rgba(50, 50, 60, 0.04) 60%, transparent 100%)"
              : isDark
              ? "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0, 0, 0, 0.45) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 100%)"
              : undefined,
          }}
        />
      )}

      {/* 5. Studio Perimeter Vignette Falloff */}
      {showVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.08) 100%)",
          }}
        />
      )}

      {/* 6. Filmic Micro-Grain Texture (Eliminates banding, gives realistic studio material finish) */}
      {showGrain && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}

      {/* Interactive / Foreground Children Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
