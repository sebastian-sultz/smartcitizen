import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface ExportFYDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFY: string;
  onSelectedFYChange: (fy: string) => void;
  fyOptions: string[];
  onExport: () => void;
}

export const ExportFYDialog = ({
  open,
  onOpenChange,
  selectedFY,
  onSelectedFYChange,
  fyOptions,
  onExport,
}: ExportFYDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Select Financial Year</DialogTitle>
          <DialogDescription>Choose fiscal year to retrieve success PAN-registered donations</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-muted">Financial Year (FY)</span>
            <Select value={selectedFY} onValueChange={onSelectedFYChange}>
              <SelectTrigger className="bg-bg/40 font-semibold">
                <SelectValue placeholder="Select FY" />
              </SelectTrigger>
              <SelectContent>
                {fyOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={onExport}
              startIcon={<Download size={16} />}
            >
              Download CSV
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
