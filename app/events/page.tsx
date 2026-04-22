import PageHero from "@/components/layout/PageHero";
import { Info } from "lucide-react";
import { ContentGrid } from "@/features/community";

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Events & Workshops" image="/assets/a1.png" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">WHAT&apos;S COMING</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Join our upcoming workshops, seminars, and community outreach programs.
            </p>
          </div>

          <ContentGrid 
            items={[
              {
                id: "e1",
                title: "Digital Literacy & Cyber Safety Workshop",
                desc: "Learn how to protect yourself from cyber fraud and navigate the digital world safely.",
                date: "May 15, 2026",
                location: "Teliarganj, Allahabad",
                image: "/assets/a1.png"
              },
              {
                id: "e2",
                title: "Legal Awareness & Basic Rights Roadshow",
                desc: "Empowering communities with essential knowledge of their fundamental rights and legal protections.",
                date: "May 22, 2026",
                location: "Civil Lines, Allahabad",
                image: "/assets/a4.png"
              },
              {
                id: "e3",
                title: "Women's Health & Hygiene Camp",
                desc: "Focused sessions on health, nutrition, and menstrual hygiene for women and girls.",
                date: "June 05, 2026",
                location: "Foundation Center",
                image: "/assets/a3.png"
              }
            ]}
            type="event"
            emptyIcon={Info}
            emptyTitle="No Upcoming Events"
            emptyDesc="We are currently planning our next set of awareness workshops. Check back soon!"
          />
        </div>
      </section>
    </main>
  );
}
