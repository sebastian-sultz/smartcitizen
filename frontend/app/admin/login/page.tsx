"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LogIn, ShieldCheck, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser, logoutUser } from "@/features/shared/auth";
import { toast } from "sonner";
import { PHONE_REGEX } from "@/lib/regex";

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_REGEX, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
  password: Yup.string()
    .min(4, "Password too short")
    .required("Password is required"),
});

export default function LoginPage() {

  const formik = useFormik({
    initialValues: { phone: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await loginUser({
          phone: values.phone,
          password: values.password,
        });
        if (res.user.user_type !== "admin") {
          toast.error("Access Denied: Administrator privileges required.");
          await logoutUser();
          return;
        }
        toast.success(res.message || "Logged in successfully!");
        window.location.href = "/admin";
      } catch (err: unknown) {
        console.error("Admin login failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="animate-fade-in-up relative z-10 w-full max-w-md">
        <div className="bg-surface p-8 rounded-3xl shadow-2xl border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-2xl font-bold text-text">GSCF Admin</h1>
            <p className="text-text-muted text-sm">
              Sign in to manage the platform
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Mobile Number"
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                icon={<Phone size={18} />}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && formik.errors.phone ? (formik.errors.phone as string) : undefined}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password ? (formik.errors.password as string) : undefined}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer text-text-muted gap-2">
                <Checkbox />
                Remember me
              </label>
              <a
                href="#"
                className="text-primary font-bold hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={formik.isSubmitting}
              startIcon={
                !formik.isSubmitting && (
                  <LogIn
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )
              }
              className="w-full py-4 text-base group"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-text-light">
          Global Smart Citizens Foundation &bull; Version 2.0.0
        </p>
      </div>
    </div>
  );
}
