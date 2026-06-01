"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  UploadCloud, 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Tag, 
  FileText
} from "lucide-react";
import Image from "next/image";
import { createEvent } from "@/features/citizen/community/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const programSchema = Yup.object().shape({
  event_name: Yup.string().required("Program name is required"),
  event_type: Yup.string().oneOf(["Event", "Initiative"]).required("Program type is required"),
  event_date: Yup.string().required("Program date & time is required"),
  event_address: Yup.string().required("Program location is required"),
  organizer_name: Yup.string().required("Organizer name is required"),
  organizer_phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Organizer phone is required"),
  description: Yup.string(),
  category: Yup.string(),
  cta_text: Yup.string(),
});

const initialValues = {
  event_name: "",
  event_type: "Event" as "Event" | "Initiative",
  event_date: "",
  event_address: "",
  organizer_name: "",
  organizer_phone: "",
  description: "",
  category: "Community",
  cta_text: "Register Now",
};

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    formik.resetForm();
    handleRemoveImage();
    onOpenChange(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: programSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const isoDate = new Date(values.event_date).toISOString();
        const newProgram = await createEvent({
          ...values,
          event_date: isoDate,
        }, selectedImage);

        if (newProgram && newProgram.id) {
          toast.success("Program created successfully");
          resetForm();
          handleRemoveImage();
          onOpenChange(false);
          onSuccess();
        }
      } catch (err) {
        console.error("Failed to create program:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          handleCancel();
        } else {
          onOpenChange(val);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 sm:p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 sm:px-8 sm:pt-8 border-b border-border bg-surface shrink-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-text">
            Create New Program
          </DialogTitle>
          <DialogDescription className="text-[14px] text-text-light mt-1">
            Fill in the details below to add a new program, initiative, or workshop to the
            portal.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="space-y-5 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            {/* Row 1: Program Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Program Name"
                placeholder="Awareness & Guidance Program"
                icon={<FileText size={18} />}
                disabled={formik.isSubmitting}
                name="event_name"
                value={formik.values.event_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.event_name
                    ? (formik.errors.event_name as string)
                    : undefined
                }
              />
              <Input
                label="Category"
                placeholder="e.g. Community, Environment, Sports"
                icon={<Tag size={18} />}
                disabled={formik.isSubmitting}
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category
                    ? (formik.errors.category as string)
                    : undefined
                }
              />
            </div>

            {/* Row 2: Date & CTA Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Program Date & Time"
                type="datetime-local"
                icon={<Calendar size={18} />}
                disabled={formik.isSubmitting}
                name="event_date"
                value={formik.values.event_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.event_date
                    ? (formik.errors.event_date as string)
                    : undefined
                }
              />
              <Input
                label="CTA Text"
                placeholder="e.g. Register Now, Join as Smart Citizen"
                disabled={formik.isSubmitting}
                name="cta_text"
                value={formik.values.cta_text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.cta_text
                    ? (formik.errors.cta_text as string)
                    : undefined
                }
              />
            </div>

            {/* Row 3: Program Address */}
            <Input
              label="Program Address / Location"
              placeholder="Community Hall, Sector 12, Dwarka, New Delhi"
              icon={<MapPin size={18} />}
              disabled={formik.isSubmitting}
              name="event_address"
              value={formik.values.event_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.event_address
                  ? (formik.errors.event_address as string)
                  : undefined
              }
            />

            {/* Row 4: Organizer Name & Organizer Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Organizer Name"
                placeholder="GlobalSmart Core Team"
                icon={<User size={18} />}
                disabled={formik.isSubmitting}
                name="organizer_name"
                value={formik.values.organizer_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.organizer_name
                    ? (formik.errors.organizer_name as string)
                    : undefined
                }
              />
              <Input
                label="Organizer Phone"
                placeholder="10-digit mobile number"
                type="tel"
                icon={<Phone size={18} />}
                disabled={formik.isSubmitting}
                name="organizer_phone"
                value={formik.values.organizer_phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.organizer_phone
                    ? (formik.errors.organizer_phone as string)
                    : undefined
                }
              />
            </div>

            {/* Row 5: Program Type */}
            <div className="space-y-2">
              <label
                htmlFor="event_type"
                className="text-[14px] font-bold text-text ml-1 block"
              >
                Program Type
              </label>
              <Select
                disabled={formik.isSubmitting}
                value={formik.values.event_type}
                onValueChange={(val) => formik.setFieldValue("event_type", val)}
              >
                <SelectTrigger id="event_type" className="w-full">
                  <SelectValue placeholder="Select Program Type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Event">Event / Workshop</SelectItem>
                  <SelectItem value="Initiative">Initiative</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.event_type && formik.errors.event_type && (
                <p className="text-red-500 text-[12px] ml-1">
                  {formik.errors.event_type as string}
                </p>
              )}
            </div>

            {/* Row 6: Description */}
            <div className="space-y-2 w-full">
              <label
                htmlFor="description"
                className="text-[14px] font-bold text-text ml-1 block"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Write a clear description of the program details, agenda, and target audience..."
                rows={4}
                disabled={formik.isSubmitting}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "w-full rounded-xl bg-bg border outline-none transition-all px-6 py-4 text-text text-[15px] resize-none hover:border-border-hover focus:border-primary focus:ring-1 focus:ring-primary/20",
                  formik.touched.description && formik.errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border focus:border-primary",
                )}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-[12px] ml-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Row 7: Program Image (Optional) */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text ml-1 block">
                Program Image (Optional)
              </label>
              {imagePreview ? (
                <div className="relative group border border-border rounded-xl p-3 bg-bg flex items-center gap-4 transition-all hover:border-primary/30">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Program banner preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {selectedImage?.name}
                    </p>
                    <p className="text-xs text-text-light">
                      {selectedImage
                        ? (selectedImage.size / 1024).toFixed(1)
                        : 0}{" "}
                      KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="shrink-0 text-danger hover:bg-danger/10 hover:text-danger rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border hover:border-primary/50 transition-all rounded-xl p-6 bg-bg hover:bg-white cursor-pointer flex flex-col items-center justify-center gap-2 group text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={formik.isSubmitting}
                  />
                  <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text">
                      Click to upload program banner
                    </p>
                    <p className="text-xs text-text-light">
                      Supports PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="mx-0 mb-0 mt-0 px-6 py-4 sm:px-8 bg-bg-alt/50 border-t border-border flex flex-row items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formik.isSubmitting}
            >
              Create Program
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
