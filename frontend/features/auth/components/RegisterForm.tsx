"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Lock, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export const RegisterForm = () => {
  const [step, setStep] = useState<"details" | "otp" | "success">("details");
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      otp: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().when((_, schema) => 
        step === "details" ? schema.required("Full Name is required") : schema
      ),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .when((_, schema) => 
          step === "details" ? schema.required("Mobile number is required") : schema
        ),
      otp: Yup.string().when((_, schema) => 
        step === "otp" ? schema.length(4, "OTP must be 4 digits").required("OTP is required") : schema
      ),
      password: Yup.string().when((_, schema) => 
        step === "otp" ? schema.min(6, "Password must be at least 6 characters").required("Password is required") : schema
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (step === "details") {
        setStep("otp");
      } else if (step === "otp") {
        // Mock ID generation
        const mockId = `GSC${Math.floor(100000 + Math.random() * 900000)}`;
        setGeneratedId(mockId);
        setStep("success");
      }
      setSubmitting(false);
    },
  });

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          {step === "details" && "Become a Smart Citizen"}
          {step === "otp" && "Verify Mobile"}
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
            <Button className="w-full mt-4" >
              <Link href="/citizen">Go to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {step === "details" && (
              <>
                <Input
                  label="Full Name"
                  placeholder="Your legal name"
                  icon={<User size={20} />}
                  {...formik.getFieldProps("fullName")}
                  error={formik.touched.fullName ? (formik.errors.fullName as string) : undefined}
                />
                <Input
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  type="tel"
                  icon={<Phone size={20} />}
                  {...formik.getFieldProps("mobileNumber")}
                  error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
                />
              </>
            )}

            {step === "otp" && (
              <>
                <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-sm text-center">
                  OTP sent to {formik.values.mobileNumber}
                </div>
                <Input
                  label="Enter OTP"
                  placeholder="4-digit code"
                  type="text"
                  maxLength={4}
                  {...formik.getFieldProps("otp")}
                  error={formik.touched.otp ? (formik.errors.otp as string) : undefined}
                />
                <Input
                  label="Create Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock size={20} />}
                  {...formik.getFieldProps("password")}
                  error={formik.touched.password ? (formik.errors.password as string) : undefined}
                />
              </>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              isLoading={formik.isSubmitting}
            >
              {step === "details" ? "Send OTP" : "Complete Registration"}
              <ArrowRight size={20} className="ml-2" />
            </Button>

            {step === "details" && (
              <div className="pt-4 text-center">
                <p className="text-[14px] text-text-muted">
                  Already a Smart Citizen? <Link href="/member_login" className="text-primary font-bold hover:underline">Log In</Link>
                </p>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};
