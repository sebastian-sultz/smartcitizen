import { MapPin, Briefcase, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ProfessionalCardProps {
  name: string;
  profession: string;
  expertise: string;
  description: string;
  location?: string;
  photoUrl?: string;
  showPhone?: boolean;
}

export const ProfessionalCard = ({
  name,
  profession,
  expertise,
  description,
  location,
  photoUrl,
  showPhone,
}: ProfessionalCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-xl transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden border border-primary/20">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display font-bold text-xl">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-bold text-text truncate">{name}</h3>
          <div className="flex items-center gap-2 text-accent text-[12px] font-bold uppercase tracking-widest mt-1">
            <Briefcase size={14} />
            <span className="truncate">{profession}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5 text-text-muted text-[13px] mt-2">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">Expertise</h4>
          <p className="text-[14px] text-text font-medium">{expertise}</p>
        </div>
        
        <p className="text-[14px] text-text-muted leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 pt-6 border-t border-border">
        <Button className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white">
          <MessageCircle size={18} className="mr-2" />
          WhatsApp
        </Button>
        {showPhone ? (
          <Button variant="outline" className="flex-1">
            <Phone size={18} className="mr-2" />
            Call
          </Button>
        ) : (
          <Button variant="outline" className="flex-1">
            <MessageCircle size={18} className="mr-2" />
            Request
          </Button>
        )}
      </div>
    </div>
  );
};
