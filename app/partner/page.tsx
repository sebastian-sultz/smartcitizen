import PageHero from "@/components/layout/PageHero";
import { User, AlertTriangle } from "lucide-react";

export default function PartnerPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Our Partners & Experts" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="font-display text-4xl font-bold text-text">Our Experts & Advisory Support</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Meet our dedicated professionals who guide, empower, and assist individuals
              in diverse areas of need.
            </p>
            <p className="text-text-muted text-[17px] leading-relaxed">
              At GlobalSmart Citizens Foundation, our experienced experts work together
              to provide practical guidance and raise awareness in crucial areas. We are
              dedicated to empowering individuals and communities with valuable support,
              while maintaining a focus on care and responsibility.
            </p>
          </div>

          {/* Expert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Placeholder Expert Card */}
            <div className="bg-bg rounded-2xl p-8 border border-border text-center space-y-6 group hover:shadow-xl transition-all">
              <div className="w-24 h-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto text-text-light group-hover:border-primary transition-colors">
                <User size={40} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text">Expert Counselor</h3>
                <p className="text-accent text-[12px] font-bold uppercase tracking-widest mt-1">Legal & Social Welfare</p>
              </div>
              <p className="text-text-muted text-[15px] italic">
                &quot;Coming Soon: We are currently onboarding verified experts to provide better guidance to our community.&quot;
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-xl space-y-4">
              <div className="flex items-center gap-3 text-amber-700">
                <AlertTriangle size={24} />
                <h4 className="font-bold text-lg uppercase tracking-wider">Disclaimer</h4>
              </div>
              <div className="text-[14px] text-amber-900/80 leading-relaxed space-y-3">
                <p>
                  GlobalSmart Citizens Foundation provides guidance, support, and information
                  strictly for general awareness and assistance purposes. All services are offered
                  on a voluntary and best-effort basis without any guarantees of accuracy,
                  completeness, or outcomes.
                </p>
                <p>
                  The Foundation and its experts do not provide
                  professional, legal, medical, financial, or certified advisory services.
                  Users are advised to seek qualified professional consultation for specific concerns.
                </p>
                <p>
                  By accessing or using our services, you acknowledge and agree that this support
                  is informational in nature and does not constitute professional advice or create
                  any legal relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
