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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";
import { VolunteerFiltersDialog } from "./VolunteerFiltersDialog";
import {
  getAllVolunteers,
  VolunteerResponse,
} from "@/features/public/volunteer";
import {
  updateVolunteerStatus,
  downloadVolunteersExport,
  downloadVolunteerDossierPDF,
  VolunteerFilterParams,
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

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [sort, setSort] = useState<string>("newest");
  const [filters, setFilters] = useState<VolunteerFilterParams>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

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
  const [prevStatus, setPrevStatus] = useState(status);
  const [prevSort, setPrevSort] = useState(sort);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [prevPage, setPrevPage] = useState(page);
  const [prevLimit, setPrevLimit] = useState(limit);

  if (
    debouncedSearch !== prevSearch ||
    status !== prevStatus ||
    sort !== prevSort ||
    JSON.stringify(filters) !== JSON.stringify(prevFilters)
  ) {
    setPrevSearch(debouncedSearch);
    setPrevStatus(status);
    setPrevSort(sort);
    setPrevFilters(filters);
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
        q: debouncedSearch,
        status: status !== "ALL" ? status : undefined,
        sort,
        ...filters,
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
  }, [page, limit, debouncedSearch, status, sort, filters]);

  const updateVolunteerAppStatus = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING",
  ) => {
    try {
      await updateVolunteerStatus(id, newStatus);
      setVolunteers((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
      );
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
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
      await downloadVolunteersExport(format, {
        q: debouncedSearch,
        status: status !== "ALL" ? status : undefined,
        sort,
        ...filters,
      });
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.profession && filters.profession !== "All") count++;
    if (filters.state) count++;
    if (filters.city) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.status && filters.status !== "ALL" && status === "ALL") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const columns = getVolunteerAppsColumns(
    updateVolunteerAppStatus,
    handleViewDetails,
  );

  return (
    <Card shape="mobile-flush" className="w-full bg-transparent sm:bg-surface">
      <CardHeader className="flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Volunteer Applications</CardTitle>
            <p className="text-xs text-text-muted mt-1">
              {totalRows} applicant{totalRows === 1 ? "" : "s"} across all
              regions
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              className="whitespace-nowrap"
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
              title="Export volunteer applicant database as CSV"
            >
              Export CSV
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="secondary"
              size="sm"
              startIcon={
                <FileText size={15} className="text-primary shrink-0" />
              }
              onClick={() => handleExport("pdf")}
              loading={isExportingPDF}
              title="Export volunteer roster audit PDF"
            >
              Export PDF
            </Button>
          </div>
        </div>

        {/* Quick Status Filter Pills (Mobile Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { label: "All Applicants", value: "ALL" },
            { label: "Pending Review", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Suspended", value: "SUSPENDED" },
          ].map((item) => (
            <Badge
              key={item.value}
              variant={status === item.value ? "default" : "outline"}
              className="cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onClick={() => {
                setStatus(item.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setStatus(item.value);
                  setPage(1);
                }
              }}
            >
              {item.label}
            </Badge>
          ))}
        </div>

        {/* Filter, Search & Sort Toolbar (Mobile-First) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
          <div className="flex items-center gap-2 w-full sm:w-80">
            <div className="flex-1">
              <Input
                placeholder="Search name, phone, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
                size="sm"
                // shape="pill"
              />
            </div>
            <Button
              variant={activeFiltersCount > 0 ? "default" : "secondary"}
              size="sm"
              className="shrink-0 relative"
              onClick={() => setIsFilterDialogOpen(true)}
              startIcon={<SlidersHorizontal size={15} />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-44">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="city_asc">City (A-Z)</SelectItem>
                  <SelectItem value="profession">Profession</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TableComponent
          headers={columns}
          data={volunteers}
          loading={isLoading}
          emptyMessage="No volunteer applications found matching current criteria"
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

      {/* Advanced Filters Modal */}
      <VolunteerFiltersDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={{
          ...filters,
          status: status !== "ALL" ? status : filters.status,
        }}
        onApply={(updated) => {
          if (updated.status && updated.status !== status) {
            setStatus(updated.status);
          }
          setFilters(updated);
        }}
        onReset={() => {
          setFilters({});
          setStatus("ALL");
        }}
      />

      {/* Volunteer Application Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          size="xl"
          className="max-h-[85vh] overflow-hidden"
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
};;
