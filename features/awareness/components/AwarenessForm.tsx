"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, Upload, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg/30">
          <h3 className="text-xl font-bold text-text">
            {initialValues ? "Edit Awareness Activity" : "Create New Awareness Activity"}
          </h3>
          <Button 
            variant="ghost-muted"
            size="icon"
            shape="circle"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

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
          {({ isSubmitting, errors, touched }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="title" className="text-sm font-semibold text-text">Activity Title</label>
                  <Field
                    name="title"
                    className={`w-full px-4 py-2.5 bg-bg border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                      errors.title && touched.title ? "border-red-50" : "border-border"
                    }`}
                    placeholder="e.g. Tree Plantation Drive"
                  />
                  <ErrorMessage name="title" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="categoryId" className="text-sm font-semibold text-text">Category</label>
                  <Field
                    as="select"
                    name="categoryId"
                    className={`w-full px-4 py-2.5 bg-bg border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                      errors.categoryId && touched.categoryId ? "border-red-500" : "border-border"
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="cat1">Environment</option>
                    <option value="cat2">Health</option>
                    <option value="cat3">Education</option>
                  </Field>
                  <ErrorMessage name="categoryId" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="date" className="text-sm font-semibold text-text">Activity Date</label>
                  <Field
                    type="date"
                    name="date"
                    className={`w-full px-4 py-2.5 bg-bg border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                      errors.date && touched.date ? "border-red-500" : "border-border"
                    }`}
                  />
                  <ErrorMessage name="date" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="description" className="text-sm font-semibold text-text">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className={`w-full px-4 py-2.5 bg-bg border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                      errors.description && touched.description ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Provide details about the activity..."
                  />
                  <ErrorMessage name="description" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Image Upload (Visual Placeholder) */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-text block mb-1.5">Cover Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-bg/50 hover:bg-bg transition-colors cursor-pointer group">
                    <Upload className="text-text-light group-hover:text-primary transition-colors mb-2" size={32} />
                    <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-light mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-text">Status:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <Field type="checkbox" name="status" className="sr-only peer" 
                      value="Active" 
                      checked={true} // Simplified for demo
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-3 text-sm font-medium text-text-muted">Active</span>
                  </label>
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
      </motion.div>
    </div>
  );
}
