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
import { Textarea } from "@/components/ui/Textarea";
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

import { nameSchema, phoneSchema, addressSchema, futureDateSchema, citySchema, trimmedString } from "@/lib/validation";

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const programSchema = Yup.object().shape({
  event_name: addressSchema("Program name is required"),
  event_type: trimmedString().oneOf(["Event", "Initiative"]).required("Program type is required"),
  event_date: futureDateSchema("Program date & time is required"),
  event_address: addressSchema("Program location is required"),
  organizer_name: nameSchema("Organizer name is required"),
  organizer_phone: phoneSchema("Organizer phone is required"),
  description: trimmedString().nullable(),
  category: citySchema().nullable(),
  cta_text: trimmedString().nullable(),
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

  const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

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
        const errorMsg = err instanceof Error ? err.message : "Failed to create program";
        toast.error(errorMsg);
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
      <DialogContent size="xl" className="max-h-[90vh] overflow-hidden gap-0">
        <DialogHeader className="shrink-0 pb-4 border-b border-border/50">
          <DialogTitle>
            Create New Program
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new program, initiative, or workshop to the portal.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 flex flex-col min-h-0 mt-4"
        >
          <div className="space-y-6 flex-1 overflow-y-auto py-4">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted block border-b border-border/20 pb-1">
                1. Basic Info
              </h4>
              <Input
                label="Program Name"
                placeholder="Awareness & Guidance Program"
                icon={<FileText size={18} />}
                disabled={formik.isSubmitting}
                size="sm"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  disabled={formik.isSubmitting}
                  value={formik.values.event_type}
                  onValueChange={(val) => formik.setFieldValue("event_type", val)}
                >
                  <SelectTrigger
                    id="event_type"
                    size="sm"
                    label="Program Type"
                    error={
                      formik.touched.event_type
                        ? (formik.errors.event_type as string)
                        : undefined
                    }
                  >
                    <SelectValue placeholder="Select Program Type" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Initiative">Initiative</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  disabled={formik.isSubmitting}
                  value={formik.values.category}
                  onValueChange={(val) => formik.setFieldValue("category", val)}
                >
                  <SelectTrigger
                    id="category"
                    size="sm"
                    label="Category"
                    error={
                      formik.touched.category
                        ? (formik.errors.category as string)
                        : undefined
                    }
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 2: Schedule & Location */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted block border-b border-border/20 pb-1">
                2. Schedule & Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <Input
                    label="Program Date & Time"
                    type="datetime-local"
                    icon={<Calendar size={18} />}
                    disabled={formik.isSubmitting}
                    size="sm"
                    name="event_date"
                    min={minDateTime}
                    value={formik.values.event_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.event_date
                        ? (formik.errors.event_date as string)
                        : undefined
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Program Address / Location"
                    placeholder="Community Hall, Sector 12, Dwarka, New Delhi"
                    icon={<MapPin size={18} />}
                    disabled={formik.isSubmitting}
                    size="sm"
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
                </div>
              </div>
            </div>

            {/* Section 3: Organizer Details */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted block border-b border-border/20 pb-1">
                3. Organizer Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Organizer Name"
                  placeholder="GlobalSmart Core Team"
                  icon={<User size={18} />}
                  disabled={formik.isSubmitting}
                  size="sm"
                  name="organizer_name"
                  value={formik.values.organizer_name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s{2,}/g, " ");
                    formik.setFieldValue("organizer_name", val);
                  }}
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
                  size="sm"
                  name="organizer_phone"
                  value={formik.values.organizer_phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formik.setFieldValue("organizer_phone", val);
                  }}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={
                    formik.touched.organizer_phone
                      ? (formik.errors.organizer_phone as string)
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Section 4: Media & Description */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted block border-b border-border/20 pb-1">
                4. Description & Banner
              </h4>
              <Textarea
                id="description"
                label="Description"
                placeholder="Write a clear description of the program details, agenda, and target audience..."
                rows={4}
                disabled={formik.isSubmitting}
                size="sm"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && formik.errors.description
                    ? (formik.errors.description as string)
                    : undefined
                }
              />

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
                      variant="ghost-danger"
                      size="icon"
                      shape="square"
                      onClick={handleRemoveImage}
                      className="shrink-0 transition-colors"
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
          </div>

          {/* Dialog Footer */}
          <DialogFooter>
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
