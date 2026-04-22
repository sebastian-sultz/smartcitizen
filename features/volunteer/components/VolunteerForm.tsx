"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export const VolunteerForm = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      acceptTerms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Registration successful! Welcome to the Foundation.");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <Card className="lg:w-[450px] w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <UserPlus size={24} />
        </div>
        <CardTitle>Register Now</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Full Name *"
            placeholder="Your legal name"
            {...formik.getFieldProps("fullName")}
            error={formik.touched.fullName ? (formik.errors.fullName as string) : undefined}
          />
          <Input
            label="Mobile Number *"
            type="tel"
            placeholder="10-digit mobile number"
            {...formik.getFieldProps("mobileNumber")}
            error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
          />
          
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2">
              <input 
                type="checkbox" 
                className="mt-1.5 w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                id="acceptTerms"
                {...formik.getFieldProps("acceptTerms")}
              />
              <label htmlFor="acceptTerms" className="text-[13px] text-text-muted leading-relaxed">
                I have read & accept the <Link href="/term" className="text-primary font-bold hover:underline">Terms, Conditions & Volunteer Guidelines</Link>
              </label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <p className="text-red-500 text-[12px] ml-1">{formik.errors.acceptTerms}</p>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            Register as Volunteer
          </Button>

          <p className="text-center text-[14px] text-text-muted">
            Already have an account? <Link href="/MemberLogin" className="text-primary font-bold hover:underline">Log In</Link>
          </p>

          <div className="pt-6 border-t border-border mt-8">
            <div className="flex gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <Shield className="text-accent shrink-0 mt-0.5" size={18} />
              <p className="text-[12px] text-amber-900/70 leading-relaxed">
                <span className="font-bold text-accent">Note:</span> A nominal one-time contribution of ₹100 may be made at the time
                of onboarding to support administrative activities. This is voluntary.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
