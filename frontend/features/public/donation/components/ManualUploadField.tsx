"use client";

import { Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ManualUploadFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ManualUploadField({ file, onChange, error }: ManualUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[14px] font-bold text-text ml-1 block">
        Payment Receipt Upload *
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative group border-2 border-dashed border-border hover:border-primary/50 transition-all rounded-2xl bg-white p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[140px]"
        >
          <input
            type="file"
            accept="image/*,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            id="receipt-file-input"
            onChange={handleFileChange}
          />
          <div className="p-3 bg-bg text-text-muted group-hover:text-primary rounded-full transition-colors">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-text">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-text-muted mt-1">
              Supports JPEG, PNG, or PDF up to 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text truncate">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(null)}
            className="text-xs font-bold py-2 px-2.5 h-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl"
            aria-label="Remove uploaded file"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-[12px] ml-1 font-medium">{error}</p>
      )}
    </div>
  );
}
