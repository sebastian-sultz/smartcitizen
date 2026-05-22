"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { loginUser, forgetPassword } from "../api";
import { toast } from "sonner";

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
      try {
        if (view === "login") {
          const res = await loginUser({
            phone: values.mobileNumber,
            password: values.password,
          });
          toast.success(res.message || "Login successful!");
          // Wait briefly for toast
          await new Promise((resolve) => setTimeout(resolve, 800));
          window.location.href = "/citizen";
        } else if (view === "forgot") {
          setView("otp");
        } else if (view === "otp") {
          setView("reset");
        } else if (view === "reset") {
          await forgetPassword({
            phone: values.mobileNumber,
            new_password: values.newPassword,
          });
          toast.success("Password reset successfully. Please log in.");
          setView("login");
        }
      } catch (err: any) {
        console.error("Login/Auth action failed:", err);
      } finally {
        setSubmitting(false);
      }
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
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
          )}
          
          {view === "login" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[14px] font-bold text-text">Password</label>
                <Button 
                  type="button" 
                  variant="text"
                  onClick={() => setView("forgot")}
                  className="text-[12px] p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                  className="pr-12"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password ? (formik.errors.password as string) : undefined}
                />
                <Button 
                  type="button" 
                  variant="ghost-muted"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 -translate-y-1/2 p-1 w-auto h-auto"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </Button>
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
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword ? (formik.errors.newPassword as string) : undefined}
            />
          )}

          <Button 
            type="submit" 
            size="lg" 
            fullWidth
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
                Don&apos;t have an account? <Link href="/join_us" className="text-primary font-bold hover:underline">Become a Smart Citizen</Link>
              </p>
            </div>
          ) : (
            <div className="pt-4 text-center">
              <Button 
                type="button"
                variant="text"
                onClick={() => setView("login")}
                className="text-[14px] p-0 h-auto"
              >
                Back to Login
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
