"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, ArrowRight, RefreshCcw, HelpCircle } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";

const questions = [
  {
    q: "Which law in India primarily deals with cyber crimes and digital security?",
    options: ["Indian Penal Code", "Information Technology Act, 2000", "Consumer Protection Act", "Companies Act"],
    a: 1
  },
  {
    q: "What is the primary objective of a 'Section 8' company in India?",
    options: ["Maximizing Profit", "International Trade", "Charitable & Social Welfare", "Stock Market Trading"],
    a: 2
  },
  {
    q: "Under the POCSO Act, what does 'O' stand for in the context of child protection?",
    options: ["Organization", "Offences", "Operations", "Observation"],
    a: 1
  },
  {
    q: "Which of these is a fundamental duty of an Indian citizen under the Constitution?",
    options: ["Voting in every election", "Protecting the environment", "Holding a government job", "Owning property"],
    a: 1
  },
  {
    q: "What is the best way to verify if an NGO is genuine in India?",
    options: ["Check their Instagram", "Look for NGO Darpan (NITI Aayog) registration", "Call their office", "Ask a neighbor"],
    a: 1
  }
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption === questions[currentStep].a) {
      setScore(score + 1);
    }

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  return (
    <main className="min-h-screen bg-bg">
      <PageHero title="GlobalSmart Awareness Quiz" image="/assets/a5.png" />

      <section className="py-24">
        <div className="max-content max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl border border-border"
              >
                <div className="flex justify-between items-center mb-12">
                  <span className="text-accent font-black tracking-widest text-sm uppercase">QUESTION {currentStep + 1} / {questions.length}</span>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div key={i} className={`w-8 h-1.5 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-primary/10'}`} />
                    ))}
                  </div>
                </div>

                <h2 className="font-display text-2xl md:text-3xl font-black text-text mb-12 leading-tight">
                  {questions[currentStep].q}
                </h2>

                <div className="grid grid-cols-1 gap-4 mb-12">
                  {questions[currentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                        selectedOption === i 
                        ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5' 
                        : 'border-border hover:border-primary/30 text-text-muted hover:bg-bg'
                      }`}
                    >
                      <span className="font-bold">{opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedOption === i ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {selectedOption === i && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={selectedOption === null}
                  className="w-full h-16 text-lg"
                >
                  {currentStep + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-12 md:p-24 shadow-2xl text-center space-y-8"
              >
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8 animate-bounce">
                  <Trophy size={48} />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-black text-text">
                  {score === questions.length ? "Perfect Score!" : "Well Done!"}
                </h2>
                <p className="text-text-muted text-xl">
                  You scored <span className="text-primary font-black">{score}</span> out of <span className="font-bold">{questions.length}</span> in the GlobalSmart Awareness Quiz.
                </p>
                
                <div className="p-8 rounded-3xl bg-bg border border-border text-left space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <HelpCircle size={20} />
                    <span className="font-bold">Your Impact</span>
                  </div>
                  <p className="text-text-muted leading-relaxed italic">
                    &quot;Being aware is the first step towards being a responsible citizen. Share this quiz with your friends and family to spread awareness.&quot;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button onClick={resetQuiz} variant="outline" className="h-14 px-8">
                    <RefreshCcw size={18} className="mr-2" />
                    Try Again
                  </Button>
                  <Link 
                    href="/donation" 
                    className="h-14 px-8 inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20"
                  >
                    Support Our Mission
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
