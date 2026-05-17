"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LogIn, ShieldCheck, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(4, "Password too short").required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-surface p-8 rounded-3xl shadow-2xl border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-2xl font-bold text-text">GSCF Admin</h1>
            <p className="text-text-muted text-sm">Sign in to manage the platform</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log("Login Attempt:", values);
              // Mock login
              setTimeout(() => {
                router.push("/admin");
                setSubmitting(false);
              }, 1000);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-text-light tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                      <Field
                        name="email"
                        type="email"
                        placeholder="admin@smartcitizen.org"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 bg-bg border rounded-2xl outline-none transition-all focus:ring-2 focus:ring-primary/20",
                          errors.email && touched.email ? "border-red-50" : "border-border"
                        )}
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1 ml-1" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-text-light tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                      <Field
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 bg-bg border rounded-2xl outline-none transition-all focus:ring-2 focus:ring-primary/20",
                          errors.password && touched.password ? "border-red-500" : "border-border"
                        )}
                      />
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1 ml-1" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center cursor-pointer text-text-muted">
                    <input type="checkbox" className="mr-2 accent-primary" />
                    Remember me
                  </label>
                  <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  startIcon={!isSubmitting && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
                  className="w-full py-4 text-base group"
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center mt-8 text-xs text-text-light">
          Global Smart Citizens Foundation &bull; Version 2.0.0
        </p>
      </motion.div>
    </div>
  );
}

// Simple helper if lib/utils isn't exported or fully ready
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
