import EmptyState from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";

export const ImpactStories = () => {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-content">
        <EmptyState 
          icon={FileText}
          title="Impact Stories Coming Soon"
          description="We are currently documenting our grassroots success stories. Stay tuned to read how awareness is transforming lives."
        />
      </div>
    </section>
  );
};
