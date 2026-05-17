"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"login" | "forgot" | "otp" | "reset">("login");

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      password: "",
      otp: "",
      newPassword: "",
    },
    validationSchema: Yup.object().shape({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      password: Yup.string().when((_, schema) => 
        view === "login" ? schema.required("Password is required") : schema
      ),
      otp: Yup.string().when((_, schema) => 
        view === "otp" ? schema.length(4, "OTP must be 4 digits").required("OTP is required") : schema
      ),
      newPassword: Yup.string().when((_, schema) => 
        view === "reset" ? schema.min(6, "Password must be at least 6 characters").required("New password is required") : schema
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (view === "login") {
        alert("Login successful! Redirecting to dashboard...");
        window.location.href = "/citizen";
      } else if (view === "forgot") {
        setView("otp");
      } else if (view === "otp") {
        setView("reset");
      } else if (view === "reset") {
        alert("Password reset successfully. Please log in.");
        setView("login");
      }
      setSubmitting(false);
    },
  });

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          {view === "login" && "Smart Citizen Login"}
          {view === "forgot" && "Forgot Password"}
          {view === "otp" && "Verify OTP"}
          {view === "reset" && "Reset Password"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {(view === "login" || view === "forgot") && (
            <Input
              label="Mobile Number"
              placeholder="10-digit mobile number"
              type="tel"
              icon={<Phone size={20} />}
              {...formik.getFieldProps("mobileNumber")}
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
          )}
          
          {view === "login" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[14px] font-bold text-text">Password</label>
                <button 
                  type="button" 
                  onClick={() => setView("forgot")}
                  className="text-[12px] text-primary font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                  className="pr-12"
                  {...formik.getFieldProps("password")}
                  error={formik.touched.password ? (formik.errors.password as string) : undefined}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
          )}

          {view === "otp" && (
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
            </>
          )}

          {view === "reset" && (
            <Input
              label="New Password"
              placeholder="••••••••"
              type="password"
              icon={<Lock size={20} />}
              {...formik.getFieldProps("newPassword")}
              error={formik.touched.newPassword ? (formik.errors.newPassword as string) : undefined}
            />
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            {view === "login" && "Log In"}
            {view === "forgot" && "Send OTP"}
            {view === "otp" && "Verify OTP"}
            {view === "reset" && "Reset Password"}
            <ArrowRight size={20} className="ml-2" />
          </Button>

          {view === "login" ? (
            <div className="pt-4 text-center">
              <p className="text-[14px] text-text-muted">
                Don&apos;t have an account? <Link href="/JoinUs" className="text-primary font-bold hover:underline">Become a Smart Citizen</Link>
              </p>
            </div>
          ) : (
            <div className="pt-4 text-center">
              <button 
                type="button"
                onClick={() => setView("login")}
                className="text-[14px] text-primary font-bold hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
