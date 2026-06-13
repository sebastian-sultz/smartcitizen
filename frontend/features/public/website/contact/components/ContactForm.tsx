"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAlert } from "@/components/ui/AlertProvider";
import { nameSchema, phoneSchema, emailSchema, trimmedString } from "@/lib/validation";

interface ContactFormProps {
  helpAreas: { title: string }[];
}

export const ContactForm = ({ helpAreas }: ContactFormProps) => {
  const { showAlert } = useAlert();
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      helpArea: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: nameSchema("Full name is required"),
      mobileNumber: phoneSchema("Mobile number is required"),
      email: emailSchema().nullable(),
      helpArea: trimmedString().required("Please select an area of help"),
      message: trimmedString().required("Please describe how we can assist you"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert({
        title: "Request Submitted",
        message: "Thank you! Your request has been submitted.",
        type: "success"
      });
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
            name="fullName"
            value={formik.values.fullName}
            onChange={(e) => {
              const val = e.target.value.replace(/\s{2,}/g, " ");
              formik.setFieldValue("fullName", val);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName ? (formik.errors.fullName as string) : undefined}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Mobile Number *"
              type="tel"
              placeholder="Your phone number"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                formik.setFieldValue("mobileNumber", val);
              }}
              onBlur={formik.handleBlur}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Your email address"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? (formik.errors.email as string) : undefined}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Area of Help Needed *</label>
            <Select 
              value={formik.values.helpArea} 
              onValueChange={(val) => formik.setFieldValue("helpArea", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent>
                {helpAreas.map((area, i) => (
                  <SelectItem key={i} value={area.title}>{area.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.helpArea && formik.errors.helpArea && (
              <p className="text-red-500 text-[12px] ml-1">{formik.errors.helpArea}</p>
            )}
          </div>
          <Textarea
            label="Your Message / Description *"
            rows={5} 
            placeholder="How can we assist you?" 
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && formik.errors.message ? formik.errors.message : undefined}
          />
          <Button 
            type="submit" 
            size="lg" 
            fullWidth 
            isLoading={formik.isSubmitting}
          >
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
