"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, FileSpreadsheet, FileText } from "lucide-react";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";
import {
  getAllVolunteers,
  VolunteerResponse,
} from "@/features/public/volunteer";
import {
  updateVolunteerStatus,
  downloadVolunteersExport,
  downloadVolunteerDossierPDF,
} from "@/features/admin/api";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

export const VolunteerAppsTable = () => {
  const [volunteers, setVolunteers] = useState<VolunteerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingVolunteerDossier, setIsExportingVolunteerDossier] =
    useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal States
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<VolunteerResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  const [prevPage, setPrevPage] = useState(page);
  const [prevLimit, setPrevLimit] = useState(limit);

  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
    setIsLoading(true);
  } else if (page !== prevPage || limit !== prevLimit) {
    setPrevPage(page);
    setPrevLimit(limit);
    setIsLoading(true);
  }

  const fetchVolunteers = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await getAllVolunteers({
        search: debouncedSearch,
        page,
        limit,
      });
      if (res && res.volunteers) {
        setVolunteers(res.volunteers);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error("Failed to load volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers(false);
  }, [page, limit, debouncedSearch]);

  const updateVolunteerAppStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING",
  ) => {
    try {
      await updateVolunteerStatus(id, status);
      setVolunteers((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleViewDetails = (volunteer: VolunteerResponse) => {
    setSelectedVolunteer(volunteer);
    setDetailsOpen(true);
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      if (format === "csv") setIsExportingCSV(true);
      else setIsExportingPDF(true);

      toast.info(
        `Preparing Volunteer Applications ${format.toUpperCase()} export...`,
      );
      await downloadVolunteersExport(format, { q: debouncedSearch });
      toast.success(
        `Volunteer Applications ${format.toUpperCase()} downloaded successfully`,
      );
    } catch (error: unknown) {
      console.error("Volunteer export error:", error);
      toast.error(`Failed to export volunteers as ${format.toUpperCase()}`);
    } finally {
      if (format === "csv") setIsExportingCSV(false);
      else setIsExportingPDF(false);
    }
  };

  const handleDownloadVolunteerDossier = async () => {
    if (!selectedVolunteer) return;
    try {
      setIsExportingVolunteerDossier(true);
      toast.info(
        `Preparing volunteer application dossier for ${selectedVolunteer.name}...`,
      );
      await downloadVolunteerDossierPDF(
        selectedVolunteer.id,
        selectedVolunteer.name,
      );
      toast.success(
        `Dossier for ${selectedVolunteer.name} downloaded successfully`,
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to download volunteer dossier PDF");
    } finally {
      setIsExportingVolunteerDossier(false);
    }
  };

  const columns = getVolunteerAppsColumns(
    updateVolunteerAppStatus,
    handleViewDetails,
  );

  return (
    <Card className="w-full border-0 sm:border rounded-none sm:rounded-[24px] shadow-none sm:shadow-card bg-transparent sm:bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-0 sm:p-8 sm:pb-0">
        <div>
          <CardTitle>Volunteer Applications</CardTitle>
          <p className="text-xs text-text-muted mt-1">
            {totalRows} applicant{totalRows === 1 ? "" : "s"} across all regions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search name, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
              size="sm"
              shape="pill"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              className="flex-1 sm:flex-initial whitespace-nowrap"
              variant="secondary"
              size="sm"
              startIcon={
                <FileSpreadsheet
                  size={15}
                  className="text-emerald-600 shrink-0"
                />
              }
              onClick={() => handleExport("csv")}
              loading={isExportingCSV}
              title="Export complete volunteer applicant database as CSV"
            >
              Export CSV
            </Button>
            <Button
              className="flex-1 sm:flex-initial whitespace-nowrap"
              variant="secondary"
              size="sm"
              startIcon={
                <FileText size={15} className="text-primary shrink-0" />
              }
              onClick={() => handleExport("pdf")}
              loading={isExportingPDF}
              title="Export official volunteer roster audit PDF"
            >
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4 sm:p-8 sm:pt-0">
        <TableComponent
          headers={columns}
          data={volunteers}
          loading={isLoading}
          emptyMessage="No volunteer applications found"
          className="shadow-none border-0"
          pagination={{
            page,
            limit,
            total: totalRows,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
          }}
        />
      </CardContent>

      {/* Volunteer Application Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          size="xl"
          className="max-h-[85vh] flex flex-col p-6 overflow-hidden"
        >
          <DialogHeader className="border-b border-border/60 pb-4 shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle>Volunteer Application Details</DialogTitle>
              <DialogDescription>
                Full profile info for NGO coordinator applicant
              </DialogDescription>
            </div>
            {selectedVolunteer && (
              <Button
                variant="secondary"
                size="sm"
                startIcon={
                  <FileText size={15} className="text-primary shrink-0" />
                }
                onClick={handleDownloadVolunteerDossier}
                loading={isExportingVolunteerDossier}
                title="Download complete volunteer application profile and accreditation dossier PDF"
              >
                Download Dossier (PDF)
              </Button>
            )}
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
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Profession
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.profession || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Status
                    </span>
                    <Badge
                      variant={
                        selectedVolunteer.status === "APPROVED"
                          ? "success"
                          : selectedVolunteer.status === "PENDING"
                            ? "warning"
                            : selectedVolunteer.status === "REJECTED"
                              ? "danger"
                              : selectedVolunteer.status === "SUSPENDED"
                                ? "neutral"
                                : "warning"
                      }
                    >
                      {selectedVolunteer.status || "PENDING"}
                    </Badge>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Email Address
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.email}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Primary Phone
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.phone}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Alternate Phone
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.alternate_phone || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Pincode
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.pincode || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      City
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.city || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      District
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.district || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Public Consent
                    </span>
                    <Badge
                      variant={
                        selectedVolunteer.ispublicconsent
                          ? "success"
                          : "secondary"
                      }
                    >
                      {selectedVolunteer.ispublicconsent
                        ? "Accepted"
                        : "Not Accepted"}
                    </Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Address
                    </span>
                    <span className="font-bold text-text">
                      {selectedVolunteer.address || "N/A"}
                    </span>
                  </div>
                  <div className="sm:col-span-2 border-t border-border/40 pt-4 mt-2">
                    <span className="block text-xs font-semibold text-text-muted mb-1">
                      Prior Experience & Skills
                    </span>
                    <p className="font-medium text-text bg-bg p-4 rounded-2xl border border-border/40 whitespace-pre-wrap leading-relaxed">
                      {selectedVolunteer.experience ||
                        "No experience details provided."}
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
