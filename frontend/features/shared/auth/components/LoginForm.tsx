"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { loginUser, forgetPassword, logoutUser, checkRole } from "../api";
import { toast } from "sonner";
import { phoneSchema, trimmedString } from "@/lib/validation";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"phone_entry" | "password_entry" | "forgot" | "reset">("phone_entry");

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      mobileNumber: phoneSchema("Mobile number is required"),
      password: trimmedString().when((_, schema) => 
        view === "password_entry" ? schema.required("Password is required") : schema.optional()
      ),
      newPassword: trimmedString().when((_, schema) => 
        view === "reset" ? schema.min(6, "Password must be at least 6 characters").required("New password is required") : schema.optional()
      ),
      confirmPassword: trimmedString().when((_, schema) => 
        view === "reset" 
          ? schema
              .required("Please confirm your new password")
              .oneOf([Yup.ref("newPassword")], "Passwords must match")
          : schema.optional()
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (view === "phone_entry") {
          const res = await checkRole({ phone: values.mobileNumber });
          if (res.authenticated) {
            toast.success(res.message || "Login successful!");
            // Wait briefly for toast
            await new Promise((resolve) => setTimeout(resolve, 800));
            window.location.href = "/citizen";
          } else if (res.password_required) {
            setView("password_entry");
          }
        } else if (view === "password_entry") {
          const res = await loginUser({
            phone: values.mobileNumber,
            password: values.password,
          });
          if (res.user.user_type === "admin") {
            toast.error("Access Denied: Admins must use the Admin portal to sign in.");
            await logoutUser();
            return;
          }
          toast.success(res.message || "Login successful!");
          // Wait briefly for toast
          await new Promise((resolve) => setTimeout(resolve, 800));
          window.location.href = "/citizen";
        } else if (view === "forgot") {
          setView("reset");
        } else if (view === "reset") {
          await forgetPassword({
            phone: values.mobileNumber,
            new_password: values.newPassword,
          });
          toast.success("Password reset successfully. Please log in.");
          setView("phone_entry");
        }
      } catch (err: unknown) {
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
          {view === "phone_entry" && "Smart Citizen Login"}
          {view === "password_entry" && "Enter Password"}
          {view === "forgot" && "Forgot Password"}
          {view === "reset" && "Reset Password"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {view === "password_entry" && (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-sm text-center flex flex-col items-center gap-1.5">
              <span>Logging in for <strong>{formik.values.mobileNumber}</strong></span>
              <Button 
                type="button" 
                variant="link"
                size="xs"
                onClick={() => setView("phone_entry")}
                className="p-0 h-auto font-bold"
              >
                Change mobile number
              </Button>
            </div>
          )}

          {(view === "phone_entry" || view === "forgot") && (
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
          )}
          
          {view === "password_entry" && (
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[14px] font-bold text-text ml-1">Password</span>
                <Button 
                  type="button" 
                  variant="text"
                  onClick={() => setView("forgot")}
                  className="text-[12px] p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password ? (formik.errors.password as string) : undefined}
              />
            </div>
          )}

          {view === "reset" && (
            <div className="space-y-4">
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
              <Input
                label="Confirm New Password"
                placeholder="••••••••"
                type="password"
                icon={<Lock size={20} />}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword ? (formik.errors.confirmPassword as string) : undefined}
              />
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            fullWidth
            isLoading={formik.isSubmitting}
          >
            {view === "phone_entry" && "Continue"}
            {view === "password_entry" && "Log In"}
            {view === "forgot" && "Reset Password"}
            {view === "reset" && "Reset Password"}
            <ArrowRight size={20} className="ml-2" />
          </Button>

          {view === "phone_entry" ? (
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
                onClick={() => setView("phone_entry")}
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
