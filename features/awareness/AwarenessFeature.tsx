"use client";

import React, { useState } from "react";
import { AwarenessList } from "./components/AwarenessList";
import { AwarenessForm } from "./components/AwarenessForm";
import { AnimatePresence } from "framer-motion";

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
      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 lg:hidden bg-primary text-white p-4 rounded-full shadow-2xl z-40"
      >
        +
      </button>

      <AnimatePresence>
        {isFormOpen && (
          <AwarenessForm onClose={() => setIsFormOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
