import PageHero from "@/components/layout/PageHero";
import { BookOpen } from "lucide-react";
import { ContentGrid } from "@/features/community";

export default function BlogsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Resources & Articles" image="/assets/a10.png" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Knowledge Hub</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Explore articles on legal rights, digital safety, health, and more.
            </p>
          </div>

          <ContentGrid 
            items={[]}
            type="blog"
            emptyIcon={BookOpen}
            emptyTitle="Articles Coming Soon"
            emptyDesc="Our experts are preparing insightful articles to help you stay aware and empowered."
          />
        </div>
      </section>
    </main>
  );
}
