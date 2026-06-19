"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Lock, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { registerUser } from "../api";
import { toast } from "sonner";
import { nameSchema, phoneSchema, trimmedString } from "@/lib/validation";

export const RegisterForm = () => {
  const [step, setStep] = useState<"details" | "success">("details");
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
    },
    validationSchema: Yup.object().shape({
      fullName: nameSchema("Full Name is required").required("Full Name is required"),
      mobileNumber: phoneSchema("Mobile number is required").required("Mobile number is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const referralId = sessionStorage.getItem("gsc_referral_id") || undefined;
        const res = await registerUser({
          name: values.fullName,
          phone: values.mobileNumber,
          referral_id: referralId,
        });
        
        toast.success(res?.message || "Registration successful!");
        sessionStorage.removeItem("gsc_referral_id");
        // Use the first 8 characters of UUID for display ID
        const displayId = res?.user?.id 
          ? `GSC-${res.user.id.substring(0, 8).toUpperCase()}` 
          : "GSC-MEMBER";
        setGeneratedId(displayId);
        setStep("success");
      } catch (err: unknown) {
        console.error("Registration failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          {step === "details" && "Become a Smart Citizen"}
          {step === "success" && "Welcome to GSCF!"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "success" ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-text">Registration Complete!</h3>
            <div className="bg-bg-alt p-4 rounded-xl border border-border">
              <p className="text-text-muted text-sm mb-1">Your Smart Citizen ID</p>
              <p className="text-2xl font-bold text-primary tracking-widest">{generatedId}</p>
            </div>
            <p className="text-text-muted text-[15px] leading-relaxed">
              Keep this ID safe. You will need it to participate in awareness campaigns and volunteer programs.
            </p>
            <Button 
              fullWidth
              className="mt-4" 
              onClick={() => {
                window.location.href = "/citizen";
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="Your legal name"
              icon={<User size={20} />}
              name="fullName"
              value={formik.values.fullName}
              onChange={(e) => {
                const val = e.target.value.replace(/\s{2,}/g, " ");
                formik.setFieldValue("fullName", val);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName ? (formik.errors.fullName as string) : undefined}
            />
            <Input
              label="Mobile Number"
              placeholder="10-digit mobile number"
              type="tel"
              icon={<Phone size={20} />}
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

            <Button 
              type="submit" 
              size="lg" 
              fullWidth 
              isLoading={formik.isSubmitting}
            >
              Become a Smart Citizen
              <ArrowRight size={20} className="ml-2" />
            </Button>

            <div className="pt-4 text-center">
              <p className="text-[14px] text-text-muted">
                Already a Smart Citizen? <Link href="/member_login" className="text-primary font-bold hover:underline">Log In</Link>
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
