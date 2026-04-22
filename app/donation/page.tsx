"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import PageHero from "@/components/layout/PageHero";
import { Heart, QrCode, Building2, Upload, Send, Loader2 } from "lucide-react";

export default function DonationPage() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
      amount: "",
      paymentMode: "",
      transactionId: "",
      receipt: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      amount: Yup.number().positive("Amount must be positive").required("Amount is required"),
      paymentMode: Yup.string().required("Please select a payment mode"),
      transactionId: Yup.string().required("Transaction ID is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Donation details submitted successfully! Our team will verify and issue your receipt soon.");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Support the Cause" />

      <section className="py-24 bg-white">
        <div className="max-content">
          {/* Impact Message */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">EVERY RUPEE COUNTS</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
              Together, We Create Real Change
            </h2>
            <div className="space-y-6 text-text-muted text-[17px] leading-relaxed">
              <p>
                At GlobalSmart Citizens Foundation, we are committed to creating meaningful
                and lasting change by empowering individuals and communities.
              </p>
              <p>
                We work towards education, healthcare, social welfare, and environmental
                sustainability. We help people find employment opportunities, support youth
                with skill development, and empower women through vocational training and
                sports initiatives. We believe in equal opportunities and encourage women
                and girls to dream, learn, and lead.
              </p>
              <p>
                Every donation is not just support — it is hope, empowerment, and
                a step towards a better tomorrow.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Donation Form */}
            <div className="flex-1">
              <div className="bg-bg rounded-[40px] p-8 md:p-12 border border-border">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-text">Make a Donation</h3>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Name *</label>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all ${
                          formik.touched.name && formik.errors.name ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Email ID *</label>
                      <input 
                        type="email" 
                        placeholder="email@example.com" 
                        className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all ${
                          formik.touched.email && formik.errors.email ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Mobile Number *</label>
                      <input 
                        type="tel" 
                        placeholder="10-digit number" 
                        className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all ${
                          formik.touched.mobileNumber && formik.errors.mobileNumber ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("mobileNumber")}
                      />
                      {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.mobileNumber}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-text ml-1">Amount (₹) *</label>
                      <input 
                        type="number" 
                        placeholder="Enter amount" 
                        className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all ${
                          formik.touched.amount && formik.errors.amount ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                        {...formik.getFieldProps("amount")}
                      />
                      {formik.touched.amount && formik.errors.amount && (
                        <p className="text-red-500 text-[12px] ml-1">{formik.errors.amount}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">Payment Mode *</label>
                    <select 
                      className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all appearance-none ${
                        formik.touched.paymentMode && formik.errors.paymentMode ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                      {...formik.getFieldProps("paymentMode")}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="IMPS">IMPS Transfer (INR)</option>
                      <option value="PhonePe">PhonePe Transfer</option>
                      <option value="GooglePay">Google Pay Transfer</option>
                      <option value="Paytm">Paytm</option>
                    </select>
                    {formik.touched.paymentMode && formik.errors.paymentMode && (
                      <p className="text-red-500 text-[12px] ml-1">{formik.errors.paymentMode}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">UTR / Transaction Hash / Slip *</label>
                    <input 
                      type="text" 
                      placeholder="Transaction Reference Number" 
                      className={`w-full px-6 py-4 rounded-xl bg-white border outline-none transition-all ${
                        formik.touched.transactionId && formik.errors.transactionId ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                      {...formik.getFieldProps("transactionId")}
                    />
                    {formik.touched.transactionId && formik.errors.transactionId && (
                      <p className="text-red-500 text-[12px] ml-1">{formik.errors.transactionId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-text ml-1">Receipt Upload</label>
                    <div className="relative">
                      <input type="file" className="hidden" id="receipt" onChange={(e) => formik.setFieldValue("receipt", e.currentTarget.files?.[0])} />
                      <label htmlFor="receipt" className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-white border border-border border-dashed cursor-pointer hover:bg-white/50 transition-all">
                        <span className="text-text-muted">{formik.values.receipt ? (formik.values.receipt as File).name : "Choose file..."}</span>
                        <Upload size={20} className="text-text-light" />
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    {formik.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Donate Now
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Payment Options */}
            <div className="lg:w-1/3 space-y-8">
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-border space-y-8">
                <div className="space-y-6 text-center">
                  <div className="flex items-center justify-center gap-3 text-primary">
                    <QrCode size={24} />
                    <h4 className="font-display text-2xl font-bold">UPI / QR Code</h4>
                  </div>
                  <p className="text-text-muted text-[14px]">Scan QR Code using any UPI app to make a quick and secure donation.</p>
                  <div className="aspect-square max-w-[200px] mx-auto bg-bg p-4 rounded-2xl border border-border overflow-hidden">
                    <img src="/assets/qr.png" alt="UPI QR Code" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                     {["Paytm", "PhonePe", "GPay", "UPI"].map(tag => (
                       <span key={tag} className="text-[11px] font-bold uppercase tracking-widest text-text-light px-2 py-1 bg-bg border border-border rounded-md">{tag}</span>
                     ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-border space-y-6">
                  <div className="flex items-center justify-center gap-3 text-primary">
                    <Building2 size={24} />
                    <h4 className="font-display text-2xl font-bold">Bank Transfer</h4>
                  </div>
                  <div className="space-y-4 bg-bg p-6 rounded-2xl border border-border text-[14px]">
                    <div className="space-y-1">
                      <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Account Name</p>
                      <p className="font-bold text-text">Global Smart Citizens Foundation</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Bank</p>
                      <p className="font-bold text-text">HDFC Bank</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Account Number</p>
                      <p className="font-bold text-text tracking-widest">50200119596441</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">IFSC Code</p>
                      <p className="font-bold text-text tracking-widest">HDFC0000226</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
