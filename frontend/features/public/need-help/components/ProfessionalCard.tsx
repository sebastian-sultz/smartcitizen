import { MapPin, Briefcase, Phone, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { VolunteerResponse } from "@/features/public/volunteer/types";

export const ProfessionalCard = (vol: VolunteerResponse) => {
  const location =
    [vol.city, vol.district].filter(Boolean).join(", ") ||
    vol.address ||
    "India";

  const expertiseSummary =
    vol.experience.length > 60
      ? vol.experience.substring(0, 60) + "..."
      : vol.experience || "Community Support";

  return (
    <Card className="rounded-2xl p-6 shadow-card hover:shadow-xl transition-all group">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden border border-primary/20">
          {vol.image ? (
            <Image
              src={vol.image}
              alt={vol.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span className="font-display font-bold text-xl">
              {vol.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-text truncate">
              {vol.name}
            </h3>
            <Badge variant="success" size="xs" className="shrink-0">
              Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-accent text-[12px] font-bold uppercase tracking-widest mt-1">
            <Briefcase size={14} />
            <span className="truncate">
              {vol.profession || "Volunteer Coordinator"}
            </span>
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
          <h4 className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">
            Expertise
          </h4>
          <p className="text-[14px] text-text font-medium">{expertiseSummary}</p>
        </div>
        <p className="text-[14px] text-text-muted leading-relaxed line-clamp-3">
          {vol.experience ||
            "Smart Citizen Coordinator assisting with community projects and guidance."}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 pt-6 border-t border-border">
        <Button variant="success" className="flex-1">
          <MessageCircle size={18} className="mr-2" />
          WhatsApp
        </Button>
        {vol.ispublicconsent ? (
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
    </Card>
  );
};
