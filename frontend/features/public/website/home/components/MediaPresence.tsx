"use client";
import { ASSETS } from "@/lib/assets";
import { SOCIAL_LINKS } from "@/lib/constants";

import { useState } from "react";
import Image from "next/image";
import {
  Play,
  Share2,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Heart,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function MediaPresence() {
  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.2]">
        <div className="absolute top-[20%] -left-[10%] w-[35%] h-[35%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] -right-[10%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-content relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">
            Media & Community
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">
            Active Presence, Trusted Change
          </h2>
          <p className="text-text-muted text-[17px] leading-relaxed">
            We believe transparency builds trust. Watch our legal guidance
            sessions, view environmental campaigns, and engage with our active
            community online.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: YouTube Featured Video */}
          <div className="group/card flex flex-col bg-bg/60 backdrop-blur-md rounded-3xl border border-red-500/10 hover:border-red-500/25 overflow-hidden p-6 md:p-8 justify-between shadow-card hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)] hover:-translate-y-1.5 transition-all duration-500 relative">
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover/card:bg-red-500/10 transition-all duration-500" />
            
            <div className="space-y-4">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-bold uppercase tracking-wider">
                  <YoutubeIcon className="w-3.5 h-3.5" fill="currentColor" /> Featured Video
                </span>
                <h3 className="font-display text-xl font-bold text-text">
                  Awareness & Literacy Campaign
                </h3>
                <p className="text-[14px] text-text-muted">
                  Watch a summary of our grassroots campaigns, volunteer experiences, and local community guidance programs.
                </p>
              </div>

              {/* Video Player Container (acting as link to YouTube channel) */}
              <a
                href="https://www.youtube.com/@globalsmartcitizensfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-border/20 bg-dark group/video block mt-4"
              >
                <Image
                  src={ASSETS.vision34}
                  alt="GlobalSmart Awareness Drive"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover/video:scale-103 transition-transform duration-500 opacity-90"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover/video:bg-black/30">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-red-700 shadow-red-600/40 relative">
                    <span className="absolute inset-0 rounded-full bg-red-600/25 animate-ping opacity-75" />
                    <Play size={20} className="translate-x-0.5 fill-white text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-semibold flex items-center justify-between border border-white/10">
                  <span>Go to YouTube Channel</span>
                  <span className="hover:underline flex items-center gap-1 font-bold text-red-400">
                    Watch <ExternalLink size={10} />
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40">
              <Button
                asChild
                variant="primary"
                size="lg"
                fullWidth
                className="group-hover/card:bg-red-600 group-hover/card:hover:bg-red-700 group-hover/card:shadow-red-600/10 transition-colors"
              >
                <a
                  href="https://www.youtube.com/@globalsmartcitizensfoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YoutubeIcon className="w-4 h-4" fill="currentColor" />
                  YouTube Channel
                </a>
              </Button>
            </div>
          </div>

          {/* Card 2: Facebook Community */}
          <div className="group/card flex flex-col bg-bg/60 backdrop-blur-md rounded-3xl border border-blue-500/10 hover:border-blue-500/25 overflow-hidden p-6 md:p-8 justify-between shadow-card hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] hover:-translate-y-1.5 transition-all duration-500 relative">
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover/card:bg-blue-500/10 transition-all duration-500" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 text-[11px] font-bold uppercase tracking-wider">
                  <FacebookIcon className="w-3.5 h-3.5" fill="currentColor" /> Community Feed
                </span>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-blue-500 transition-colors"
                  aria-label="View Facebook Page"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Storytelling Post Card Mock acting as link */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl border border-border/30 p-4 space-y-3 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300 mt-4 group/fb"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px]">
                    GS
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-text leading-none group-hover/fb:text-blue-600 transition-colors">
                      GlobalSmart Citizens Foundation
                    </span>
                    <span className="block text-[9px] text-text-light font-medium mt-0.5">
                      Yesterday at 3:45 PM • Public Group
                    </span>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed text-text">
                  Yesterday, our volunteer team successfully organized a legal
                  and digital literacy drive! Thank you to the 50+ local
                  volunteers who joined us. Together we are bringing positive
                  grassroots change to community clusters! 📚⚖️
                </p>

                {/* Mock Image Grid inside Facebook Post */}
                <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden border border-border/20 group-hover/fb:opacity-95 transition-opacity">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={ASSETS.a1}
                      alt="Awareness drive photo 1"
                      fill
                      sizes="(max-width: 768px) 45vw, 150px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={ASSETS.a2}
                      alt="Awareness drive photo 2"
                      fill
                      sizes="(max-width: 768px) 45vw, 150px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors font-medium">
                      <ThumbsUp size={11} className="group-hover/fb:text-blue-500 transition-colors" /> 142
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors font-medium">
                      <MessageCircle size={11} className="group-hover/fb:text-blue-500 transition-colors" /> 36
                    </span>
                  </div>
                  <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors font-medium">
                    <Share2 size={11} className="group-hover/fb:text-blue-500 transition-colors" /> 18
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40">
              <Button
                asChild
                variant="primary"
                size="lg"
                fullWidth
                className="group-hover/card:bg-blue-600 group-hover/card:hover:bg-blue-700 group-hover/card:shadow-blue-600/10 transition-colors"
              >
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon className="w-4 h-4" fill="currentColor" />
                  Facebook Group
                </a>
              </Button>
            </div>
          </div>

          {/* Card 3: Instagram Highlights */}
          <div className="group/card flex flex-col bg-bg/60 backdrop-blur-md rounded-3xl border border-pink-500/10 hover:border-pink-500/25 overflow-hidden p-6 md:p-8 justify-between shadow-card hover:shadow-[0_20px_50px_rgba(236,72,153,0.08)] hover:-translate-y-1.5 transition-all duration-500 relative">
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl pointer-events-none group-hover/card:bg-pink-500/10 transition-all duration-500" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/5 border border-pink-500/10 text-pink-500 text-[11px] font-bold uppercase tracking-wider">
                  <InstagramIcon className="w-3.5 h-3.5" /> Instagram Stories
                </span>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-pink-500 transition-colors"
                  aria-label="View Instagram Profile"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Instagram Card Mock acting as link */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl border border-border/30 p-4 space-y-3 shadow-sm hover:shadow-md hover:border-pink-500/20 transition-all duration-300 mt-4 group/ig"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-white p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-[9px]">
                        GS
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[12px] font-bold text-text leading-none group-hover/ig:text-pink-600 transition-colors">
                      global_smartcitizen_foundation
                    </span>
                    <span className="block text-[9px] text-text-light font-medium mt-0.5">
                      Teliarganj, Allahabad
                    </span>
                  </div>
                </div>

                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border/20 group-hover/ig:opacity-95 transition-opacity">
                  <Image
                    src={ASSETS.vision34}
                    alt="Instagram campaign highlight"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>

                {/* IG Action icons */}
                <div className="flex justify-between items-center text-text-muted pt-1">
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-red-500 fill-red-500 hover:scale-110 transition-transform cursor-pointer" />
                    <MessageCircle size={16} className="hover:text-pink-500 transition-colors cursor-pointer" />
                    <Send size={16} className="hover:text-pink-500 transition-colors cursor-pointer" />
                  </div>
                  <span className="text-[10px] font-bold text-text">98 Likes</span>
                </div>
                {/* Caption */}
                <p className="text-[11px] leading-relaxed text-text line-clamp-1">
                  <span className="font-bold mr-1">global_smartcitizen_foundation</span>
                  Empowering local leaders for cleanliness drives and assemblies! 🌱💪 #Community
                </p>
              </a>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40">
              <Button
                asChild
                variant="primary"
                size="lg"
                fullWidth
                className="group-hover/card:bg-pink-600 group-hover/card:hover:bg-pink-700 group-hover/card:shadow-pink-600/10 transition-colors"
              >
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  Instagram Page
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
