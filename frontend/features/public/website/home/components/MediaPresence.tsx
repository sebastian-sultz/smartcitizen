"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Play,
  Share2,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
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
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-surface border-b border-border/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.2]">
        <div className="absolute top-[20%] -left-[10%] w-[35%] h-[35%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] -right-[10%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-content relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 md:mb-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* YouTube Video Showcase - 7 Cols */}
          <div className="lg:col-span-7 flex flex-col bg-bg/50 rounded-3xl border border-border/45 overflow-hidden p-6 md:p-8 justify-between shadow-card">
            <div className="space-y-4 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-wider">
                <YoutubeIcon className="w-3.5 h-3.5" fill="currentColor" />{" "}
                Featured Video
              </span>
              <h3 className="font-display text-2xl font-bold text-text">
                GlobalSmart Citizens Awareness & Literacy Initiative
              </h3>
              <p className="text-[14px] text-text-muted">
                Watch a summary of our grassroot campaigns, volunteer
                experiences, and local community guidance programs from across
                Delhi & NCR.
              </p>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-border/20 bg-dark group">
              {playVideo ? (
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="GlobalSmart Citizens Awareness Campaign"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src="/assets/vision34.jpeg"
                    alt="GlobalSmart Awareness Drive"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-dark/25 flex items-center justify-center transition-colors group-hover:bg-dark/35">
                    <Button
                      variant="accent"
                      size="icon"
                      shape="circle"
                      onClick={() => setPlayVideo(true)}
                      className="w-16 h-16 shadow-xl active:scale-95 duration-300"
                      aria-label="Play Featured Video"
                    >
                      <Play size={28} className="translate-x-0.5 fill-white" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-dark/65 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[12px] font-semibold flex items-center justify-between border border-white/10">
                    <span>Duration: 4 mins • Watch on YouTube</span>
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 font-bold text-accent-light"
                    >
                      Watch <ExternalLink size={12} />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Facebook/Community Showcase - 5 Cols */}
          <div className="lg:col-span-5 bg-bg/50 rounded-3xl border border-border/45 p-6 md:p-8 flex flex-col justify-between shadow-card">
            <div className="space-y-6">
              {/* FB Brand Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    GS
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text text-lg flex items-center gap-1.5">
                      GlobalSmart Citizens
                      <span
                        className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-black"
                        title="Verified Community"
                      >
                        ✓
                      </span>
                    </h3>
                    <p className="text-[12px] text-text-muted font-medium">
                      Facebook Community • 12K members
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors"
                  aria-label="View Facebook Page"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* Storytelling Post Card Mock */}
              <div className="bg-white rounded-2xl border border-border/30 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    GS
                  </div>
                  <div>
                    <span className="block text-[13px] font-bold text-text">
                      GlobalSmart Citizens Foundation
                    </span>
                    <span className="block text-[10px] text-text-light font-medium">
                      Yesterday at 3:45 PM • Public Group
                    </span>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed text-text">
                  Yesterday, our volunteer team successfully organized a legal
                  and digital literacy drive! Thank you to the 50+ local
                  volunteers who joined us. Together we are bringing positive
                  grassroots change to community clusters! 📚⚖️
                </p>

                {/* Mock Image Grid inside Facebook Post */}
                <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden border border-border/20">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src="/assets/a1.png"
                      alt="Awareness drive photo 1"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src="/assets/a2.png"
                      alt="Awareness drive photo 2"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/20">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors font-medium">
                      <ThumbsUp size={13} /> 142 Likes
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors font-medium">
                      <MessageCircle size={13} /> 36 Comments
                    </span>
                  </div>
                  <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors font-medium">
                    <Share2 size={13} /> 18 Shares
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6 mt-6 border-t border-border/40">
              <Button
                asChild
                variant="primary"
                className="w-full text-[14px] h-auto py-3.5"
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <FacebookIcon className="w-4 h-4" fill="currentColor" />
                  Join Our Facebook Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
