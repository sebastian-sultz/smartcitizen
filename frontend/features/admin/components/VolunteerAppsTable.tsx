"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";
import { getAllVolunteers, deleteVolunteer, VolunteerResponse } from "@/features/public/volunteer";
import { Badge } from "@/components/ui/Badge";

export const VolunteerAppsTable = () => {
  const [volunteers, setVolunteers] = useState<VolunteerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllVolunteers();
      if (res && res.volunteers) {
        setVolunteers(res.volunteers);
      }
    } catch (err) {
      console.error("Failed to load volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const updateVolunteerAppStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      if (status === 'Rejected') {
        await deleteVolunteer(id);
        setVolunteers(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleViewDetails = (volunteer: VolunteerResponse) => {
    setSelectedVolunteer(volunteer);
    setDetailsOpen(true);
  };

  const columns = getVolunteerAppsColumns(updateVolunteerAppStatus, handleViewDetails);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <TableComponent 
            headers={columns} 
            data={volunteers} 
            emptyMessage="No volunteer applications found" 
            className="shadow-none border-0" 
          />
        )}
      </CardContent>

      {/* Volunteer Application Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="border-b border-border/80 pb-3 shrink-0">
            <DialogTitle className="font-display font-bold text-text text-base sm:text-lg">
              Volunteer Application Details
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted mt-1 font-medium">
              Full profile info for NGO coordinator applicant
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 pt-4">
            {selectedVolunteer && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border/40 pb-6">
                  {selectedVolunteer.image ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-muted">
                      <Image
                        src={selectedVolunteer.image}
                        alt={selectedVolunteer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl bg-primary/10 border-2 border-primary/20 text-primary shrink-0">
                      {selectedVolunteer.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="text-center sm:text-left min-w-0">
                    <h3 className="font-display font-bold text-lg text-text truncate">
                      {selectedVolunteer.name}
                    </h3>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Profession / Status</span>
                    <span className="font-bold text-text">{selectedVolunteer.profession || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Email Address</span>
                    <span className="font-bold text-text">{selectedVolunteer.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Primary Phone</span>
                    <span className="font-bold text-text">{selectedVolunteer.phone}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Alternate Phone</span>
                    <span className="font-bold text-text">{selectedVolunteer.alternate_phone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Pincode</span>
                    <span className="font-bold text-text">{selectedVolunteer.pincode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">City</span>
                    <span className="font-bold text-text">{selectedVolunteer.city || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">District</span>
                    <span className="font-bold text-text">{selectedVolunteer.district || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Public Consent</span>
                    <Badge variant={selectedVolunteer.ispublicconsent ? "success" : "secondary"}>
                      {selectedVolunteer.ispublicconsent ? "Accepted" : "Not Accepted"}
                    </Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold text-text-muted mb-1">Address</span>
                    <span className="font-bold text-text">{selectedVolunteer.address || "N/A"}</span>
                  </div>
                  <div className="sm:col-span-2 border-t border-border/40 pt-4 mt-2">
                    <span className="block text-xs font-semibold text-text-muted mb-1">Prior Experience & Skills</span>
                    <p className="font-medium text-text bg-bg p-4 rounded-2xl border border-border/40 whitespace-pre-wrap leading-relaxed">
                      {selectedVolunteer.experience || "No experience details provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


