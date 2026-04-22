import PageHero from "@/components/layout/PageHero";
import { BrainCircuit, Play } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Awareness Quiz" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-border">
              <div className="bg-primary p-12 text-center text-white space-y-4">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit size={40} className="text-accent-light" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent-light">TEST YOUR KNOWLEDGE</span>
                <h2 className="font-display text-4xl font-bold">Take the Awareness Quiz</h2>
                <p className="text-white/70 text-[17px]">
                  How aware are you about your legal rights, digital safety, environmental
                  responsibilities, and civic duties? Test yourself and learn something new!
                </p>
              </div>
              
              <div className="p-12 text-center space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-bg border border-border">
                    <p className="text-[12px] font-bold text-text-light uppercase tracking-wider mb-1">Time</p>
                    <p className="font-bold text-text">5 Minutes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg border border-border">
                    <p className="text-[12px] font-bold text-text-light uppercase tracking-wider mb-1">Questions</p>
                    <p className="font-bold text-text">10 Items</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg border border-border">
                    <p className="text-[12px] font-bold text-text-light uppercase tracking-wider mb-1">Topic</p>
                    <p className="font-bold text-text">General Awareness</p>
                  </div>
                </div>

                <div className="pt-4">
                   {/* This button links to the original quiz route or a placeholder */}
                   <Link 
                     href="#" 
                     className="inline-flex items-center gap-3 bg-accent hover:bg-accent-light text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 transition-all transform hover:-translate-y-1"
                   >
                     <Play fill="currentColor" size={20} />
                     Start the Quiz
                   </Link>
                </div>

                <p className="text-text-muted text-[14px]">
                  No registration required to play. Test your impact and share with others!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
