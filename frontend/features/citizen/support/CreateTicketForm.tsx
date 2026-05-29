"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
      } catch (err) {
        console.error("Lodge ticket failed:", err);
        toast.error("Failed to lodge support ticket.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm max-w-xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost-muted"
          size="icon"
          className="rounded-full w-8 h-8 flex items-center justify-center p-0"
        >
          <ArrowLeft size={16} />
        </Button>
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          Lodge Support Ticket
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text">Category</label>
              <Select 
                value={formik.values.category} 
                onValueChange={(val) => formik.setFieldValue("category", val)}
              >
                <SelectTrigger className="px-6 py-4 rounded-xl border border-border h-auto">
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

            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text">Priority</label>
              <Select 
                value={formik.values.priority} 
                onValueChange={(val) => formik.setFieldValue("priority", val)}
              >
                <SelectTrigger className="px-6 py-4 rounded-xl border border-border h-auto">
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
          />

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text">Description</label>
            <textarea
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Explain your problem in detail. Include transaction IDs, dates, or error contexts."
              className={`w-full rounded-xl border border-border bg-bg p-4 text-base transition-all outline-none focus:border-primary placeholder:text-text-muted ${
                formik.touched.description && formik.errors.description ? "border-red-500" : ""
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs font-semibold">{formik.errors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-2xl px-6 py-2.5 h-auto font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              className="rounded-2xl px-6 py-2.5 h-auto font-bold"
            >
              Lodge Issue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
