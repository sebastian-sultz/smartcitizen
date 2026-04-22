import PageHero from "@/components/layout/PageHero";
import { FileText, Download, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const documents = [
  { name: "Refer Instruction", route: "/assets/Doc/d1.pd" },
  { name: "CRC Manesar", route: "/assets/Doc/d2.pdf" },
  { name: "May Concern", route: "/assets/Doc/d3.pdf" },
  { name: "12A Certificate", route: "/assets/Doc/12A certificate.pdf" },
  { name: "80G Certificate", route: "/assets/Doc/80g certificate.pdf" },
  { name: "NPO Details", route: "/assets/Doc/NGO DARPAN.pd" },
  { name: "Central Registration Centre", route: "/assets/Doc/d4.pdf" },
  { name: "(Incorporation) Rules", route: "/assets/Doc/d5.pdf" },
];

export default function LegalDocsPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Legal Documents" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left - Status & Grid */}
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-bold text-text">Legal Status & Compliance</h2>
                <div className="space-y-4 text-text-muted text-[16px] leading-relaxed">
                  <p>
                    Global Smart Citizens Foundation is a legally registered non-profit
                    organization operating in accordance with applicable laws and regulations in India.
                  </p>
                  <p>
                    The organization is duly registered under the provisions of Section 8 of the
                    Companies Act, 2013, and functions as a non-profit entity with a primary
                    objective of social welfare, public benefit, and community development.
                  </p>
                  <p>
                    The Foundation is also registered on the Government of India&apos;s NGO portal
                    (NITI Aayog – NGO Darpan) and holds valid registrations under applicable
                    tax provisions, including 12A and 80G of the Income Tax Act, 1961.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                  <div key={i} className="group bg-bg p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-text text-[15px]">{doc.name}</span>
                    </div>
                    <a href={doc.route} className="p-2 text-text-light hover:text-primary transition-colors" title="Download">
                      <Download size={20} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Policies */}
            <div className="lg:w-1/3 space-y-8">
              <div className="bg-primary text-white p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-accent-light" />
                  <h3 className="font-display text-xl font-bold">Transparency Policy</h3>
                </div>
                <p className="text-white/80 text-[14px] leading-relaxed">
                  To maintain transparency while ensuring data security and preventing misuse,
                  the organization follows a controlled disclosure approach:
                </p>
                <ul className="space-y-4 text-[14px]">
                  <li className="flex items-start gap-3">
                    <Lock size={16} className="text-accent-light shrink-0 mt-1" />
                    <span>The Foundation possesses all valid registration certificates as required under law.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock size={16} className="text-accent-light shrink-0 mt-1" />
                    <span>Original documents are not displayed publicly due to security and privacy concerns.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock size={16} className="text-accent-light shrink-0 mt-1" />
                    <span>Verified documents shared only upon legitimate request by authorities or legal entities.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-bg border border-border p-8 rounded-3xl space-y-6">
                <h3 className="font-display text-xl font-bold text-text">Compliance Commitment</h3>
                <ul className="space-y-4 text-[14px] text-text-muted">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-success" />
                    Operating with integrity and legal compliance
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-success" />
                    Following all statutory requirements
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-success" />
                    Maintaining accountability & ethical conduct
                  </li>
                </ul>
              </div>

              <div className="text-center p-6 border-2 border-dashed border-border rounded-3xl space-y-2">
                <p className="text-[13px] text-text-light">For verification or official inquiries:</p>
                <Link href="/ContactUs" className="font-bold text-primary hover:underline">Contact Official Channels</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
