"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/Card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CreateSupportTicketPayload } from "../types";

interface CreateTicketFormProps {
  onSubmit: (values: CreateSupportTicketPayload) => Promise<void>;
  onCancel: () => void;
}

export default function CreateTicketForm({ onSubmit, onCancel }: CreateTicketFormProps) {
  const formik = useFormik<CreateSupportTicketPayload>({
    initialValues: {
      category: "donation",
      priority: "low",
      subject: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      category: Yup.string().required("Category is required"),
      priority: Yup.string().required("Priority is required"),
      subject: Yup.string().required("Subject is required").min(6, "Subject must be at least 6 characters"),
      description: Yup.string().required("Description is required").min(15, "Please explain in at least 15 characters"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSubmit(values);
        toast.success("Support ticket successfully lodged!");
      } catch (err: any) {
        console.error("Lodge ticket failed:", err);
        const errMsg = err?.message || (typeof err === "string" ? err : "Unknown error");
        toast.error(`Failed to lodge support ticket: ${errMsg}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="p-5 md:p-6 flex flex-col h-full rounded-[30px] shadow-none bg-white">
      <div className="flex items-center gap-3 pb-4 border-b border-border/60 shrink-0">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost-muted"
          size="icon-sm"
          shape="circle"
          className="w-7 h-7 flex items-center justify-center p-0"
          title="Cancel"
        >
          <ArrowLeft size={15} />
        </Button>
        <h3 className="font-display text-base font-bold text-text flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          Lodge Support Ticket
        </h3>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-text ml-1 block">Category</label>
            <Select 
              value={formik.values.category} 
              onValueChange={(val) => formik.setFieldValue("category", val)}
            >
              <SelectTrigger className="px-4 py-2.5 rounded-xl border border-border h-auto text-sm">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="donation">Donation & Tax receipt</SelectItem>
                <SelectItem value="volunteer">Volunteer coordinator application</SelectItem>
                <SelectItem value="account">Account & credentials</SelectItem>
                <SelectItem value="technical">Technical bug / Website issue</SelectItem>
                <SelectItem value="other">General inquiry / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-text ml-1 block">Priority</label>
            <Select 
              value={formik.values.priority} 
              onValueChange={(val) => formik.setFieldValue("priority", val)}
            >
              <SelectTrigger className="px-4 py-2.5 rounded-xl border border-border h-auto text-sm">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="low">Low (General queries)</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High (Billing issues)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Input
          label="Subject"
          placeholder="e.g. 80G Tax receipt missing for FY 2025"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject ? formik.errors.subject : undefined}
          className="py-2.5 px-4 text-sm"
        />

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-text ml-1 block">Description</label>
          <textarea
            name="description"
            rows={5}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Explain your problem in detail. Include transaction IDs, dates, or error contexts."
            className={`w-full rounded-xl border border-border bg-bg p-3.5 text-sm transition-all outline-none focus:border-primary placeholder:text-text-muted ${
              formik.touched.description && formik.errors.description ? "border-red-500" : ""
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-[11px] font-semibold ml-1">{formik.errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/60 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-xl px-5 py-2 h-auto text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={formik.isSubmitting}
            className="rounded-xl px-5 py-2 h-auto text-xs font-bold"
          >
            Lodge Issue
          </Button>
        </div>
      </form>
    </Card>
  );
}
