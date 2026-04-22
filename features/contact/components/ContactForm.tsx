"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface ContactFormProps {
  helpAreas: { title: string }[];
}

export const ContactForm = ({ helpAreas }: ContactFormProps) => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      helpArea: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address"),
      helpArea: Yup.string().required("Please select an area of help"),
      message: Yup.string().required("Please describe how we can assist you"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Thank you! Your request has been submitted.");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <Card className="flex-1 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Submit Your Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Full Name *"
            placeholder="Enter your name"
            {...formik.getFieldProps("fullName")}
            error={formik.touched.fullName ? (formik.errors.fullName as string) : undefined}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Mobile Number *"
              type="tel"
              placeholder="Your phone number"
              {...formik.getFieldProps("mobileNumber")}
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Your email address"
              {...formik.getFieldProps("email")}
              error={formik.touched.email ? (formik.errors.email as string) : undefined}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Area of Help Needed *</label>
            <select 
              className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all appearance-none ${
                formik.touched.helpArea && formik.errors.helpArea ? "border-red-500" : "border-border focus:border-primary"
              }`}
              {...formik.getFieldProps("helpArea")}
            >
              <option value="">Select an area</option>
              {helpAreas.map((area, i) => (
                <option key={i} value={area.title}>{area.title}</option>
              ))}
            </select>
            {formik.touched.helpArea && formik.errors.helpArea && (
              <p className="text-red-500 text-[12px] ml-1">{formik.errors.helpArea}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Your Message / Description *</label>
            <textarea 
              rows={5} 
              placeholder="How can we assist you?" 
              className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all resize-none ${
                formik.touched.message && formik.errors.message ? "border-red-500" : "border-border focus:border-primary"
              }`}
              {...formik.getFieldProps("message")}
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-[12px] ml-1">{formik.errors.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
