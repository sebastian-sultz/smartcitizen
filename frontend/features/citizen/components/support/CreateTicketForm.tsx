"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAlert } from "@/components/ui/AlertProvider";
import { createSupportTicket } from "../../api";

interface CreateTicketFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateTicketForm({ onSuccess, onCancel }: CreateTicketFormProps) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      subject: "",
      description: "",
      priority: "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      subject: Yup.string().required("Subject is required").min(5, "Subject is too short"),
      description: Yup.string().required("Description is required").min(15, "Please describe the problem in more detail"),
      priority: Yup.string().required("Priority level is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        // Call simulated API to append to the mutable session state
        await createSupportTicket({
          category: values.category as any,
          subject: values.subject,
          description: values.description,
          priority: values.priority as any,
        });

        showAlert({
          title: "Ticket Logged",
          message: "Your support request has been registered. We will update you shortly.",
          type: "success",
        });
        onSuccess();
      } catch (err) {
        console.error("Failed to create ticket:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div>
          <label id="tkt-category-label" className="text-xs font-bold text-text-muted mb-1 block">Help Category *</label>
          <Select 
            value={formik.values.category} 
            onValueChange={(val) => formik.setFieldValue("category", val)}
          >
            <SelectTrigger aria-labelledby="tkt-category-label" className="rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="donation">Donation & Receipt Issue</SelectItem>
              <SelectItem value="account">Member Profile / Sign-in</SelectItem>
              <SelectItem value="volunteer">Volunteer Application / Drives</SelectItem>
              <SelectItem value="technical">Technical Glitches / Web Error</SelectItem>
              <SelectItem value="other">Other Inquiry</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.category}</p>
          )}
        </div>

        {/* Priority Dropdown */}
        <div>
          <label id="tkt-priority-label" className="text-xs font-bold text-text-muted mb-1 block">Priority Level *</label>
          <Select 
            value={formik.values.priority} 
            onValueChange={(val) => formik.setFieldValue("priority", val)}
          >
            <SelectTrigger aria-labelledby="tkt-priority-label" className="rounded-xl">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (General queries, feedback)</SelectItem>
              <SelectItem value="medium">Medium (Transaction delays, minor errors)</SelectItem>
              <SelectItem value="high">High (Broken features, login blockage)</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.priority && formik.errors.priority && (
            <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.priority}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-xs font-bold text-text-muted mb-1 block">Subject *</label>
        <Input
          name="subject"
          placeholder="E.g. Cannot download FY 24-25 80G tax document"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject && formik.errors.subject ? formik.errors.subject : undefined}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-bold text-text-muted mb-1 block">Detailed Description *</label>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-4 rounded-2xl border border-border bg-bg/30 text-text outline-none focus:border-primary min-h-[120px] resize-none font-medium text-xs leading-relaxed"
          placeholder="Please describe your issue, steps to reproduce, or transaction IDs..."
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.description}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 justify-end border-t border-border pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-2xl px-5 py-3 h-auto font-bold text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/95 text-white rounded-2xl px-5 py-3 h-auto font-bold text-xs shadow-md border-none"
        >
          {loading ? "Logging Ticket..." : "Submit Ticket"}
        </Button>
      </div>
    </form>
  );
}
