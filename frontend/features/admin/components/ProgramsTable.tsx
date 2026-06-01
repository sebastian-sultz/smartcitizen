"use client";

import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent as apiDeleteEvent, getUsersByEventId } from "@/features/citizen/community/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { getProgramsColumns } from "./ProgramsColumns";
import { toast } from "sonner";
import { CreateProgramModal } from "./CreateProgramModal";
import { useAlert } from "@/components/ui/AlertProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

import { EventResponse, EventRegistration } from "@/features/citizen/community";

export const ProgramsTable = () => {
  const { showConfirm } = useAlert();
  const [programs, setPrograms] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Participants states
  const [participants, setParticipants] = useState<EventRegistration[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedProgramName, setSelectedProgramName] = useState<string>("");
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const fetchPrograms = async () => {
    try {
      const res = await getAllEvents(undefined, page, limit);
      if (res && res.events) {
        setPrograms(res.events);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchPrograms();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, limit]);

  const deleteProgram = async (id: string) => {
    try {
      await apiDeleteEvent(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
      toast.success("Program deleted successfully");
    } catch (err) {
      console.error("Failed to delete program:", err);
    }
  };

  const handleViewParticipants = async (id: string, name: string) => {
    setSelectedProgramName(name);
    setParticipantsOpen(true);
    setParticipantsLoading(true);
    try {
      const data = await getUsersByEventId(id);
      setParticipants(data);
    } catch (err) {
      console.error("Failed to load participants:", err);
      toast.error("Failed to load program participants");
    } finally {
      setParticipantsLoading(false);
    }
  };

  const columns = getProgramsColumns(deleteProgram, showConfirm, handleViewParticipants);

  const participantColumns: Header<EventRegistration>[] = [
    {
      label: "Name",
      render: (reg) => <span className="text-[14px] font-bold text-text">{reg.user?.name || "N/A"}</span>,
    },
    {
      label: "Phone",
      render: (reg) => <span className="text-[14px] text-text-muted">{reg.user?.phone || "N/A"}</span>,
    },
    {
      label: "Registered At",
      render: (reg) => (
        <span className="text-[14px] text-text-muted">
          {formatDate(reg.created_at, "default")}
        </span>
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>Program Management</CardTitle>
        <Button 
          size="sm" 
          variant="primary" 
          startIcon={<Plus size={16} />}
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto"
        >
          Create Program
        </Button>
        <CreateProgramModal open={open} onOpenChange={setOpen} onSuccess={fetchPrograms} />
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={programs} 
          loading={loading}
          emptyMessage="No programs found" 
          className="shadow-none border-0" 
          pagination={{
            page,
            limit,
            total: totalRows,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            }
          }}
        />
      </CardContent>

      {/* View Participants Dialog */}
      <Dialog open={participantsOpen} onOpenChange={setParticipantsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-6">
          <DialogHeader className="border-b border-border/80 pb-3 shrink-0">
            <DialogTitle className="font-display font-bold text-text text-base sm:text-lg">
              Program Participants
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted mt-1 font-medium">
              Registered users for: <span className="font-bold text-text">{selectedProgramName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 pt-4">
            <TableComponent
              headers={participantColumns}
              data={participants}
              loading={participantsLoading}
              emptyMessage="No participants registered for this program yet."
              className="shadow-none border border-border/40 rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
