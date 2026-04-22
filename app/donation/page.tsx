import PageHero from "@/components/layout/PageHero";
import { DonationForm, PaymentInfo } from "@/features/donation";

export default function DonationPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Support the Cause" image="/assets/a2.png" />

      <section className="py-24 bg-white">
        <div className="max-content">
          {/* Impact Message */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">EVERY RUPEE COUNTS</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
              Together, We Create Real Change
            </h2>
            <div className="space-y-6 text-text-muted text-[17px] leading-relaxed">
              <p>
                At GlobalSmart Citizens Foundation, we are committed to creating meaningful
                and lasting change by empowering individuals and communities.
              </p>
              <p>
                We work towards education, healthcare, social welfare, and environmental
                sustainability. Every donation is not just support — it is hope, empowerment, and
                a step towards a better tomorrow.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <DonationForm />
            <PaymentInfo />
          </div>
        </div>
      </section>
    </main>
  );
}
