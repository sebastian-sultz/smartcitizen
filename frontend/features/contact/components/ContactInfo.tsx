import { MapPin, Phone, Mail } from "lucide-react";

// Custom Brand Icons
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

export const ContactInfo = () => {
  return (
    <div className="lg:w-1/3 space-y-12">
      <div className="space-y-8">
        <h3 className="font-display text-3xl font-bold text-text">Find Us</h3>
        <div className="space-y-6">
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Address</p>
              <p className="text-text-muted leading-relaxed">139/2 Bhulaika Pura, Teliarganj, Allahabad (U.P.) – 211001</p>
            </div>
          </div>
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Phone</p>
              <p className="text-text-muted">84 29 69 69 69</p>
            </div>
          </div>
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Email</p>
              <p className="text-text-muted break-all">globalsmartcitizensfoundation@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-border">
        <p className="font-bold text-text uppercase tracking-widest text-[13px]">Follow Us</p>
        <div className="flex gap-4">
          {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
