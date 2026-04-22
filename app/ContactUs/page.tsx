"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import PageHero from "@/components/layout/PageHero";
import { 
  BookOpen, Briefcase, UserCheck, Heart, Scale, Users, 
  MapPin, Phone, Mail, Loader2
} from "lucide-react";

// Custom Brand Icons
const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-1 2.17-2 2.85c.95.03 1.94-.35 2.5-1.15-.43.34-1.1.65-1.9.77-1-.62-2.32-1.02-3.6-1.02-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.12 1.03-3.74-.2-7.07-2-9.3-4.72-.4.7-.63 1.5-.63 2.37 0 1.56.78 2.94 2 3.75-.73-.03-1.42-.23-2-.55v.06c0 2.18 1.56 4 3.63 4.42-.38.1-.78.15-1.2.15-.3 0-.6-.03-.88-.1.57 1.8 2.25 3.1 4.25 3.13-1.57 1.23-3.55 1.97-5.7 1.97-.37 0-.73-.02-1.1-.06 2.02 1.3 4.43 2.05 7.02 2.05 8.42 0 13.03-6.97 13.03-13.03 0-.2 0-.4-.01-.6.9-.64 1.67-1.44 2.28-2.35z" />
  </svg>
);

const Youtube = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const helpAreas = [
  { icon: BookOpen, title: "Education & Career Guidance", desc: "Helping students and job seekers make the right choices." },
  { icon: Briefcase, title: "Employment & Skill Development", desc: "Connecting you with training and job opportunities." },
  { icon: UserCheck, title: "Women Empowerment & Safety", desc: "Supporting women to build confidence and safety." },
  { icon: Heart, title: "Health & Wellness Support", desc: "Guidance on healthcare and mental well-being." },
  { icon: Scale, title: "Legal Awareness & Basic Guidance", desc: "Helping you understand your legal rights." },
  { icon: Users, title: "Social Welfare & Community", desc: "Standing with communities for a better society." },
];

export default function ContactPage() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      helpArea: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address"),
      helpArea: Yup.string().required("Please select an area of help"),
      message: Yup.string().required("Please describe how we can assist you"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Thank you! Your request has been submitted. We will contact you soon.");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Get Help & Support" />

      <section className="py-24 bg-white">
        <div className="max-content">
          {/* Empathy Statement */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
              We Are Here to Listen, Support, and Guide You.
            </h2>
            <div className="space-y-6 text-text-muted text-[18px] leading-relaxed">
              <p>
                At GlobalSmart Citizens Foundation, we understand that every individual
                may face challenges at different stages of life. Our mission is to provide
                guidance, support, and connect you with the right resources to help you
                move forward.
              </p>
              <p className="font-display text-2xl font-bold text-primary italic">
                &quot;You are not alone. Reach out to us — We are here to help.&quot;
              </p>
              <p className="text-[15px] italic">
                Support provided is based on availability and voluntary efforts. We aim
                to create genuine impact through responsible assistance.
              </p>
            </div>
          </div>

          {/* Help Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {helpAreas.map((area, i) => (
              <div key={i} className="bg-bg p-8 rounded-3xl border border-border hover:border-primary/20 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <area.icon size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-text mb-2">{area.title}</h3>
                <p className="text-text-muted text-[15px]">{area.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Form */}
            <div className="flex-1">
              <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-border">
                <h3 className="font-display text-3xl font-bold text-text mb-8">Submit Your Request</h3>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all ${
                        formik.touched.fullName && formik.errors.fullName ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                      {...formik.getFieldProps("fullName")}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-red-500 text-[12px] ml-1">{formik.errors.fullName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Mobile Number *</label>
                      <input 
                        type="tel" 
                        placeholder="Your phone number" 
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
                      <label className="text-[14px] font-bold text-text ml-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="Your email address" 
                        className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all ${
                          formik.touched.email && formik.errors.email ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">Area of Help Needed *</label>
                    <select 
                      className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all appearance-none ${
                        formik.touched.helpArea && formik.errors.helpArea ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                      {...formik.getFieldProps("helpArea")}
                    >
                      <option value="">Select an area</option>
                      {helpAreas.map((area, i) => (
                        <option key={i} value={area.title}>{area.title}</option>
                      ))}
                    </select>
                    {formik.touched.helpArea && formik.errors.helpArea && (
                      <p className="text-red-500 text-[12px] ml-1">{formik.errors.helpArea}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">Your Message / Description *</label>
                    <textarea 
                      rows={5} 
                      placeholder="How can we assist you?" 
                      className={`w-full px-6 py-4 rounded-xl bg-bg border outline-none transition-all resize-none ${
                        formik.touched.message && formik.errors.message ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                      {...formik.getFieldProps("message")}
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-red-500 text-[12px] ml-1">{formik.errors.message}</p>
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
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/3 space-y-12">
              <div className="space-y-8">
                <h3 className="font-display text-3xl font-bold text-text">Find Us</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Address</p>
                      <p className="text-text-muted leading-relaxed">139/2 Bhulaika Pura, Teliarganj, Allahabad (U.P.) – 211001</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-text-muted">84 29 69 69 69</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text uppercase tracking-wider mb-1">Email</p>
                      <p className="text-text-muted break-all">globalsmartcitizensfoundation@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-border">
                <p className="font-bold text-text uppercase tracking-widest text-[13px]">Follow Us</p>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
