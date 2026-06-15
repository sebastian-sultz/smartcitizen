import Link from "next/link";
import { MessageCircle, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Facebook, Instagram, Twitter, Youtube } from "@/components/icons/SocialIcons";
import { CurrentYear } from "@/components/ui/CurrentYear";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 md:pt-24 pb-8">
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
                { icon: Facebook, href: "https://www.facebook.com/people/Dhirendra-Verma/61582196091523/?rdid=yNB82mSR51N964m4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DG2h5JHRw%2F%3Fref%3D1" },
                { icon: Instagram, href: "https://www.instagram.com/global_smartcitizen_foundation?utm_source=qr&igsh=NXk4MnE4OG51YWR6" },
                { icon: Youtube, href: "https://www.youtube.com/@globalsmartcitizensfoundation" },
                { icon: MessageCircle, href: "https://wa.me/918429696969" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
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
                { name: "About the Foundation", href: "/about" },
                { name: "Mission & Vision", href: "/mission" },
                { name: "Our Programs", href: "/our_work" },
                { name: "Upcoming Events", href: "/events" },
                { name: "Join as Smart Citizen", href: "/join_us" },
                { name: "Get Help", href: "/contact_us" },
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
                { name: "Legal Documents", href: "/legal_documents" },
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
                <p className="break-words">globalsmartcitizensfoundation@gmail.com</p>
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
          <p>© <CurrentYear /> GlobalSmart Citizens Foundation. All rights reserved.</p>
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
