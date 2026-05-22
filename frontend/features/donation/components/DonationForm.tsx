"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Heart, Upload, Send, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/Badge";
import { useAlert } from "@/components/ui/AlertProvider";

export const DonationForm = () => {
  const { showAlert } = useAlert();
  const [step, setStep] = useState<"form" | "success">("form");
  const [trxDetails, setTrxDetails] = useState({ id: "", amount: "" });

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
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setTrxDetails({
        id: values.transactionId || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: values.amount
      });
      setStep("success");
      setSubmitting(false);
    },
  });

  if (step === "success") {
    return (
      <Card className="flex-1 bg-bg border-border text-center py-8">
        <CardContent className="space-y-6">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-3xl font-display font-bold text-text">Donation Successful!</h3>
          <p className="text-text-muted text-[16px] max-w-md mx-auto">
            Thank you for your generous contribution of <span className="font-bold text-text">₹{trxDetails.amount}</span>. Your support empowers us to build a smarter nation.
          </p>
          
          <div className="bg-white p-6 rounded-2xl border border-border inline-block text-left w-full max-w-sm mt-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-text-muted text-[14px]">Transaction ID</span>
              <span className="font-mono font-bold text-text">{trxDetails.id}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-text-muted text-[14px]">Status</span>
              <Badge variant="success">Completed</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => showAlert({
                title: "Receipt Download",
                message: "Downloading PDF Receipt...",
                type: "info"
              })} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Download Receipt
            </Button>
            <Button onClick={() => window.location.href = "/citizen"} className="flex items-center gap-2">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name ? (formik.errors.name as string) : undefined}
            />
            <Input
              label="Email ID *"
              type="email"
              placeholder="email@example.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? (formik.errors.email as string) : undefined}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Mobile Number *"
              type="tel"
              placeholder="10-digit number"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber ? (formik.errors.mobileNumber as string) : undefined}
            />
            <Input
              label="Amount (₹) *"
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount ? (formik.errors.amount as string) : undefined}
            />
          </div>
          
          <div className="space-y-2">
            <label id="payment-mode-label" htmlFor="paymentMode" className="text-[14px] font-bold text-text ml-1 block">Payment Mode *</label>
            <Select 
              value={formik.values.paymentMode} 
              onValueChange={(val) => formik.setFieldValue("paymentMode", val)}
            >
              <SelectTrigger id="paymentMode" aria-labelledby="payment-mode-label" className="w-full bg-white">
                <SelectValue placeholder="Select Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMPS">IMPS Transfer (INR)</SelectItem>
                <SelectItem value="PhonePe">PhonePe Transfer</SelectItem>
                <SelectItem value="GooglePay">Google Pay Transfer</SelectItem>
                <SelectItem value="Paytm">Paytm</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.paymentMode && formik.errors.paymentMode && (
              <p className="text-red-500 text-[12px] ml-1">{formik.errors.paymentMode}</p>
            )}
          </div>

          <Input
            label="UTR / Transaction Hash / Slip *"
            placeholder="Transaction Reference Number"
            name="transactionId"
            value={formik.values.transactionId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.transactionId ? (formik.errors.transactionId as string) : undefined}
          />

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-text ml-1 block">Receipt Upload</label>
            <div className="relative">
              <input 
                type="file" 
                className="sr-only peer" 
                id="receipt" 
                onChange={(e) => formik.setFieldValue("receipt", e.currentTarget.files?.[0])} 
              />
              <label htmlFor="receipt" className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-white border border-border border-dashed cursor-pointer hover:bg-white/50 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
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
