"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12 sm:p-6 text-center  overflow-hidden relative">
      {/* Background glowing blurred blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slower pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
        {/* Animated Compass & Grid SVG */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8 relative flex items-center justify-center">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg"
          >
            <defs>
              <radialGradient id="grid-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <style>{`
              @keyframes needle-spin {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(205deg); }
                45% { transform: rotate(185deg); }
                70% { transform: rotate(385deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes radar-pulse {
                0% { r: 10px; opacity: 0.8; }
                100% { r: 85px; opacity: 0; }
              }
              @keyframes float-svg {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes dash {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .animate-needle {
                animation: needle-spin 7s cubic-bezier(0.68, -0.6, 0.32, 1.6) infinite;
                transform-origin: 100px 100px;
              }
              .animate-radar-1 {
                animation: radar-pulse 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
                transform-origin: 100px 100px;
              }
              .animate-radar-2 {
                animation: radar-pulse 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
                animation-delay: 1.5s;
                transform-origin: 100px 100px;
              }
              .animate-float {
                animation: float-svg 5s ease-in-out infinite;
              }
              .animate-path {
                stroke-dasharray: 4, 4;
                animation: dash 1s linear infinite;
              }
            `}</style>

            {/* Radar Pulsing Waves */}
            <circle cx="100" cy="100" r="10" fill="none" stroke="var(--color-primary)" strokeWidth="1" className="animate-radar-1" />
            <circle cx="100" cy="100" r="10" fill="none" stroke="var(--color-accent)" strokeWidth="1" className="animate-radar-2" />

            {/* Grid Radial Background */}
            <circle cx="100" cy="100" r="90" fill="url(#grid-glow)" />

            {/* Concentric Coordinates Rings */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="var(--color-border)" strokeWidth="1" />

            {/* Axis Lines */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Connecting Paths (Network) */}
            <path d="M 50,70 L 100,40 L 150,80 L 120,130 Z" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" className="opacity-30" />
            <path d="M 100,100 L 120,130" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="animate-path" />

            {/* Glowing Citizen Nodes */}
            <circle cx="50" cy="70" r="4" fill="var(--color-primary)" className="animate-pulse" />
            <circle cx="100" cy="40" r="4.5" fill="var(--color-primary)" />
            <circle cx="150" cy="80" r="4" fill="var(--color-primary)" className="animate-pulse" />
            <circle cx="120" cy="130" r="5" fill="var(--color-accent)" />
            
            {/* Center Dial Outer */}
            <circle cx="100" cy="100" r="14" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2.5" className="animate-float" />

            {/* Compass Needle (Spinning) */}
            <g className="animate-needle">
              {/* North Needle (Primary Color) */}
              <polygon points="100,100 95,100 100,65" fill="var(--color-primary)" />
              {/* South Needle (Accent Color) */}
              <polygon points="100,100 105,100 100,135" fill="var(--color-accent)" />
              {/* Center Pivot Point */}
              <circle cx="100" cy="100" r="4" fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Status Code */}
        <span className="font-display font-black text-6xl sm:text-7xl md:text-8xl text-primary/10 tracking-widest leading-none mb-2 ">
          404
        </span>

        {/* Message */}
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mb-3 tracking-tight">
          Lost in the Network?
        </h1>
        
        <p className="text-text-muted text-sm sm:text-[15px] max-w-xs sm:max-w-sm mb-6 sm:mb-8 leading-relaxed">
          It looks like this destination is outside the boundaries of our smart city map. Let&apos;s get you back on track.
        </p>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none justify-center px-4 sm:px-0">
          <Button
            asChild
            variant="secondary"
            size="md"
            fullWidth
            className="sm:w-auto"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => window.history.back()}
          >
            <span className="cursor-pointer">Go Back</span>
          </Button>

          <Button
            asChild
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            startIcon={<Home size={16} />}
          >
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
