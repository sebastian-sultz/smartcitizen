"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ExternalLink, Download, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const documents = [
  {
    id: "12a",
    title: "12A Certificate",
    subtitle: "Income Tax Registration",
    file: "/assets/legal docs/12A certificate.pdf",
    description: "Proof of registration under section 12A of the Income Tax Act, 1961."
  },
  {
    id: "80g",
    title: "80G Certificate",
    subtitle: "Donation Tax Benefit",
    file: "/assets/legal docs/80g certificate.pdf",
    description: "Certification allowing donors to claim tax exemptions on contributions."
  },
  {
    id: "d2",
    title: "CRC Manesar",
    subtitle: "Registration Document",
    file: "/assets/legal docs/d2.pdf",
    description: "Official registration document from the Central Registration Centre."
  }
];

export default function LegalViewer() {
  const [activeDoc, setActiveDoc] = useState(documents[0]);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Sidebar - Document List */}
      <div className="w-full lg:w-1/3 space-y-4">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveDoc(doc)}
            className={cn(
              "w-full text-left p-6 rounded-3xl transition-all duration-300 border flex items-center justify-between group",
              activeDoc.id === doc.id
                ? "bg-primary border-primary shadow-xl shadow-primary/20 text-white"
                : "bg-white border-border hover:border-primary/50 text-text"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                activeDoc.id === doc.id ? "bg-white/20" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
              )}>
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">{doc.title}</h4>
                <p className={cn(
                  "text-[12px] uppercase tracking-wider font-bold mt-1 opacity-70",
                  activeDoc.id === doc.id ? "text-white" : "text-text-light"
                )}>
                  {doc.subtitle}
                </p>
              </div>
            </div>
            <ChevronRight 
              size={20} 
              className={cn(
                "transition-transform",
                activeDoc.id === doc.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              )} 
            />
          </button>
        ))}

        <div className="p-8 rounded-[32px] bg-accent/5 border border-accent/10 mt-8 space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldCheck size={24} />
            <span className="font-black text-sm uppercase tracking-widest">Verified NGO</span>
          </div>
          <p className="text-[14px] text-text-muted leading-relaxed">
            GlobalSmart Citizens Foundation is fully compliant with Indian non-profit regulations. All documents are available for public verification.
          </p>
        </div>
      </div>

      {/* Main Content - Iframe Viewer */}
      <div className="flex-1 w-full space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDoc.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg p-6 rounded-3xl border border-border">
              <div>
                <h3 className="font-display text-2xl font-black text-text">{activeDoc.title}</h3>
                <p className="text-text-muted text-sm mt-1">{activeDoc.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={activeDoc.file} 
                  download 
                  className="p-3 rounded-full bg-white border border-border text-text-light hover:text-primary hover:border-primary transition-all shadow-sm"
                  title="Download PDF"
                >
                  <Download size={20} />
                </a>
                <a 
                  href={activeDoc.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <ExternalLink size={18} />
                  Open Full File
                </a>
              </div>
            </div>

            <div className="relative rounded-[40px] overflow-hidden bg-white border-8 border-bg shadow-2xl aspect-[1/1.4] md:aspect-auto md:h-[800px] group">
              <iframe 
                src={`${activeDoc.file}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-full border-none"
                title={activeDoc.title}
              />
              {/* Decorative Frame Elements */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
