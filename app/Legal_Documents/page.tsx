import PageHero from "@/components/layout/PageHero";
import { LegalViewer } from "@/features/legal";
import { ShieldCheck, Info, FileCheck } from "lucide-react";

export default function LegalDocsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Official Legal Documents" image="/assets/a4.png" />

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-content">
          <div className="max-w-4xl mb-20 space-y-6">
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-accent">TRUST & TRANSPARENCY</span>
            <h2 className="font-display text-4xl md:text-6xl font-black text-text leading-tight">
              Our Compliance & <br />
              <span className="text-primary">Legal Framework</span>
            </h2>
            <p className="text-text-muted text-lg md:text-xl leading-relaxed">
              GlobalSmart Citizens Foundation operates with absolute transparency. 
              We are a registered Section 8 non-profit organization dedicated to social welfare, 
              maintaining all necessary certifications required by the Government of India.
            </p>
          </div>

          <LegalViewer />

          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-bg border border-border space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-bold">12A Registration</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Registered under Section 12A of the Income Tax Act, ensuring our operations are recognized for charitable activities.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-bg border border-border space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                <FileCheck size={24} />
              </div>
              <h4 className="text-xl font-bold">80G Certification</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Our 80G certification enables our donors to avail tax deductions, making every contribution go further.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-bg border border-border space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Info size={24} />
              </div>
              <h4 className="text-xl font-bold">NGO Darpan</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Proudly registered on NITI Aayog's NGO Darpan portal, maintaining a track record of accountability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
