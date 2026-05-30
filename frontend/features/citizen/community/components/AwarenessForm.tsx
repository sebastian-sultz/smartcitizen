"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAlert } from "@/components/ui/AlertProvider";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title too short")
    .max(100, "Title too long")
    .required("Title is required"),
  categoryId: Yup.string().required("Category is required"),
  description: Yup.string()
    .min(20, "Please provide more details")
    .required("Description is required"),
  date: Yup.date().required("Date is required"),
  status: Yup.string().oneOf(["Active", "Inactive"]).required(),
});

interface AwarenessFormProps {
  initialValues?: {
    title: string;
    categoryId: string;
    description: string;
    date: string;
    status: string;
  };
  onClose: () => void;
}

export function AwarenessForm({ initialValues, onClose }: AwarenessFormProps) {
  const { showAlert } = useAlert();
  const defaultValues = initialValues || {
    title: "",
    categoryId: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    status: "Active",
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form Values:", values);
      setTimeout(() => {
        showAlert({
          title: "Activity Saved",
          message: "Activity saved successfully!",
          type: "success",
          onClose: () => {
            onClose();
          }
        });
        setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent showCloseButton={true} className="p-0 sm:p-0 overflow-hidden max-w-2xl gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-border bg-bg/30 flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-xl font-bold text-text">
            {initialValues ? "Edit Awareness Activity" : "Create New Awareness Activity"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <Input
                  id="title"
                  name="title"
                  label="Activity Title *"
                  placeholder="e.g. Tree Plantation Drive"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title ? (formik.errors.title as string) : undefined}
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label id="category-label" htmlFor="categoryId" className="text-sm font-semibold text-text ml-1 block">Category</label>
                <Select 
                  value={formik.values.categoryId} 
                  onValueChange={(val) => formik.setFieldValue("categoryId", val)}
                >
                  <SelectTrigger id="categoryId" aria-labelledby="category-label" className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat1">Environment</SelectItem>
                    <SelectItem value="cat2">Health</SelectItem>
                    <SelectItem value="cat3">Education</SelectItem>
                  </SelectContent>
                </Select>
                {formik.errors.categoryId && formik.touched.categoryId && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{formik.errors.categoryId}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  label="Activity Date *"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && formik.errors.date ? (formik.errors.date as string) : undefined}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="description" className="text-sm font-semibold text-text ml-1 block">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-6 py-4 bg-bg border rounded-xl outline-none transition-all focus:border-primary resize-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    formik.errors.description && formik.touched.description ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Provide details about the activity..."
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{formik.errors.description}</p>
                )}
              </div>

              {/* Image Upload (Visual Placeholder) */}
              <div className="md:col-span-2">
                <label htmlFor="coverImage" className="text-sm font-semibold text-text block mb-1.5 ml-1">Cover Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="coverImage" 
                    className="sr-only peer" 
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        showAlert({
                          title: "File Selected",
                          message: `Mock file selected: ${file.name}`,
                          type: "info"
                        });
                      }
                    }}
                  />
                  <label 
                    htmlFor="coverImage" 
                    className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-bg/50 hover:bg-bg transition-all cursor-pointer group peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
                  >
                    <Upload className="text-text-light group-hover:text-primary transition-colors mb-2" size={32} />
                    <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-light mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center space-x-3 ml-1 md:col-span-2">
                <span className="text-sm font-semibold text-text">Status:</span>
                <div className="flex items-center">
                  <Switch 
                    checked={formik.values.status === "Active"} 
                    onCheckedChange={(checked) => formik.setFieldValue("status", checked ? "Active" : "Inactive")}
                  />
                  <span className="ml-3 text-sm font-bold text-text">{formik.values.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end space-x-3 bg-bg/30 shrink-0">
            <Button
              type="button"
              variant="ghost-muted"
              onClick={onClose}
              className="px-6 py-2.5 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formik.isSubmitting}
              startIcon={!formik.isSubmitting && <Save size={18} />}
              className="px-8 py-2.5 text-sm font-bold"
            >
              Save Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
