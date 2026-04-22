import Link from "next/link";
import { MessageCircle, MapPin, Phone, Mail, Globe } from "lucide-react";

// Custom Brand Icons (Lucide doesn't include brand logos)
const Facebook = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-1 2.17-2 2.85c.95.03 1.94-.35 2.5-1.15-.43.34-1.1.65-1.9.77-1-.62-2.32-1.02-3.6-1.02-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.12 1.03-3.74-.2-7.07-2-9.3-4.72-.4.7-.63 1.5-.63 2.37 0 1.56.78 2.94 2 3.75-.73-.03-1.42-.23-2-.55v.06c0 2.18 1.56 4 3.63 4.42-.38.1-.78.15-1.2.15-.3 0-.6-.03-.88-.1.57 1.8 2.25 3.1 4.25 3.13-1.57 1.23-3.55 1.97-5.7 1.97-.37 0-.73-.02-1.1-.06 2.02 1.3 4.43 2.05 7.02 2.05 8.42 0 13.03-6.97 13.03-13.03 0-.2 0-.4-.01-.6.9-.64 1.67-1.44 2.28-2.35z" />
  </svg>
);

const Youtube = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-24 pb-8">
      <div className="max-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: About */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="font-display text-2xl font-black leading-none">GlobalSmart</span>
              <span className="font-body text-[11px] uppercase tracking-widest font-light opacity-80">
                Citizens Foundation
              </span>
            </Link>
            <p className="text-white/70 text-[15px] leading-relaxed">
              GlobalSmart Citizens Foundation is a registered non-profit working
              to educate, empower, and uplift communities across India.
            </p>
            <div className="space-y-1 text-[13px] text-white/50">
              <p>Registered under Section 8, Companies Act 2013</p>
              <p>12A & 80G Certified | NGO Darpan Registered</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: MessageCircle, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-bold text-accent">Quick Links</h4>
            <ul className="space-y-3 text-[15px] text-white/70">
              {[
                { name: "Home", href: "/" },
                { name: "About the Foundation", href: "/About" },
                { name: "Mission & Vision", href: "/mission" },
                { name: "Our Programs", href: "/ourwork" },
                { name: "Our Activities", href: "/ouractivity" },
                { name: "Upcoming Events", href: "/events" },
                { name: "Awareness Blogs", href: "/blogs" },
                { name: "Join as Volunteer", href: "/JoinUs" },
                { name: "Get Help", href: "/ContactUs" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-bold text-accent">Legal & Policies</h4>
            <ul className="space-y-3 text-[15px] text-white/70">
              {[
                { name: "Terms & Conditions", href: "/term" },
                { name: "Privacy Policy", href: "/privacy_policy" },
                { name: "Refund Policy", href: "/return_policy" },
                { name: "Legal Documents", href: "/Legal_Documents" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Donate */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-bold text-accent">Contact & Donate</h4>
            <div className="space-y-4 text-[14px] text-white/70">
              <div className="flex gap-3">
                <MapPin className="text-accent shrink-0" size={18} />
                <p>139/2 Bhulaika Pura, Teliarganj, Allahabad (U.P.) – 211001</p>
              </div>
              <div className="flex gap-3">
                <Phone className="text-accent shrink-0" size={18} />
                <p>84 29 69 69 69</p>
              </div>
              <div className="flex gap-3">
                <Mail className="text-accent shrink-0" size={18} />
                <p className="break-all">globalsmartcitizensfoundation@gmail.com</p>
              </div>
              <div className="flex gap-3">
                <Globe className="text-accent shrink-0" size={18} />
                <p>globalsmartcitizensfoundation.org</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mt-4">
              <p className="text-[12px] font-bold uppercase tracking-wider text-accent-light">Bank Details</p>
              <div className="text-[13px] space-y-1">
                <p><span className="text-white/40">Bank:</span> HDFC Bank</p>
                <p><span className="text-white/40">A/C:</span> 50200119596441</p>
                <p><span className="text-white/40">IFSC:</span> HDFC0000226</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/40">
          <p>© {currentYear} GlobalSmart Citizens Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/term" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy_policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/return_policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
