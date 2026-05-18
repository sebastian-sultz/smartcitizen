"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Heart, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export const DonationForm = () => {
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
      alert("Donation details submitted successfully!");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <Card className="flex-1 bg-bg border-border">
      <CardHeader className="flex-row items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
          <Heart size={24} fill="currentColor" />
        </div>
        <CardTitle>Make a Donation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name *"
              placeholder="Full Name"
              {...formik.getFieldProps("name")}
              error={formik.touched.name ? (formik.errors.name as string) : undefined}
            />
            <Input
              label="Email ID *"
              type="email"
              placeholder="email@example.com"
              {...formik.getFieldProps("email")}
              error={formik.touched.email ? (formik.errors.email as string) : undefined}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Mobile Number *"
              type="tel"
              placeholder="10-digit number"
              {...formik.getFieldProps("mobileNumber")}
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
            <Input
              label="Amount (₹) *"
              type="number"
              placeholder="Enter amount"
              {...formik.getFieldProps("amount")}
              error={formik.touched.amount ? (formik.errors.amount as string) : undefined}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Payment Mode *</label>
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

          <Input
            label="UTR / Transaction Hash / Slip *"
            placeholder="Transaction Reference Number"
            {...formik.getFieldProps("transactionId")}
            error={formik.touched.transactionId ? (formik.errors.transactionId as string) : undefined}
          />

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Receipt Upload</label>
            <div className="relative">
              <input 
                type="file" 
                className="hidden" 
                id="receipt" 
                onChange={(e) => formik.setFieldValue("receipt", e.currentTarget.files?.[0])} 
              />
              <label htmlFor="receipt" className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-white border border-border border-dashed cursor-pointer hover:bg-white/50 transition-all">
                <span className="text-text-muted">{formik.values.receipt ? (formik.values.receipt as File).name : "Choose file..."}</span>
                <Upload size={20} className="text-text-light" />
              </label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="accent" 
            size="lg" 
            className="w-full" 
            isLoading={formik.isSubmitting}
          >
            <Send size={20} className="mr-2" />
            Donate Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
