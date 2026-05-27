"use client";

import { useEffect, useState } from "react";
import { FAQItem } from "../../types";
import { getFAQs } from "../../api";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FAQSectionProps {
  onCreateTicketClick: () => void;
}

export default function FAQSection({ onCreateTicketClick }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await getFAQs(category);
      setFaqs(data);
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [category]);

  const handleToggleExpand = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Category Filters Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={16} />
          </span>
          <Input
            className="pl-10 rounded-2xl"
            placeholder="Search FAQs by keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories selector */}
        <div className="flex overflow-x-auto gap-1 bg-bg/60 p-1.5 rounded-2xl border border-border shrink-0">
          {["all", "general", "donation", "volunteer", "account"].map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={category === cat ? "secondary" : "ghost"}
              size="xs"
              onClick={() => {
                setCategory(cat);
                setExpandedFaqId(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap ${
                category === cat
                  ? "bg-white text-primary shadow-sm hover:bg-white"
                  : "text-text-muted hover:text-text hover:bg-transparent"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="py-12 text-center text-text-muted font-bold text-xs uppercase tracking-wider">
            Loading FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-text-muted border border-dashed border-border rounded-3xl font-semibold">
            No FAQs found matching your criteria. Try different search terms.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <Card 
                key={faq.id} 
                className={`rounded-2xl border-primary/5 hover:border-primary/10 transition-all duration-200 overflow-hidden cursor-pointer ${
                  isExpanded ? "shadow-sm border-primary/10 bg-primary/5" : "bg-white"
                }`}
                onClick={() => handleToggleExpand(faq.id)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-bold text-sm text-text pr-2 leading-snug">
                      {faq.question}
                    </h4>
                    <span className={`text-text-muted shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-primary" : ""
                    }`}>
                      <ChevronDown size={16} />
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3.5 pt-3.5 border-t border-dashed border-primary/10 text-xs text-text-muted leading-relaxed font-semibold">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Contact Support prompt */}
      <Card className="rounded-[32px] border-primary/5 bg-gradient-to-r from-bg to-bg/80 border p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
            <HelpCircle size={22} className="animate-bounce" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-display font-bold text-sm text-text">Still need help?</h4>
            <p className="text-[11px] text-text-muted leading-relaxed font-semibold mt-0.5">
              Open a verified support ticket and our team will get back to you shortly.
            </p>
          </div>
        </div>

        <Button
          onClick={onCreateTicketClick}
          className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 py-3 px-5 rounded-xl h-auto text-xs shrink-0 border-none"
        >
          <MessageSquare size={14} />
          Create Support Ticket
        </Button>
      </Card>
    </div>
  );
}
