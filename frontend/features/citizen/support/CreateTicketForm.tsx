"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import { Card } from "@/components/ui/Card";
import { MessageSquare, ArrowLeft, CircleQuestionMark } from "lucide-react";
import { toast } from "sonner";
import { CreateSupportTicketPayload } from "@/features/shared/reports";

interface CreateTicketFormProps {
  onSubmit: (values: CreateSupportTicketPayload) => Promise<void>;
  onCancel: () => void;
}

export default function CreateTicketForm({
  onSubmit,
  onCancel,
}: CreateTicketFormProps) {
  const formik = useFormik<CreateSupportTicketPayload>({
    initialValues: {
      subject: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      subject: Yup.string()
        .required("Subject is required")
        .min(6, "Subject must be at least 6 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(15, "Please explain in at least 15 characters"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSubmit(values);
        toast.success("Support ticket successfully lodged!");
      } catch (err: any) {
        console.error("Lodge ticket failed:", err);
        const errMsg =
          err?.message || (typeof err === "string" ? err : "Unknown error");
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
          title="Cancel"
        >
          <ArrowLeft size={15} />
        </Button>
        <h3 className="font-display text-base font-bold text-text flex items-center gap-2">
          <CircleQuestionMark size={16} className="text-primary" />
          Report New Issue
        </h3>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-0"
      >
        <Input
          label="Issue Title"
          placeholder="e.g. 80G Tax receipt missing for FY 2025"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject ? formik.errors.subject : undefined}
          size="sm"
        />

        <Textarea
          label="Issue Description"
          name="description"
          rows={5}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Explain your problem in detail. Include transaction IDs, dates, or error contexts."
          error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
          size="sm"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border/60 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={formik.isSubmitting}
            size="sm"
          >
            Report Issue
          </Button>
        </div>
      </form>
    </Card>
  );
}
