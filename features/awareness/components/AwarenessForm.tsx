"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
  const defaultValues = initialValues || {
    title: "",
    categoryId: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    status: "Active",
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent showCloseButton={true} className="p-0 overflow-hidden max-w-2xl gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-bg/30 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-text">
            {initialValues ? "Edit Awareness Activity" : "Create New Awareness Activity"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={defaultValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Form Values:", values);
            setTimeout(() => {
               alert("Activity saved successfully!");
              setSubmitting(false);
              onClose();
            }, 1000);
          }}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="title" className="text-sm font-semibold text-text ml-1 block">Activity Title</label>
                  <Field
                    name="title"
                    className={`w-full px-6 py-4 bg-bg border rounded-xl outline-none transition-all focus:border-primary ${
                      errors.title && touched.title ? "border-red-500" : "border-border"
                    }`}
                    placeholder="e.g. Tree Plantation Drive"
                  />
                  <ErrorMessage name="title" component="p" className="text-xs text-red-500 mt-1 ml-1" />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="categoryId" className="text-sm font-semibold text-text ml-1 block">Category</label>
                  <Select 
                    value={values.categoryId} 
                    onValueChange={(val) => setFieldValue("categoryId", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat1">Environment</SelectItem>
                      <SelectItem value="cat2">Health</SelectItem>
                      <SelectItem value="cat3">Education</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.categoryId && touched.categoryId && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.categoryId}</p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="date" className="text-sm font-semibold text-text ml-1 block">Activity Date</label>
                  <Field
                    type="date"
                    name="date"
                    className={`w-full px-6 py-4 bg-bg border rounded-xl outline-none transition-all focus:border-primary ${
                      errors.date && touched.date ? "border-red-500" : "border-border"
                    }`}
                  />
                  <ErrorMessage name="date" component="p" className="text-xs text-red-500 mt-1 ml-1" />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="description" className="text-sm font-semibold text-text ml-1 block">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className={`w-full px-6 py-4 bg-bg border rounded-xl outline-none transition-all focus:border-primary resize-none ${
                      errors.description && touched.description ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Provide details about the activity..."
                  />
                  <ErrorMessage name="description" component="p" className="text-xs text-red-500 mt-1 ml-1" />
                </div>

                {/* Image Upload (Visual Placeholder) */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-text block mb-1.5 ml-1">Cover Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-bg/50 hover:bg-bg transition-colors cursor-pointer group">
                    <Upload className="text-text-light group-hover:text-primary transition-colors mb-2" size={32} />
                    <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-light mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-3 ml-1 md:col-span-2">
                  <span className="text-sm font-semibold text-text">Status:</span>
                  <div className="flex items-center">
                    <Switch 
                      checked={values.status === "Active"} 
                      onCheckedChange={(checked) => setFieldValue("status", checked ? "Active" : "Inactive")}
                    />
                    <span className="ml-3 text-sm font-bold text-text">{values.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-end space-x-3 bg-bg/30 -mx-6 -mb-6 px-6 py-4">
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
                  loading={isSubmitting}
                  startIcon={!isSubmitting && <Save size={18} />}
                  className="px-8 py-2.5 text-sm font-bold"
                >
                  Save Activity
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
