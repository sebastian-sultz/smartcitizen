import { MapPin, Phone, Mail } from "lucide-react";
import { Facebook, Instagram, Twitter, Youtube } from "@/components/icons/SocialIcons";

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
