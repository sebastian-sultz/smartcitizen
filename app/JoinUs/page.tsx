"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import PageHero from "@/components/layout/PageHero";
import { CheckCircle2, UserPlus, Shield, Loader2 } from "lucide-react";
import Link from "next/link";

export default function JoinUsPage() {
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
      alert("Registration successful! Welcome to the Foundation. We will contact you shortly.");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Join as a Volunteer" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left - Why Join */}
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">MAKE AN IMPACT</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Become a Smart Citizen</h2>
                <p className="text-text-muted text-[18px] leading-relaxed">
                  Join a growing movement of aware, responsible, and empowered volunteers
                  who are making real differences in communities across India.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 size={24} />
                    We Welcome:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Social workers and community volunteers",
                      "Educators, counselors, and trainers",
                      "Legal, digital, and health awareness professionals",
                      "Students and youth volunteers"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border text-[15px] text-text-muted">
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 size={24} />
                    What You Gain:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Meaningful social impact",
                      "Learning and leadership opportunities",
                      "Community recognition",
                      "Nation-building contribution"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border text-[15px] text-text-muted">
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:w-[450px] w-full">
              <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-border relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <UserPlus size={24} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-text">Register Now</h3>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Your legal name" 
                        className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all ${
                          formik.touched.fullName && formik.errors.fullName ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("fullName")}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Mobile Number *</label>
                      <input 
                        type="tel" 
                        placeholder="10-digit mobile number" 
                        className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all ${
                          formik.touched.mobileNumber && formik.errors.mobileNumber ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("mobileNumber")}
                      />
                      {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.mobileNumber}</p>
                      )}
                    </div>
                    
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

                    <button 
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      {formik.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Registering...
                        </>
                      ) : (
                        "Register as Volunteer"
                      )}
                    </button>

                    <p className="text-center text-[14px] text-text-muted">
                      Already have an account? <Link href="/MemberLogin" className="text-primary font-bold hover:underline">Log In</Link>
                    </p>

                    <div className="pt-6 border-t border-border mt-8">
                      <div className="flex gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                        <Shield className="text-accent shrink-0 mt-0.5" size={18} />
                        <p className="text-[12px] text-amber-900/70 leading-relaxed">
                          <span className="font-bold text-accent">Note:</span> A nominal one-time contribution of ₹100 may be made at the time
                          of onboarding to support administrative activities and volunteer coordination.
                          This is voluntary in nature.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
