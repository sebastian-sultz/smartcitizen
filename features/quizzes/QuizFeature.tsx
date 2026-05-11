"use client";

import React from "react";
import { Plus, Search, HelpCircle, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const mockTopics = [
  { id: "1", name: "Climate Change Basics", questions: 10, attempts: 1240, lastUpdated: "2024-05-01" },
  { id: "2", name: "Safe Water Habits", questions: 8, attempts: 850, lastUpdated: "2024-04-28" },
  { id: "3", name: "Digital Safety 101", questions: 15, attempts: 2100, lastUpdated: "2024-05-05" },
];

export function QuizFeature() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Educational Quizzes</h2>
          <p className="text-text-muted">Create and monitor awareness-driven quizzes.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors shadow-lg">
          <Plus size={20} className="mr-2" />
          Add Quiz Topic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface p-6 rounded-2xl shadow-card border border-border group hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <HelpCircle size={24} />
              </div>
              <span className="text-[10px] uppercase font-bold text-text-light tracking-wider">Quiz ID: #{topic.id}</span>
            </div>
            
            <h3 className="text-lg font-bold text-text mb-4 group-hover:text-primary transition-colors">{topic.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center text-sm text-text-muted">
                <HelpCircle size={14} className="mr-2 opacity-60" />
                <span>{topic.questions} Qs</span>
              </div>
              <div className="flex items-center text-sm text-text-muted">
                <Users size={14} className="mr-2 opacity-60" />
                <span>{topic.attempts} Users</span>
              </div>
              <div className="flex items-center text-[10px] text-text-light col-span-2">
                <Calendar size={12} className="mr-2 opacity-60" />
                <span>Last updated: {topic.lastUpdated}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
