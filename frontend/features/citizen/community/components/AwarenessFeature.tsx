"use client";

import React, { useState } from "react";
import { AwarenessList } from "./AwarenessList";
import { AwarenessForm } from "./AwarenessForm";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function AwarenessFeature() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        {/* The button inside AwarenessList will trigger this eventually, 
            but for the feature shell we manage state here. */}
      </div>
      
      <AwarenessList />

      {/* Manual toggle for demo purposes or if linked from List */}
      <Button 
        variant="primary"
        size="icon"
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 lg:hidden p-4 shadow-2xl z-40 w-14 h-14 text-2xl font-bold"
      >
        +
      </Button>

      <AnimatePresence>
        {isFormOpen && (
          <AwarenessForm onClose={() => setIsFormOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
