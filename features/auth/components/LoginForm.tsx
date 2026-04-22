"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required("Email or Mobile is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Login successful! Redirecting to member dashboard...");
      setSubmitting(false);
    },
  });

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Member Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Mobile / Email"
            placeholder="Enter your registered info"
            icon={<User size={20} />}
            {...formik.getFieldProps("identifier")}
            error={formik.touched.identifier ? (formik.errors.identifier as string) : undefined}
          />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[14px] font-bold text-text">Password</label>
              <button type="button" className="text-[12px] text-primary font-bold hover:underline">Forgot password?</button>
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

          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            Log In
            <ArrowRight size={20} className="ml-2" />
          </Button>

          <div className="pt-4 text-center">
            <p className="text-[14px] text-text-muted">
              Don&apos;t have an account? <Link href="/JoinUs" className="text-primary font-bold hover:underline">Join as a Volunteer</Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
