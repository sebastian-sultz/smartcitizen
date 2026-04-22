"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
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
    <main className="min-h-[calc(100vh-80px)] bg-bg flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10 space-y-4">
          <Link href="/" className="flex flex-col items-center group">
            <span className="font-display text-3xl font-black leading-none group-hover:text-primary transition-colors">
              GlobalSmart
            </span>
            <span className="font-body text-[12px] uppercase tracking-widest font-light opacity-80 text-text-muted">
              Citizens Foundation
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-border">
          <h2 className="font-display text-3xl font-bold text-text mb-8 text-center">Member Login</h2>
          
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-text ml-1">Mobile / Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter your registered info" 
                  className={`w-full pl-12 pr-6 py-4 rounded-xl bg-bg border outline-none transition-all ${
                    formik.touched.identifier && formik.errors.identifier ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                  {...formik.getFieldProps("identifier")}
                />
              </div>
              {formik.touched.identifier && formik.errors.identifier && (
                <p className="text-red-500 text-[12px] ml-1">{formik.errors.identifier}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[14px] font-bold text-text">Password</label>
                <button type="button" className="text-[12px] text-primary font-bold hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`w-full pl-12 pr-12 py-4 rounded-xl bg-bg border outline-none transition-all ${
                    formik.touched.password && formik.errors.password ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                  {...formik.getFieldProps("password")}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[12px] ml-1">{formik.errors.password}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[14px] text-text-muted">
                Don&apos;t have an account? <Link href="/JoinUs" className="text-primary font-bold hover:underline">Join as a Volunteer</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[14px] text-text-light hover:text-primary transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
