"use client";

import { useState } from "react";
import { FAQItem } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((x) => x !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const categories = [
    { id: "all", label: "All FAQs" },
    { id: "account", label: "My Account" },
    { id: "donation", label: "Donations & 80G" },
    { id: "volunteer", label: "Volunteering" },
    { id: "general", label: "General" }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-bg/20 p-4 border border-border/60 rounded-3xl">
        <div className="w-full md:max-w-xs relative">
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2 text-sm"
            icon={<Search size={18} className="text-text-muted" />}
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? "primary" : "secondary"}
              size="xs"
              noShadow
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white border border-border/80 rounded-3xl">
            <p className="text-sm text-text-muted font-medium">No FAQs match your search query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);
            return (
              <Card 
                key={faq.id}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden shadow-none",
                  isExpanded ? "border-primary/20 bg-primary/[0.01]" : "border-border/80 bg-white hover:bg-bg/30"
                )}
              >
                <Button
                  variant="ghost"
                  fullWidth
                  alignLeft
                  onClick={() => toggleExpand(faq.id)}
                  className="p-5 flex items-center justify-between gap-4 font-bold text-sm text-text hover:bg-transparent active:scale-[0.99] rounded-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className={cn("shrink-0", isExpanded ? "text-primary" : "text-text-muted")} />
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-primary shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-text-muted shrink-0" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-text-muted font-medium leading-relaxed border-t border-border/30">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
