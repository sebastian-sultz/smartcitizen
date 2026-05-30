"use client";

import { useState } from "react";
import { Calendar, Heart, Shield, CheckCircle2, ChevronLeft, ChevronRight, X, ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Activity {
  id: string;
  category: string;
  title: string;
  summary: string;
  fullStory: string;
  date: string;
  image: string;
  gallery: string[];
  metrics: { label: string; value: string }[];
}

const activities: Activity[] = [
  {
    id: "act-1",
    category: "Health Drive",
    title: "Grassroots Health Checkup Camps",
    summary: "Conducted a free medical screening and health checkup camp for over 300 residents in rural clusters, providing essential medicines.",
    fullStory: "On May 10, 2026, GlobalSmart Citizens Foundation, in collaboration with local medical volunteers and partner hospitals, organized a comprehensive free health checkup camp in the Dwarka Sector-15 community cluster. Over 300 residents—including children, young mothers, and elderly citizens—received professional medical consultations. The camp provided basic health checkups, blood pressure checks, diabetes screening, and distributed free primary medicines. Our goal is to make healthcare advice and primary support accessible to the underserved.",
    date: "May 2026",
    image: "/assets/a3.png",
    gallery: ["/assets/a3.png", "/assets/a1.png", "/assets/a2.png"],
    metrics: [
      { label: "Residents Screened", value: "300+" },
      { label: "Medical Experts", value: "12" },
      { label: "Medicines Given", value: "450+" }
    ]
  },
  {
    id: "act-2",
    category: "Legal Awareness",
    title: "Legal Guidance & Rights Seminar",
    summary: "Empowered citizens by providing free legal counseling on fundamental rights, property issues, and government welfare schemes.",
    fullStory: "In mid-April 2026, our legal guidance cell hosted a comprehensive Legal Rights Awareness Drive in West Delhi. Experienced advocates and legal volunteers sat with over 150 community members to explain fundamental rights, clarify doubts regarding property registration, and assist them in applying for government welfare schemes. Education on legal rights is a key pillar of citizen empowerment, helping prevent exploitation and secure family assets.",
    date: "April 2026",
    image: "/assets/a4.png",
    gallery: ["/assets/a4.png", "/assets/a5.png", "/assets/a6.png"],
    metrics: [
      { label: "Citizens Advised", value: "150+" },
      { label: "Legal Experts", value: "8" },
      { label: "Welfare Filings", value: "32" }
    ]
  },
  {
    id: "act-3",
    category: "Digital Safety",
    title: "Cyber Security & Safety Programs",
    summary: "Educated 500+ school students and teachers on online safety, preventing cyberbullying, and securing digital accounts.",
    fullStory: "Our digital safety wing visited several government-aided schools in North Delhi to deliver intensive seminars on Cyber Security. Over 500 children and teachers learned how to identify online threats, secure passwords, prevent cyberbullying, and report cyber fraud. By educating the younger generation, we build a safer digital environment for the entire community and help protect families from financial and social cyber crimes.",
    date: "March 2026",
    image: "/assets/a5.png",
    gallery: ["/assets/a5.png", "/assets/a2.png", "/assets/a1.png"],
    metrics: [
      { label: "Students Educated", value: "500+" },
      { label: "Schools Covered", value: "10" },
      { label: "Satisfaction Rate", value: "100%" }
    ]
  }
];

export function LatestActivities() {
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<{ [key: string]: number }>({
    "act-1": 0,
    "act-2": 0,
    "act-3": 0
  });

  const nextSlide = (actId: string, maxLen: number) => {
    setActiveGalleryIdx(prev => ({
      ...prev,
      [actId]: (prev[actId] + 1) % maxLen
    }));
  };

  const prevSlide = (actId: string, maxLen: number) => {
    setActiveGalleryIdx(prev => ({
      ...prev,
      [actId]: (prev[actId] - 1 + maxLen) % maxLen
    }));
  };

  return (
    <section className="py-12 md:py-16 bg-white border-t border-border/50">
      <div className="max-content">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">
              ON THE GROUND
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">
              Our Recent Initiatives
            </h2>
            <p className="text-text-muted text-[16px]">
              Witness our ongoing grassroots campaigns, community support networks, and volunteer field actions.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="px-6 py-3 text-[15px] h-auto font-bold"
          >
            <a
              href="/our_activity"
              className="inline-flex items-center gap-2"
            >
              View Photo Gallery
              <Camera size={18} />
            </a>
          </Button>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-bg-alt/30 rounded-2xl overflow-hidden border border-border/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {activity.category}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 md:px-8 space-y-3">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-muted font-bold">
                    <Calendar size={13} className="text-accent" />
                    {activity.date}
                  </div>
                  <h3 className="font-display text-xl font-bold text-text group-hover:text-primary transition-colors leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-text-muted text-[14px] leading-relaxed line-clamp-3">
                    {activity.summary}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 md:p-8 pt-0 mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full inline-flex items-center justify-center gap-2 border border-border hover:border-primary hover:text-primary font-bold py-2.5 px-4 rounded-xl transition-colors text-[14px] h-auto"
                    >
                      Read Full Story
                      <ArrowRight size={16} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 sm:p-0 overflow-hidden gap-0">
                    <DialogHeader className="px-6 pt-6 pb-4 sm:px-8 sm:pt-8 border-b border-border bg-surface shrink-0">
                      <div className="flex items-center gap-2 text-[12px] text-accent font-bold uppercase tracking-wider mb-1">
                        <span>{activity.category}</span>
                        <span>•</span>
                        <span>{activity.date}</span>
                      </div>
                      <DialogTitle className="font-display text-2xl md:text-3xl font-black text-text">
                        {activity.title}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        {/* Left: Images & Carousel */}
                        <div className="space-y-4">
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-bg shadow-sm">
                            <Image
                              src={activity.gallery[activeGalleryIdx[activity.id] || 0]}
                              alt={`${activity.title} gallery`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-opacity duration-300"
                            />

                            {activity.gallery.length > 1 && (
                              <>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  shape="circle"
                                  onClick={() => prevSlide(activity.id, activity.gallery.length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-text flex items-center justify-center shadow-md active:scale-90 transition-all"
                                  aria-label="Previous image"
                                >
                                  <ChevronLeft size={16} />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  shape="circle"
                                  onClick={() => nextSlide(activity.id, activity.gallery.length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-text flex items-center justify-center shadow-md active:scale-90 transition-all"
                                  aria-label="Next image"
                                >
                                  <ChevronRight size={16} />
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Thumbnail Selector */}
                          <div className="flex gap-2">
                            {activity.gallery.map((img, idx) => (
                              <Button
                                key={idx}
                                variant="ghost"
                                onClick={() => setActiveGalleryIdx(prev => ({ ...prev, [activity.id]: idx }))}
                                className={`p-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all relative ${
                                  activeGalleryIdx[activity.id] === idx ? "border-primary scale-95 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                              >
                                <Image
                                  src={img}
                                  alt="thumbnail"
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Right: Text Story & Metrics */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <h4 className="text-[13px] uppercase tracking-wider font-bold text-text-light flex items-center gap-1.5">
                              <Heart size={14} className="text-primary fill-primary" /> The Story
                            </h4>
                            <p className="text-[14px] leading-relaxed text-text-muted whitespace-pre-line">
                              {activity.fullStory}
                            </p>
                          </div>

                          {/* Impact Metrics Inside Popup */}
                          <div className="border-t border-border pt-5 space-y-4">
                            <h4 className="text-[13px] uppercase tracking-wider font-bold text-text-light flex items-center gap-1.5">
                              <CheckCircle2 size={14} className="text-primary" /> Key Impact Metrics
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              {activity.metrics.map((metric, mIdx) => (
                                <div key={mIdx} className="bg-bg-alt/30 border border-border/40 rounded-xl p-3 text-center">
                                  <span className="block text-lg font-black text-primary leading-none mb-1">
                                    {metric.value}
                                  </span>
                                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-tight leading-tight">
                                    {metric.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
