import PageHero from "@/components/layout/PageHero";
import { VolunteerForm } from "@/features/public/volunteer";

export default function VolunteerApplyPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Volunteer Application" image="/assets/s1.jpeg" />

      <section className="py-16 md:py-24 bg-bg">
        <div className="max-content max-w-4xl mx-auto">
          <VolunteerForm />
        </div>
      </section>
    </main>
  );
}
